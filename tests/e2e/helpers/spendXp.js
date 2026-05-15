const { pickQSelect } = require("./quasar");

/**
 * Open the Spend XP dialog from the editor's right-side nav. Returns the
 * dialog locator for chained queries.
 */
async function openSpendXp(page) {
  // The Spend XP nav lives in the right-column listitem. There are two
  // matches on the page (one is a section header, one is the nav item),
  // so prefer the .q-item__label inside the clickable q-item-section.
  const label = page.locator(".q-item .q-item__label", {
    hasText: /^\s*Spend XP\s*$/,
  });
  await label.first().scrollIntoViewIfNeeded();
  await label.first().click();
  const dlg = page.locator(".q-dialog").last();
  await dlg.waitFor();
  return dlg;
}

/**
 * Inside an open Spend XP dialog, pick a category + dot count, then click
 * Purchase. Leaves the dialog open so callers can chain more purchases or
 * Save.
 */
async function purchase(page, { category, dots }) {
  await pickQSelect(page, "Which category", category);
  await pickQSelect(page, "How many dots", String(dots));
  await page.getByRole("button", { name: "Purchase" }).first().click();
}

/**
 * Click Save on the Spend XP dialog (the toolbar button) — commits all
 * staged purchases to the character's local state and closes the dialog.
 */
async function saveSpendXp(page) {
  // q-dialog has a Save button in its toolbar. Scope by dialog to avoid
  // matching any page-level Save button.
  await page
    .locator(".q-dialog")
    .last()
    .getByRole("button", { name: "Save" })
    .first()
    .click();
  await page.locator(".q-dialog").last().waitFor({ state: "detached" });
}

/**
 * Read summary-panel state (Advantage Dots Remaining, Remaining XP, Flaw
 * Dots Remaining). Used to assert the post-buy / post-undo state.
 */
async function readSummary(page) {
  const text = await page.locator("body").innerText();
  const adv = text.match(/Advantage Dots Remaining:?\s*-?\s*(\d+)/);
  const xp = text.match(/Remaining XP:?\s*(\d+)/);
  const flaw = text.match(/Flaw Dots Remaining:?\s*-?\s*(\d+)/);
  return {
    advantages: adv ? Number(adv[1]) : null,
    xp: xp ? Number(xp[1]) : null,
    flaws: flaw ? Number(flaw[1]) : null,
  };
}

module.exports = { openSpendXp, purchase, saveSpendXp, readSummary };
