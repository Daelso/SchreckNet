/**
 * Open the XP Log dialog from the editor's right-side nav. Returns the
 * dialog locator.
 */
async function openXpLog(page) {
  const label = page.locator(".q-item .q-item__label", {
    hasText: /^\s*XP Log\s*$/,
  });
  await label.first().scrollIntoViewIfNeeded();
  await label.first().click();
  const dlg = page.locator(".q-dialog").last();
  await dlg.waitFor();
  return dlg;
}

/**
 * Click Undo on the top XP Log entry, then confirm in the follow-up
 * confirmation dialog. Waits for the confirm dialog to detach before
 * returning.
 */
async function undoTopEntry(page) {
  // Click Undo on the topmost entry. Only the top entry has an Undo
  // button (per spec), so getByRole+first works without ambiguity.
  await page.getByRole("button", { name: "Undo" }).first().click();
  // Quasar opens a confirmation dialog with its own Undo button. Scope
  // by hasText so we don't accidentally re-click the entry's button.
  const confirm = page.locator(".q-dialog", { hasText: /Undo this purchase/ });
  await confirm.waitFor();
  await confirm.getByRole("button", { name: "Undo" }).click();
  await confirm.waitFor({ state: "detached" });
}

/**
 * Read all visible XP Log entries (newest first). Returns array of
 * { label, cost, balanceAfter }.
 */
async function readEntries(page) {
  const dlg = page.locator(".q-dialog", { hasText: /^XP Log/ }).first();
  const text = await dlg.innerText();
  // Each entry block contains a label line + "Cost: N XP" + "Balance after: N".
  const pattern =
    /(Added|Removed|Raised|Lowered)[^\n]+\nCost:\s*(\d+)\s*XP\nBalance after:\s*(\d+)/g;
  return [...text.matchAll(pattern)].map((m) => ({
    label: m[0].split("\n")[0],
    cost: Number(m[2]),
    balanceAfter: Number(m[3]),
  }));
}

module.exports = { openXpLog, undoTopEntry, readEntries };
