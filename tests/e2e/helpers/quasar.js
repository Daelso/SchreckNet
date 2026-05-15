/**
 * Helpers for interacting with Quasar 2 components, where Vue's reactivity
 * + portal-rendered menus + the webpack-dev-server overlay all conspire to
 * break the obvious .click() approach.
 *
 * Patterns proven empirically against this app's spendXp / XP Log dialogs.
 */

/**
 * Hide the webpack-dev-server runtime-error overlay iframe. The overlay
 * intercepts pointer events and breaks unrelated tests; the underlying
 * errors (e.g. ResizeObserver loop) are benign noise.
 */
async function hideWebpackOverlay(page) {
  await page.addStyleTag({
    content: `#webpack-dev-server-client-overlay,
              #webpack-dev-server-client-overlay-div { display: none !important; }`,
  });
}

/**
 * Open a q-select inside the active dialog (matched by the field's label
 * substring) and pick an option by exact text match.
 *
 * Quasar renders options into a portal outside the dialog — we use a global
 * role=option lookup to find them.
 */
async function pickQSelect(page, labelSubstring, optionLabel) {
  const select = page
    .locator(".q-dialog .q-select", { hasText: labelSubstring })
    .first();
  await select.click();
  await page
    .getByRole("option", { name: optionLabel, exact: true })
    .first()
    .click();
}

module.exports = { hideWebpackOverlay, pickQSelect };
