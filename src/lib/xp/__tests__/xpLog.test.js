import { describe, it, expect } from "vitest";
import { appendEntry, undoLast, newId, isValidEntry } from "../xpLog.js";

describe("newId", () => {
  it("returns a distinct string each call", () => {
    const a = newId();
    const b = newId();
    expect(typeof a).toBe("string");
    expect(a.length).toBeGreaterThan(0);
    expect(a).not.toBe(b);
  });
});

describe("appendEntry", () => {
  it("appends a fully-formed entry and fills id/ts/balanceAfter", () => {
    const partial = { cost: 6, type: "smoke", payload: {} };
    const result = appendEntry([], partial, /*currentXp*/ 30);

    expect(result).toHaveLength(1);
    const entry = result[0];
    expect(entry.id).toMatch(/.+/);
    expect(entry.ts).toMatch(/^\d{4}-\d{2}-\d{2}T/); // ISO 8601
    expect(entry.cost).toBe(6);
    expect(entry.type).toBe("smoke");
    expect(entry.balanceAfter).toBe(24); // 30 - 6, since cost is positive (spent)
    expect(entry.note ?? "").toBe("");
  });

  it("does not mutate the input log", () => {
    const log = [];
    appendEntry(log, { cost: 1, type: "x", payload: {} }, 10);
    expect(log).toHaveLength(0);
  });

  it("handles negative cost (refund) by increasing balanceAfter", () => {
    const result = appendEntry([], { cost: -3, type: "refund", payload: {} }, 10);
    expect(result[0].balanceAfter).toBe(13);
  });

  it("preserves provided note if any", () => {
    const result = appendEntry([], { cost: 1, type: "x", payload: {}, note: "hello" }, 5);
    expect(result[0].note).toBe("hello");
  });
});

describe("isValidEntry", () => {
  it("accepts a well-formed entry with finite cost", () => {
    expect(
      isValidEntry({ type: "attribute_raise", cost: 15, payload: {} })
    ).toBe(true);
  });

  it("accepts an advantage entry with finite cost and delta", () => {
    expect(
      isValidEntry({
        type: "advantage",
        cost: 6,
        payload: { counter: "advantages_remaining", priorValue: 0, delta: 2 },
      })
    ).toBe(true);
  });

  it("accepts a flaw entry with finite cost and delta", () => {
    expect(
      isValidEntry({
        type: "flaw",
        cost: 3,
        payload: { counter: "flaws_remaining", priorValue: 0, delta: 1 },
      })
    ).toBe(true);
  });

  it("rejects null / undefined / non-object", () => {
    expect(isValidEntry(null)).toBe(false);
    expect(isValidEntry(undefined)).toBe(false);
    expect(isValidEntry(42)).toBe(false);
    expect(isValidEntry("entry")).toBe(false);
  });

  it("rejects when cost is non-finite (NaN, Infinity, string)", () => {
    expect(
      isValidEntry({ type: "attribute_raise", cost: NaN, payload: {} })
    ).toBe(false);
    expect(
      isValidEntry({ type: "attribute_raise", cost: Infinity, payload: {} })
    ).toBe(false);
    expect(
      isValidEntry({ type: "attribute_raise", cost: "junk", payload: {} })
    ).toBe(false);
    expect(
      isValidEntry({ type: "attribute_raise", payload: {} })
    ).toBe(false); // missing cost
  });

  it("rejects advantage/flaw with non-finite delta", () => {
    expect(
      isValidEntry({
        type: "advantage",
        cost: 6,
        payload: { counter: "advantages_remaining", delta: NaN },
      })
    ).toBe(false);
    expect(
      isValidEntry({
        type: "flaw",
        cost: 3,
        payload: { counter: "flaws_remaining", delta: "junk" },
      })
    ).toBe(false);
    expect(
      isValidEntry({
        type: "advantage",
        cost: 6,
        payload: { counter: "advantages_remaining" }, // missing delta
      })
    ).toBe(false);
  });

  it("does not require delta on non-advantage/flaw entries", () => {
    expect(
      isValidEntry({
        type: "skill_raise",
        cost: 3,
        payload: { skill: "brawl" }, // no delta — fine
      })
    ).toBe(true);
  });
});

describe("undoLast", () => {
  it("pops the tail and returns it", () => {
    const log = [
      { id: "a", cost: 1, type: "x", payload: {} },
      { id: "b", cost: 2, type: "y", payload: {} },
    ];
    const { log: next, entry } = undoLast(log);
    expect(entry.id).toBe("b");
    expect(next).toHaveLength(1);
    expect(next[0].id).toBe("a");
  });

  it("returns null entry and empty log when called on an empty log", () => {
    const { log, entry } = undoLast([]);
    expect(entry).toBeNull();
    expect(log).toEqual([]);
  });

  it("does not mutate the input log", () => {
    const log = [{ id: "a", cost: 1, type: "x", payload: {} }];
    undoLast(log);
    expect(log).toHaveLength(1);
  });
});
