import { describe, it, expect } from "vitest";
import handlers from "../hunter.js";

describe("hunter handlers — record/undo round trip", () => {
  // ── attribute_raise ──────────────────────────────────────────────────────
  it("attribute_raise: record then undo restores prior points and spentXp", () => {
    const charState = {
      attributes: [{ name: "Strength", points: 2 }],
      spentXp: 10,
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
    charState.spentXp = 25;

    handlers.attribute_raise.undo(charState, entry);
    expect(charState.attributes[0].points).toBe(2);
    expect(charState.spentXp).toBe(10);
  });

  // ── skill_raise ──────────────────────────────────────────────────────────
  it("skill_raise: record then undo restores prior level and spentXp", () => {
    const charState = { skills: { brawl: 1 }, spentXp: 5 };
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
    charState.spentXp = 11;

    handlers.skill_raise.undo(charState, entry);
    expect(charState.skills.brawl).toBe(1);
    expect(charState.spentXp).toBe(5);
  });

  it("skill_raise: first dot (0 → 1) costs 3", () => {
    const charState = { skills: { athletics: 0 }, spentXp: 0 };
    const entry = handlers.skill_raise.record(charState, { skillName: "Athletics" });

    expect(entry.cost).toBe(3);
    expect(entry.payload).toEqual({
      skill: "athletics",
      priorValue: 0,
      newValue: 1,
      priorSpentXp: 0,
    });

    charState.skills.athletics = 1;
    charState.spentXp = 3;

    handlers.skill_raise.undo(charState, entry);
    expect(charState.skills.athletics).toBe(0);
    expect(charState.spentXp).toBe(0);
  });

  // ── specialty ────────────────────────────────────────────────────────────
  it("specialty: record adds entryId, undo removes matching item and restores spentXp", () => {
    const charState = { specialtiesFromXp: [], spentXp: 6 };
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
    charState.spentXp = 9;

    handlers.specialty.undo(charState, entry);
    expect(charState.specialtiesFromXp).toEqual([]);
    expect(charState.spentXp).toBe(6);
  });

  // ── edge ─────────────────────────────────────────────────────────────────
  it("edge: record stores entryId/category/edge, undo removes from edgeArr.edges and restores spentXp", () => {
    const charState = {
      edgeArr: { edges: [], perks: [] },
      spentXp: 0,
    };
    const entry = handlers.edge.record(charState, {
      category: "Awe",
      edge: "Attractive",
    });

    expect(entry.type).toBe("edge");
    expect(entry.cost).toBe(7); // flat 7
    expect(entry.payload.entryId).toMatch(/.+/);
    expect(entry.payload.category).toBe("Awe");
    expect(entry.payload.edge).toBe("Attractive");
    expect(entry.payload.priorSpentXp).toBe(0);

    // simulate spendXp.vue mutation
    charState.edgeArr.edges.push({
      entryId: entry.payload.entryId,
      category: "Awe",
      edge: "Attractive",
    });
    charState.spentXp = 7;

    handlers.edge.undo(charState, entry);
    expect(charState.edgeArr.edges).toEqual([]);
    expect(charState.spentXp).toBe(0);
  });

  it("edge: undo ignores entryId mismatch — non-matching entries survive", () => {
    const charState = {
      edgeArr: {
        edges: [{ entryId: "other-id", category: "Fleet", edge: "Quick" }],
        perks: [],
      },
      spentXp: 14,
    };
    const entry = handlers.edge.record(charState, {
      category: "Awe",
      edge: "Attractive",
    });

    // simulate adding second edge
    charState.edgeArr.edges.push({
      entryId: entry.payload.entryId,
      category: "Awe",
      edge: "Attractive",
    });
    charState.spentXp = 21;

    handlers.edge.undo(charState, entry);
    expect(charState.edgeArr.edges).toHaveLength(1);
    expect(charState.edgeArr.edges[0].entryId).toBe("other-id");
    expect(charState.spentXp).toBe(14);
  });

  // ── perk ─────────────────────────────────────────────────────────────────
  it("perk: record stores entryId/category/perk, undo removes from edgeArr.perks and restores spentXp", () => {
    const charState = {
      edgeArr: { edges: [], perks: [] },
      spentXp: 7,
    };
    const entry = handlers.perk.record(charState, {
      category: "Awe",
      perk: "Stunning",
    });

    expect(entry.type).toBe("perk");
    expect(entry.cost).toBe(3); // flat 3
    expect(entry.payload.entryId).toMatch(/.+/);
    expect(entry.payload.category).toBe("Awe");
    expect(entry.payload.perk).toBe("Stunning");
    expect(entry.payload.priorSpentXp).toBe(7);

    // simulate spendXp.vue mutation
    charState.edgeArr.perks.push({
      entryId: entry.payload.entryId,
      category: "Awe",
      perk: "Stunning",
    });
    charState.spentXp = 10;

    handlers.perk.undo(charState, entry);
    expect(charState.edgeArr.perks).toEqual([]);
    expect(charState.spentXp).toBe(7);
  });

  // ── advantage ────────────────────────────────────────────────────────────
  it("advantage: record delta dots, undo restores advantagePoints and spentXp", () => {
    const charState = { advantagePoints: 2, spentXp: 6 };
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
    charState.spentXp = 12;

    handlers.advantage.undo(charState, entry);
    expect(charState.advantagePoints).toBe(2);
    expect(charState.spentXp).toBe(6);
  });

  // ── flaw ─────────────────────────────────────────────────────────────────
  it("flaw: record delta dots, undo restores flaws_remaining and spentXp", () => {
    const charState = { flaws_remaining: 0, spentXp: 0 };
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
    charState.spentXp = 3;

    handlers.flaw.undo(charState, entry);
    expect(charState.flaws_remaining).toBe(0);
    expect(charState.spentXp).toBe(0);
  });

  // ── multi-record dialog session ─────────────────────────────────────────
  // The undo math should be robust against stale priorValue — reversing only
  // this entry's delta — regardless of dialog mutation order.
  it("advantage multi-record (stale priorValue): undoing the top entry only reverses its own delta", () => {
    const charState = { advantagePoints: 2, spentXp: 6 };
    const e1 = handlers.advantage.record(charState, { delta: 2 });
    charState.spentXp = 12;
    const e2 = handlers.advantage.record(charState, { delta: 3 });
    expect(e1.payload.priorValue).toBe(2);
    expect(e2.payload.priorValue).toBe(2);
    expect(e1.payload.priorSpentXp).toBe(6);
    expect(e2.payload.priorSpentXp).toBe(12);

    charState.advantagePoints = 7;
    charState.spentXp = 21;

    handlers.advantage.undo(charState, e2);
    expect(charState.advantagePoints).toBe(4);
    expect(charState.spentXp).toBe(12);
    handlers.advantage.undo(charState, e1);
    expect(charState.advantagePoints).toBe(2);
    expect(charState.spentXp).toBe(6);
  });

  it("flaw multi-record (stale priorValue): undoing the top entry only reverses its own delta", () => {
    const charState = { flaws_remaining: 1, spentXp: 3 };
    const e1 = handlers.flaw.record(charState, { delta: 1 });
    charState.spentXp = 6;
    const e2 = handlers.flaw.record(charState, { delta: 2 });
    expect(e1.payload.priorValue).toBe(1);
    expect(e2.payload.priorValue).toBe(1);
    expect(e1.payload.priorSpentXp).toBe(3);
    expect(e2.payload.priorSpentXp).toBe(6);

    charState.flaws_remaining = 4;
    charState.spentXp = 12;

    handlers.flaw.undo(charState, e2);
    expect(charState.flaws_remaining).toBe(2);
    expect(charState.spentXp).toBe(6);
    handlers.flaw.undo(charState, e1);
    expect(charState.flaws_remaining).toBe(1);
    expect(charState.spentXp).toBe(3);
  });

  // ── allowlist guards ────────────────────────────────────────────────────
  it("advantage undo: malicious counter key is silently ignored", () => {
    const charState = { advantagePoints: 3, spentXp: 6 };
    const maliciousEntry = {
      type: "advantage",
      cost: 3,
      payload: { counter: "__proto__", priorValue: { isAdmin: true }, delta: 1, priorSpentXp: 3 },
    };
    handlers.advantage.undo(charState, maliciousEntry);
    expect(charState.advantagePoints).toBe(3);
    expect(({}).isAdmin).toBeUndefined();
  });

  it("flaw undo: malicious counter key is silently ignored", () => {
    const charState = { flaws_remaining: 2, spentXp: 6 };
    const maliciousEntry = {
      type: "flaw",
      cost: 3,
      payload: { counter: "constructor", priorValue: {}, delta: 1, priorSpentXp: 3 },
    };
    handlers.flaw.undo(charState, maliciousEntry);
    expect(charState.flaws_remaining).toBe(2);
  });
});
