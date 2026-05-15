import { describe, it, expect } from "vitest";
import handlers from "../werewolf.js";

describe("werewolf handlers — record/undo round trip", () => {
  // ── attribute_raise ──────────────────────────────────────────────────────
  it("attribute_raise: record then undo restores prior points and spent_xp", () => {
    const charState = {
      attributes: [{ name: "Strength", points: 2 }],
      spent_xp: 10,
    };
    const input = { attributeName: "Strength" };
    const entry = handlers.attribute_raise.record(charState, input);

    expect(entry.type).toBe("attribute_raise");
    expect(entry.cost).toBe(15); // (2+1)*5
    expect(entry.payload).toEqual({
      attribute: "Strength",
      priorValue: 2,
      newValue: 3,
      priorSpentXp: 10,
    });

    // simulate spendXp.vue mutation
    charState.attributes[0].points = 3;
    charState.spent_xp = 25;

    handlers.attribute_raise.undo(charState, entry);
    expect(charState.attributes[0].points).toBe(2);
    expect(charState.spent_xp).toBe(10);
  });

  // ── skill_raise ──────────────────────────────────────────────────────────
  it("skill_raise: record then undo restores prior level and spent_xp", () => {
    const charState = { skills: { brawl: 1 }, spent_xp: 5 };
    const entry = handlers.skill_raise.record(charState, { skillName: "Brawl" });

    expect(entry.type).toBe("skill_raise");
    expect(entry.cost).toBe(6); // (1+1)*3
    expect(entry.payload).toEqual({
      skill: "brawl",
      priorValue: 1,
      newValue: 2,
      priorSpentXp: 5,
    });

    charState.skills.brawl = 2;
    charState.spent_xp = 11;

    handlers.skill_raise.undo(charState, entry);
    expect(charState.skills.brawl).toBe(1);
    expect(charState.spent_xp).toBe(5);
  });

  it("skill_raise: first dot (0 → 1) costs 3", () => {
    const charState = { skills: { athletics: 0 }, spent_xp: 0 };
    const entry = handlers.skill_raise.record(charState, { skillName: "Athletics" });

    expect(entry.cost).toBe(3);
    expect(entry.payload).toEqual({
      skill: "athletics",
      priorValue: 0,
      newValue: 1,
      priorSpentXp: 0,
    });

    charState.skills.athletics = 1;
    charState.spent_xp = 3;

    handlers.skill_raise.undo(charState, entry);
    expect(charState.skills.athletics).toBe(0);
    expect(charState.spent_xp).toBe(0);
  });

  // ── specialty ────────────────────────────────────────────────────────────
  it("specialty: record adds entryId, undo removes matching item and restores spent_xp", () => {
    const charState = { specialtiesFromXp: [], spent_xp: 6 };
    const entry = handlers.specialty.record(charState, {
      skill: "Streetwise",
      specialty: "Pickpocket",
    });

    expect(entry.type).toBe("specialty");
    expect(entry.cost).toBe(3);
    expect(entry.payload.entryId).toMatch(/.+/);
    expect(entry.payload.skill).toBe("Streetwise");
    expect(entry.payload.specialty).toBe("Pickpocket");
    expect(entry.payload.priorSpentXp).toBe(6);

    // simulate spendXp.vue mutation
    charState.specialtiesFromXp.push({
      entryId: entry.payload.entryId,
      skill: "Streetwise",
      specialty: "Pickpocket",
    });
    charState.spent_xp = 9;

    handlers.specialty.undo(charState, entry);
    expect(charState.specialtiesFromXp).toEqual([]);
    expect(charState.spent_xp).toBe(6);
  });

  // ── native_gift ──────────────────────────────────────────────────────────
  it("native_gift: record then undo removes gift from native array, restores gift_total and spent_xp", () => {
    const charState = {
      purchased_gifts: { native: [], auspice: [], tribe: [], rite: [] },
      gift_total: 2,
      spent_xp: 15,
    };
    const giftObj = { gift_id: 42, gift_name: "Sense Wyrm", gift_description: "..." };
    const input = { giftSelection: giftObj };
    const entry = handlers.native_gift.record(charState, input);

    expect(entry.type).toBe("native_gift");
    expect(entry.cost).toBe(6); // (2+1)*2
    expect(entry.payload).toMatchObject({
      giftName: "Sense Wyrm",
      priorGiftTotal: 2,
      priorSpentXp: 15,
    });
    expect(entry.payload.entryId).toMatch(/.+/);

    // simulate spendXp.vue mutation
    charState.purchased_gifts.native.push({ ...giftObj, entryId: entry.payload.entryId });
    charState.gift_total = 3;
    charState.spent_xp = 21;

    handlers.native_gift.undo(charState, entry);
    expect(charState.purchased_gifts.native).toEqual([]);
    expect(charState.gift_total).toBe(2);
    expect(charState.spent_xp).toBe(15);
  });

  // ── tribe_gift ───────────────────────────────────────────────────────────
  it("tribe_gift: record then undo removes gift from tribe array, restores gift_total and spent_xp", () => {
    const charState = {
      purchased_gifts: { native: [], auspice: [], tribe: [], rite: [] },
      gift_total: 1,
      spent_xp: 8,
    };
    const giftObj = { gift_id: 77, gift_name: "Pack Tactics", gift_description: "..." };
    const input = { giftSelection: giftObj };
    const entry = handlers.tribe_gift.record(charState, input);

    expect(entry.type).toBe("tribe_gift");
    expect(entry.cost).toBe(4); // (1+1)*2
    expect(entry.payload).toMatchObject({
      giftName: "Pack Tactics",
      priorGiftTotal: 1,
      priorSpentXp: 8,
    });
    expect(entry.payload.entryId).toMatch(/.+/);

    // simulate spendXp.vue mutation
    charState.purchased_gifts.tribe.push({ ...giftObj, entryId: entry.payload.entryId });
    charState.gift_total = 2;
    charState.spent_xp = 12;

    handlers.tribe_gift.undo(charState, entry);
    expect(charState.purchased_gifts.tribe).toEqual([]);
    expect(charState.gift_total).toBe(1);
    expect(charState.spent_xp).toBe(8);
  });

  // ── auspice_gift ─────────────────────────────────────────────────────────
  it("auspice_gift: record then undo removes gift from auspice array, restores gift_total and spent_xp", () => {
    const charState = {
      purchased_gifts: { native: [], auspice: [], tribe: [], rite: [] },
      gift_total: 0,
      spent_xp: 0,
    };
    const giftObj = { gift_id: 5, gift_name: "Heightened Senses", gift_description: "..." };
    const input = { giftSelection: giftObj };
    const entry = handlers.auspice_gift.record(charState, input);

    expect(entry.type).toBe("auspice_gift");
    expect(entry.cost).toBe(2); // (0+1)*2
    expect(entry.payload).toMatchObject({
      giftName: "Heightened Senses",
      priorGiftTotal: 0,
      priorSpentXp: 0,
    });
    expect(entry.payload.entryId).toMatch(/.+/);

    // simulate spendXp.vue mutation
    charState.purchased_gifts.auspice.push({ ...giftObj, entryId: entry.payload.entryId });
    charState.gift_total = 1;
    charState.spent_xp = 2;

    handlers.auspice_gift.undo(charState, entry);
    expect(charState.purchased_gifts.auspice).toEqual([]);
    expect(charState.gift_total).toBe(0);
    expect(charState.spent_xp).toBe(0);
  });

  // ── rite ─────────────────────────────────────────────────────────────────
  it("rite: record then undo removes rite from rite array and restores spent_xp", () => {
    const charState = {
      purchased_gifts: { native: [], auspice: [], tribe: [], rite: [] },
      spent_xp: 20,
    };
    const riteObj = {
      rite_id: 3,
      rite_name: "Rite of Cleansing",
      rite_description: "...",
    };
    const input = { riteSelection: riteObj };
    const entry = handlers.rite.record(charState, input);

    expect(entry.type).toBe("rite");
    expect(entry.cost).toBe(5); // flat
    expect(entry.payload).toMatchObject({
      riteName: "Rite of Cleansing",
      priorSpentXp: 20,
    });
    expect(entry.payload.entryId).toMatch(/.+/);

    // simulate spendXp.vue mutation
    charState.purchased_gifts.rite.push({ ...riteObj, entryId: entry.payload.entryId });
    charState.spent_xp = 25;

    handlers.rite.undo(charState, entry);
    expect(charState.purchased_gifts.rite).toEqual([]);
    expect(charState.spent_xp).toBe(20);
  });

  // ── renown ───────────────────────────────────────────────────────────────
  it("renown: record then undo restores purchased_renown counter and spent_xp", () => {
    const charState = {
      purchased_renown: { glory: 1, honor: 0, wisdom: 0 },
      tribe_renown: { glory: 1, honor: 1, wisdom: 1 },
      spent_xp: 10,
    };
    // renownTotal.glory = tribe(1) + purchased(1) = 2; cost = (2+1)*5 = 15
    const input = { renownName: "Glory", renownTotal: 2 };
    const entry = handlers.renown.record(charState, input);

    expect(entry.type).toBe("renown");
    expect(entry.cost).toBe(15); // (2+1)*5
    expect(entry.payload).toEqual({
      counter: "glory",
      priorValue: 1,
      newValue: 2,
      priorSpentXp: 10,
    });

    // simulate spendXp.vue mutation
    charState.purchased_renown.glory = 2;
    charState.spent_xp = 25;

    handlers.renown.undo(charState, entry);
    expect(charState.purchased_renown.glory).toBe(1);
    expect(charState.spent_xp).toBe(10);
  });

  it("renown: first dot (total 0 → 1) costs 5", () => {
    const charState = {
      purchased_renown: { glory: 0, honor: 0, wisdom: 0 },
      tribe_renown: { glory: 0, honor: 0, wisdom: 0 },
      spent_xp: 0,
    };
    // renownTotal.honor = 0; cost = (0+1)*5 = 5
    const input = { renownName: "Honor", renownTotal: 0 };
    const entry = handlers.renown.record(charState, input);

    expect(entry.cost).toBe(5); // (0+1)*5
    expect(entry.payload.counter).toBe("honor");
    expect(entry.payload.priorValue).toBe(0);
    expect(entry.payload.newValue).toBe(1);

    charState.purchased_renown.honor = 1;
    charState.spent_xp = 5;

    handlers.renown.undo(charState, entry);
    expect(charState.purchased_renown.honor).toBe(0);
    expect(charState.spent_xp).toBe(0);
  });

  // ── advantage ────────────────────────────────────────────────────────────
  it("advantage: record delta dots, undo restores advantagePoints and spent_xp", () => {
    const charState = { advantagePoints: 2, spent_xp: 6 };
    const entry = handlers.advantage.record(charState, { delta: 2 });

    expect(entry.type).toBe("advantage");
    expect(entry.cost).toBe(6); // 2*3
    expect(entry.payload).toEqual({
      counter: "advantagePoints",
      priorValue: 2,
      delta: 2,
      priorSpentXp: 6,
    });

    // simulate spendXp.vue mutation
    charState.advantagePoints = 4;
    charState.spent_xp = 12;

    handlers.advantage.undo(charState, entry);
    expect(charState.advantagePoints).toBe(2);
    expect(charState.spent_xp).toBe(6);
  });

  // ── flaw ─────────────────────────────────────────────────────────────────
  it("flaw: record delta dots, undo restores flaws_remaining and spent_xp", () => {
    const charState = { flaws_remaining: 0, spent_xp: 0 };
    const entry = handlers.flaw.record(charState, { delta: 1 });

    expect(entry.type).toBe("flaw");
    expect(entry.cost).toBe(3); // 1*3
    expect(entry.payload).toEqual({
      counter: "flaws_remaining",
      priorValue: 0,
      delta: 1,
      priorSpentXp: 0,
    });

    // simulate spendXp.vue mutation
    charState.flaws_remaining = 1;
    charState.spent_xp = 3;

    handlers.flaw.undo(charState, entry);
    expect(charState.flaws_remaining).toBe(0);
    expect(charState.spent_xp).toBe(0);
  });
});
