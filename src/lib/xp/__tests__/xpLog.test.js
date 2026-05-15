import { describe, it, expect } from "vitest";
import { appendEntry, undoLast, newId } from "../xpLog.js";

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
