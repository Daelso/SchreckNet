// @ts-check
const { test, expect } = require("@playwright/test");
const { loginAsTestxp, TEST_USER } = require("../fixtures/auth");
const {
  seedVampire,
  seedGarou,
  seedHunter,
  deleteCharacter,
  closePool,
} = require("../fixtures/seed");
const { hideWebpackOverlay } = require("../helpers/quasar");
const {
  openSpendXp,
  purchase,
  saveSpendXp,
  readSummary,
} = require("../helpers/spendXp");
const { openXpLog, undoTopEntry, readEntries } = require("../helpers/xpLog");

/**
 * Regression coverage for PR #284 (commit 515c637) — "Fix XP-log undo
 * overshoot for multi-buy advantage/flaw".
 *
 * Background: prior to #284, undoing one of two advantage purchases made
 * in the same Spend XP dialog session reverted the character's
 * `advantages_remaining` to the *session-start* snapshot (because every
 * record() call in the session shared the same priorValue), instead of
 * just reversing the top entry's delta. Net end-state was correct only
 * when both entries were undone; partial undo overshot.
 *
 * The fix changed undo from "assign priorValue back" to "subtract delta",
 * which is robust regardless of priorValue staleness. This spec exercises
 * the multi-buy → partial-undo flow on each game line and asserts the
 * post-undo state matches "minus delta", not "back to session start".
 */
const LINES = [
  {
    name: "vtm",
    editUrlPath: (id) => `/vampire/5e/edit/${id}`,
    seed: () => seedVampire({ ownerId: TEST_USER.id, charName: "E2E VtM Adv" }),
    table: "vampires",
  },
  {
    name: "werewolf",
    editUrlPath: (id) => `/werewolf/5e/edit/${id}`,
    seed: () =>
      seedGarou({ ownerId: TEST_USER.id, charName: "E2E Garou Adv" }),
    table: "garou",
  },
  {
    name: "hunter",
    editUrlPath: (id) => `/hunter/5e/edit/${id}`,
    seed: () =>
      seedHunter({ ownerId: TEST_USER.id, charName: "E2E Hunter Adv" }),
    table: "hunters",
  },
];

test.afterAll(async () => {
  await closePool();
});

for (const line of LINES) {
  test.describe(`${line.name} — multi-buy advantage undo (PR #284 regression)`, () => {
    let charId;

    test.beforeEach(async ({ context }) => {
      await loginAsTestxp(context);
      charId = await line.seed();
    });

    test.afterEach(async () => {
      if (charId) {
        await deleteCharacter(line.table, charId);
        charId = null;
      }
    });

    test("undo top entry walks back exactly delta (not session-start)", async ({
      page,
    }) => {
      await page.goto(line.editUrlPath(charId));
      await hideWebpackOverlay(page);

      // Baseline from seed: 7 advantage dots, 50 XP.
      const baseline = await readSummary(page);
      expect(baseline.advantages).toBe(7);
      expect(baseline.xp).toBe(50);

      await openSpendXp(page);
      await purchase(page, { category: "Advantage", dots: 2 });
      await purchase(page, { category: "Advantage", dots: 3 });
      await saveSpendXp(page);

      // After both purchases: +5 dots (12), -15 XP (35).
      const afterBuy = await readSummary(page);
      expect(afterBuy.advantages).toBe(12);
      expect(afterBuy.xp).toBe(35);

      await openXpLog(page);
      const entries = await readEntries(page);
      expect(entries).toHaveLength(2);
      expect(entries[0].label).toMatch(/Added 3 advantage point/);
      expect(entries[0].cost).toBe(9);
      expect(entries[1].label).toMatch(/Added 2 advantage point/);
      expect(entries[1].cost).toBe(6);

      await undoTopEntry(page);

      // Post-fix expected: dots -3 (=> 9), XP +9 (=> 44).
      // Pre-fix bug: dots would have jumped to baseline 7 (overshoot by -2).
      const afterUndo = await readSummary(page);
      expect(
        afterUndo.advantages,
        "advantages_remaining must drop by exactly delta=3, not overshoot to session-start (7)"
      ).toBe(9);
      expect(afterUndo.xp).toBe(44);

      // The +2 entry should still be in the log; only the +3 was undone.
      const remainingEntries = await readEntries(page);
      expect(remainingEntries).toHaveLength(1);
      expect(remainingEntries[0].label).toMatch(/Added 2 advantage point/);
    });
  });
}
