# Prompt template: Fill the coverage gaps from a QA pass

Paste this whole file as the prompt to a new Claude Code session. Update the date / report path below if a newer report has been archived.

---

I want you to extend the most recent SchreckNet QA pass by covering the scenarios it left untested. Reports live at `/home/chase/projects/SchreckNet/docs/qa/reports/` — **read the latest one first**. As of this template's last update (2026-05-15), the target report is `docs/qa/reports/2026-05-15-xp-log.md` covering the XP Log + Undo feature (PR #281, merged to `main` at `54343a3`). If you're using this template against a newer report, retarget accordingly and skip whatever's no longer in scope.

In the chosen report, focus on:

- §3 lists what was already verified — don't re-do those flows.
- §4 lists what was *not* tested and is your scope.
- §2 lists known bugs — note them as regression targets and confirm whether they still reproduce (or have been fixed since).

The full re-runnable QA flow with environment setup is at `/home/chase/projects/SchreckNet/docs/qa/test-flow.md` — that file has all the boilerplate (worktree, deps, MySQL, dev servers, auth, browser-launch gotchas). Follow it for setup. Use the same auth account (`testxp@test.com` / `TestPass123!`).

Use the Playwright MCP browser tools. Load them with ToolSearch — see `docs/qa/test-flow.md` for the exact `select:...` query.

## Scope (in priority order)

### Priority A — Werewolf 5e full create + edit + XP-Log-Undo

The previous run only smoke-tested the Werewolf edit page (verified the XP Log dialog opens). Drive a full create flow:

- Create a Werewolf character end-to-end (Tribe + Auspice, Renown, Attributes/Skills/Specialties, native+tribe+auspice gifts, Rites, Touchstones, Advantages/Flaws). Save. Verify it appears in `/garou/5e/profile/...` and reloads cleanly in the editor.
- On the new character: exercise XP Log + Undo for each Spend XP category (attribute, skill, gift, rite, advantage, flaw, renown if it appears there). Confirm log entries appear with cost + label + balance-after; confirm Undo reverts correctly.
- **Specifically reproduce the multi-buy-advantage bug** flagged in QA_REPORT §2 Defect 1: open Spend XP, buy `Advantage` × 2, buy `Advantage` × 3 without closing, save, then undo the top entry. Compare actual vs expected for `Advantage Dots Remaining`. Report whether the bug exists in Werewolf (the source pattern says yes; the empirical check is what we want).

### Priority B — Hunter 5e full create + edit + XP-Log-Undo

Same shape as Werewolf, applied to Hunter (`/hunter/5e`). Specifically test:

- Edges + perks: do perks unlock based on the chosen edge?
- Safe Houses, Organizations, Loresheets sections.
- Multi-buy-advantage repro on Hunter. Hunter's `spendXp.vue` builds a fresh `handlerState` per call from a `this.advantagePoints` accumulator that starts at 0 (see [src/components/character_creator/hunter/spendXp.vue:335-343](src/components/character_creator/hunter/spendXp.vue#L335-L343)), so behavior may differ from VtM/Werewolf. The QA report flagged this as worth empirically verifying — your job is to verify it.

### Priority C — VtM clan edge cases

The previous run only covered Brujah/Alleycat. Create one character per edge clan, drive the create flow far enough to confirm the rules wire up correctly, save:

- **Caitiff** — no clan disciplines (the discipline picker should accept any disciplines, or skip the in-clan-only constraint).
- **Thin-Blood** — different rules entirely (limited disciplines, alchemy, no blood potency progression). Confirm the UI handles this branch.
- **Hecata** — special discipline access (Oblivion); should appear in discipline picker. Spend XP should let you buy Oblivion ceremonies (separate from base disciplines).
- **Tzimisce** — Protean variants, the alternative bane checkbox should be relevant.
- **Tremere** — Blood Sorcery rituals: Spend XP should let you buy rituals; they should appear in the XP log as a separate `discipline_skill` (or similar) entry type.
- **Banu Haqim** — Blood Sorcery + their unique bane.

