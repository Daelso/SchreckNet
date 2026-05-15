import { describe, it, expect } from "vitest";
import handlers from "../vtm.js";

describe("vtm handlers — record/undo round trip", () => {
  it("attribute_raise: record then undo restores prior points", () => {
    const charState = {
      attributes: [{ name: "Strength", points: 2 }],
    };
    const input = { attributeName: "Strength" };
    const entry = handlers.attribute_raise.record(charState, input);

    expect(entry.type).toBe("attribute_raise");
    expect(entry.cost).toBe(15); // (2+1)*5
    expect(entry.payload).toEqual({
      attribute: "Strength",
      priorValue: 2,
      newValue: 3,
    });

    // simulate spendXp.vue mutation
    charState.attributes[0].points = 3;

    handlers.attribute_raise.undo(charState, entry);
    expect(charState.attributes[0].points).toBe(2);
  });

  it("skill_raise: record then undo restores prior level", () => {
    const charState = { skills: { brawl: 1 } };
    const entry = handlers.skill_raise.record(charState, { skillName: "Brawl" });
    expect(entry.cost).toBe(6); // (1+1)*3
    expect(entry.payload).toEqual({ skill: "brawl", priorValue: 1, newValue: 2 });
    charState.skills.brawl = 2;
    handlers.skill_raise.undo(charState, entry);
    expect(charState.skills.brawl).toBe(1);
  });

  it("skill_raise: first dot (0 → 1) costs 3", () => {
    const charState = { skills: { athletics: 0 } };
    const entry = handlers.skill_raise.record(charState, { skillName: "Athletics" });
    expect(entry.cost).toBe(3);
    expect(entry.payload).toEqual({ skill: "athletics", priorValue: 0, newValue: 1 });
    charState.skills.athletics = 1;
    handlers.skill_raise.undo(charState, entry);
    expect(charState.skills.athletics).toBe(0);
  });

  it("specialty: record adds an entryId, undo removes the matching item", () => {
    const charState = { specialtiesFromXp: [] };
    const entry = handlers.specialty.record(charState, {
      skill: "Streetwise",
      specialty: "Pickpocket",
    });
    expect(entry.cost).toBe(3);
    expect(entry.payload.entryId).toMatch(/.+/);
    charState.specialtiesFromXp.push({
      entryId: entry.payload.entryId,
      skill: "Streetwise",
      specialty: "Pickpocket",
    });
    handlers.specialty.undo(charState, entry);
    expect(charState.specialtiesFromXp).toEqual([]);
  });

  it("clan_discipline: record then undo restores level and removes the power", () => {
    const charState = {
      disciplines: { Dominate: 1 },
      disciplineSkillsObj: [],
    };
    const entry = handlers.clan_discipline.record(charState, {
      discipline: "Dominate",
      power: "Mesmerize",
    });
    expect(entry.cost).toBe(10); // (1+1)*5
    expect(entry.payload).toMatchObject({
      discipline: "Dominate",
      priorValue: 1,
      newValue: 2,
      power: "Mesmerize",
    });
    expect(entry.payload.entryId).toMatch(/.+/);

    charState.disciplines.Dominate = 2;
    charState.disciplineSkillsObj.push({
      entryId: entry.payload.entryId,
      discipline: "Dominate",
      skill: "Mesmerize",
    });

    handlers.clan_discipline.undo(charState, entry);
    expect(charState.disciplines.Dominate).toBe(1);
    expect(charState.disciplineSkillsObj).toEqual([]);
  });

  it("caitiff_discipline first-dot: discipline key missing → cost 6", () => {
    const charState = {
      disciplines: {},
      disciplineSkillsObj: [],
    };
    const entry = handlers.caitiff_discipline.record(charState, {
      discipline: "Celerity",
      power: "Cat's Grace",
    });
    expect(entry.type).toBe("caitiff_discipline");
    expect(entry.cost).toBe(6);
    expect(entry.payload).toMatchObject({
      discipline: "Celerity",
      priorValue: 0,
      newValue: 1,
      power: "Cat's Grace",
    });
    expect(entry.payload.entryId).toMatch(/.+/);

    // simulate spendXp.vue mutation
    charState.disciplines.Celerity = 1;
    charState.disciplineSkillsObj.push({
      entryId: entry.payload.entryId,
      discipline: "Celerity",
      skill: "Cat's Grace",
    });

    handlers.caitiff_discipline.undo(charState, entry);
    expect(charState.disciplines.Celerity).toBe(0);
    expect(charState.disciplineSkillsObj).toEqual([]);
  });

  it("caitiff_discipline subsequent-dot: cost (prior+1)*6", () => {
    const charState = {
      disciplines: { Celerity: 2 },
      disciplineSkillsObj: [],
    };
    const entry = handlers.caitiff_discipline.record(charState, {
      discipline: "Celerity",
      power: "Blink",
    });
    expect(entry.cost).toBe(18); // (2+1)*6
    expect(entry.payload.priorValue).toBe(2);
    expect(entry.payload.newValue).toBe(3);

    charState.disciplines.Celerity = 3;
    charState.disciplineSkillsObj.push({
      entryId: entry.payload.entryId,
      discipline: "Celerity",
      skill: "Blink",
    });

    handlers.caitiff_discipline.undo(charState, entry);
    expect(charState.disciplines.Celerity).toBe(2);
    expect(charState.disciplineSkillsObj).toEqual([]);
  });

  it("out_of_clan_discipline new-to-clan (prior 0 / undefined): cost 7", () => {
    const charState = {
      disciplines: {},
      disciplineSkillsObj: [],
    };
    const entry = handlers.out_of_clan_discipline.record(charState, {
      discipline: "Fortitude",
      power: "Resilience",
    });
    expect(entry.type).toBe("out_of_clan_discipline");
    expect(entry.cost).toBe(7); // (0+1)*7
    expect(entry.payload).toMatchObject({
      discipline: "Fortitude",
      priorValue: 0,
      newValue: 1,
      power: "Resilience",
    });
    expect(entry.payload.entryId).toMatch(/.+/);

    // simulate: first purchase sets to 1
    charState.disciplines.Fortitude = 1;
    charState.disciplineSkillsObj.push({
      entryId: entry.payload.entryId,
      discipline: "Fortitude",
      skill: "Resilience",
    });

    handlers.out_of_clan_discipline.undo(charState, entry);
    // priorValue was 0, so undo restores to 0
    expect(charState.disciplines.Fortitude).toBe(0);
    expect(charState.disciplineSkillsObj).toEqual([]);
  });

  it("out_of_clan_discipline already-known: cost (prior+1)*7", () => {
    const charState = {
      disciplines: { Fortitude: 1 },
      disciplineSkillsObj: [],
    };
    const entry = handlers.out_of_clan_discipline.record(charState, {
      discipline: "Fortitude",
      power: "Toughness",
    });
    expect(entry.cost).toBe(14); // (1+1)*7
    expect(entry.payload.priorValue).toBe(1);
    expect(entry.payload.newValue).toBe(2);

    charState.disciplines.Fortitude = 2;
    charState.disciplineSkillsObj.push({
      entryId: entry.payload.entryId,
      discipline: "Fortitude",
      skill: "Toughness",
    });

    handlers.out_of_clan_discipline.undo(charState, entry);
    expect(charState.disciplines.Fortitude).toBe(1);
    expect(charState.disciplineSkillsObj).toEqual([]);
  });

  it("blood_potency: record then undo restores potency", () => {
    const charState = { potency: 2 };
    const entry = handlers.blood_potency.record(charState, {});
    expect(entry.type).toBe("blood_potency");
    expect(entry.cost).toBe(30); // (2+1)*10
    expect(entry.payload).toEqual({ priorValue: 2, newValue: 3 });

    charState.potency = 3;
    handlers.blood_potency.undo(charState, entry);
    expect(charState.potency).toBe(2);
  });

  it("blood_ritual: record stores entryId, undo removes entry from disciplineSkillsObj", () => {
    const charState = { disciplineSkillsObj: [] };
    const entry = handlers.blood_ritual.record(charState, {
      ritualName: "Clinging of the Insect",
      ritualLevel: 1,
    });
    expect(entry.type).toBe("blood_ritual");
    expect(entry.cost).toBe(3); // 1*3
    expect(entry.payload.entryId).toMatch(/.+/);
    expect(entry.payload.ritualName).toBe("Clinging of the Insect");
    expect(entry.payload.ritualLevel).toBe(1);

    // simulate spendXp.vue mutation
    charState.disciplineSkillsObj.push({
      entryId: entry.payload.entryId,
      discipline: "Blood Sorcery",
      skill: "Ritual: Clinging of the Insect",
    });

    handlers.blood_ritual.undo(charState, entry);
    expect(charState.disciplineSkillsObj).toEqual([]);
  });

  it("blood_ritual: level 3 ritual costs 9", () => {
    const charState = { disciplineSkillsObj: [] };
    const entry = handlers.blood_ritual.record(charState, {
      ritualName: "Dagon's Call",
      ritualLevel: 3,
    });
    expect(entry.cost).toBe(9); // 3*3
  });

  it("oblivion_ceremony: record stores entryId, undo removes entry from disciplineSkillsObj", () => {
    const charState = { disciplineSkillsObj: [] };
    const entry = handlers.oblivion_ceremony.record(charState, {
      ceremonyName: "Ashes to Ashes",
      ceremonyLevel: 1,
    });
    expect(entry.type).toBe("oblivion_ceremony");
    expect(entry.cost).toBe(3); // 1*3
    expect(entry.payload.entryId).toMatch(/.+/);
    expect(entry.payload.ceremonyName).toBe("Ashes to Ashes");
    expect(entry.payload.ceremonyLevel).toBe(1);

    // simulate spendXp.vue mutation
    charState.disciplineSkillsObj.push({
      entryId: entry.payload.entryId,
      discipline: "Oblivion",
      skill: "Ceremony: Ashes to Ashes",
    });

    handlers.oblivion_ceremony.undo(charState, entry);
    expect(charState.disciplineSkillsObj).toEqual([]);
  });

  it("oblivion_ceremony: level 2 ceremony costs 6", () => {
    const charState = { disciplineSkillsObj: [] };
    const entry = handlers.oblivion_ceremony.record(charState, {
      ceremonyName: "Binding Fetter",
      ceremonyLevel: 2,
    });
    expect(entry.cost).toBe(6); // 2*3
  });

  it("advantage_point add (delta: +1): cost +3, undo restores priorValue", () => {
    const charState = { advantages_remaining: 5 };
    const entry = handlers.advantage_point.record(charState, { delta: 1 });
    expect(entry.type).toBe("advantage_point");
    expect(entry.cost).toBe(3);
    expect(entry.payload).toEqual({
      counter: "advantages_remaining",
      priorValue: 5,
      delta: 1,
    });

    // simulate: advantagePoints increases (separate from advantages_remaining)
    // but the handler tracks advantages_remaining
    charState.advantages_remaining = 6;
    handlers.advantage_point.undo(charState, entry);
    expect(charState.advantages_remaining).toBe(5);
  });

  it("advantage_point remove (delta: -1): cost -3, undo restores priorValue", () => {
    const charState = { advantages_remaining: 3 };
    const entry = handlers.advantage_point.record(charState, { delta: -1 });
    expect(entry.type).toBe("advantage_point");
    expect(entry.cost).toBe(-3);
    expect(entry.payload).toEqual({
      counter: "advantages_remaining",
      priorValue: 3,
      delta: -1,
    });

    charState.advantages_remaining = 2;
    handlers.advantage_point.undo(charState, entry);
    expect(charState.advantages_remaining).toBe(3);
  });

  it("flaw_point add (delta: +1): cost +3, undo restores priorValue", () => {
    const charState = { flaws_remaining: 2 };
    const entry = handlers.flaw_point.record(charState, { delta: 1 });
    expect(entry.type).toBe("flaw_point");
    expect(entry.cost).toBe(3);
    expect(entry.payload).toEqual({
      counter: "flaws_remaining",
      priorValue: 2,
      delta: 1,
    });

    charState.flaws_remaining = 3;
    handlers.flaw_point.undo(charState, entry);
    expect(charState.flaws_remaining).toBe(2);
  });

  it("flaw_point remove (delta: -1): cost -3, undo restores priorValue", () => {
    const charState = { flaws_remaining: 4 };
    const entry = handlers.flaw_point.record(charState, { delta: -1 });
    expect(entry.type).toBe("flaw_point");
    expect(entry.cost).toBe(-3);
    expect(entry.payload).toEqual({
      counter: "flaws_remaining",
      priorValue: 4,
      delta: -1,
    });

    charState.flaws_remaining = 3;
    handlers.flaw_point.undo(charState, entry);
    expect(charState.flaws_remaining).toBe(4);
  });
});