For each, check that the XP Log + Undo flow works for whatever clan-specific Spend XP categories exist (e.g. Oblivion ceremonies for Hecata, Blood Sorcery rituals for Tremere).

### Priority D — XP Log note editing

QA_TEST_FLOW.md / the design spec mention each log entry can have a note that the user can edit. Was not exercised in the previous run:

- On any character with at least one log entry, edit the entry's note. Save the character (Update Character). Reload. Confirm the note text persists.
- Verify edit works regardless of whether the entry is the top one (i.e. note editing is allowed on entries that don't have an Undo button).

### Priority E — Cross-cutting

- **Favorites**: Click the heart on someone else's character on the home page. Confirm it lands at `/myFavorites`. Unfavorite. Confirm it disappears.
- **Folders**: From `/myVamps` (or equivalent), create a folder, drag/move a character into it, then out. The character should be reachable both via the folder and the unfiled list.
- **Cross-line search** at `/search`: Search for a name fragment that should match a vampire, a garou, and a hunter. Confirm all three appear.
- **PDF export**: Pick one character per game line, hit the PDF export button (look around the view/edit page for "Export PDF" or similar). Download the file. Confirm filesize > 0 and that the browser console didn't surface a `pdf-lib` exception. Open the PDF if possible and confirm at least the character's name appears on it.
- **Public view vs Edit view**: While logged in as `testxp`, navigate to `/vampire/5e/<id>` for a character belonging to a *different* user (use a SQL probe to find one — `SELECT id, charName, created_by FROM vampires WHERE created_by != 42 LIMIT 5`). Confirm edit controls are hidden / there is no `Update Character` button / no Spend XP nav item. Repeat for Werewolf and Hunter.
- **Anonymous access**: Log out. Try to load `/vampire/5e/<id>` directly. Confirm public view renders with no edit affordances.

### Priority F — Validation / edge inputs

- Try saving each game line's character with required fields blank → confirm the Save button stays disabled or the API returns a clear error.
- Create a "max everything" character: all attributes 5, all skills 5 (use the +3xp buttons + Spend XP after creation if needed). Save. Reload. Confirm state is consistent.
- Create a "minimum everything" character — leave non-required fields blank. Save. Confirm it round-trips.

## Defect capture

Same format as the previous QA report — see QA_TEST_FLOW.md for the full schema. The key points:

- Severity (Critical / High / Medium / Low)
- Steps to reproduce (numbered, copy-pasteable)
- Expected vs Actual
- Screenshot path
- Console / network capture
- `file:line` hypothesis
- **Game lines affected** — XP-log handlers (`vtm.js` / `werewolf.js` / `hunter.js`) share structure; check whether any new bug exists in all three before reporting.

## Output

Create a new dated report under `docs/qa/reports/` (e.g. `docs/qa/reports/2026-06-15-xp-log-round2.md`) — do not overwrite the prior report. Include the following sections:

- Summary of what was newly verified.
- New defects (continue the numbering from the prior report — Defect 4, 5, …).
- Regression check: did the bugs from §2 of the original report still reproduce? Or have they been fixed?
- Updated "Flows not tested" list (subset of §4 that's still open).
- New test artifacts left behind (characters created, screenshots in a sibling `*-screenshots/` directory, etc.).

Link back to the prior report from the new report's frontmatter so the trail is traceable.

## Time budget

A full re-pass at this depth is realistically another 90-120 minutes. If you run long, prioritize **A** and **B** (the unverified game lines) over **C-F**. Multi-buy advantage repro on W and H is the single most valuable check — do that first.

## Cleanup

Same as the previous run: close browser, kill dev servers (via KillBash on the background-task IDs you started), leave the worktree on disk for review.

Do NOT push or commit anything unless I explicitly ask.
