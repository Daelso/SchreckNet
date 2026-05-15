# Prompt template: Fix the bugs found in a QA pass

Paste this whole file as the prompt to a new Claude Code session. If a specific QA report isn't current, update the date / report path in the next paragraph before pasting.

---

I want you to fix the bugs found during the most recent SchreckNet QA pass. The reports are archived at `/home/chase/projects/SchreckNet/docs/qa/reports/` — read the latest one first; it has the file:line references and root-cause analysis.

**As of this template's last update (2026-05-15), the target report is** `docs/qa/reports/2026-05-15-xp-log.md` and the bugs covered below are from that run. If you're using this template against a newer report, swap in that report's bugs and file references and skip whatever is no longer applicable.

## Environment

1. Make a fresh worktree off `origin/main`:
   ```bash
   git -C /home/chase/projects/SchreckNet fetch origin
   git -C /home/chase/projects/SchreckNet worktree add /home/chase/projects/SchreckNet/.worktrees/fix-xp-log-bugs -b fix-xp-log-bugs origin/main
   ```
   `cd` into the worktree. **Prefix every Bash call** with `cd <worktree-path> && ...` (each Bash call is a fresh shell).

2. Copy `.env` from `/home/chase/projects/SchreckNet/.env` into the worktree.

3. `npm install` inside the worktree (don't trust hoisting from the parent repo's `node_modules`).

4. Confirm MySQL container is up: `docker ps --filter name=schrecknet-mysql --format '{{.Status}}'`.

5. Confirm migrations + tests baseline: `npx sequelize-cli db:migrate:status` shows the XP-log migration as `up`; `npm run test:unit` is green (54+ passing).

## The bugs to fix

### Bug 1 (HIGH) — Multi-buy advantage/flaw undo overshoots intermediate state

**Reproduction (manual, optional sanity check before/after the fix):**

1. Log in as `testxp@test.com` / `TestPass123!`. Open VtM character id 103 (`QA Tester Vamp`) — if it's been deleted, create a new one. Get the character into a state with ~50 XP remaining.
2. Open Spend XP. Buy `Advantage` × `2` (cost 6). Without closing the dialog, buy `Advantage` × `3` (cost 9). Click Save.
3. Note: Advantage Dots Remaining = (baseline + 5); Remaining XP = baseline − 15.
4. Open XP Log. Click Undo on the top entry (the `+3 advantage points` one). Confirm.
5. **Bug:** Advantage Dots Remaining drops by 5 (back to the session-start baseline), not by 3. XP refund of 9 is correct; the dot count is wrong by 2.

**Root cause (already analyzed in QA_REPORT §2 Defect 1):**

- In each `spendXp.vue` dialog, every `handlers.advantage.record(this, ...)` call within one dialog session reads the same `this.advantages_remaining` (the value seeded from props on dialog open). The dialog's local accumulator `advantagePoints` is mutated, but `advantages_remaining` is not. So every entry recorded in that session carries the *same* `priorValue` (the session-start snapshot).
- The matching `undo` handler does `state[counter] = entry.payload.priorValue;` — i.e. an assignment, not a reverse of the delta. When two entries share the same `priorValue`, undoing the top entry yanks state back past where it should land.

**Affected files (all 3 game lines have the same shape):**

- [src/lib/xp/handlers/vtm.js:228](src/lib/xp/handlers/vtm.js#L228) — `advantage.undo`
- [src/lib/xp/handlers/vtm.js:?](src/lib/xp/handlers/vtm.js) — `flaw.undo` (same file, right after `advantage`)
- [src/lib/xp/handlers/werewolf.js:230-232](src/lib/xp/handlers/werewolf.js#L230-L232) — `advantage.undo`
- [src/lib/xp/handlers/werewolf.js:256-258](src/lib/xp/handlers/werewolf.js#L256-L258) — `flaw.undo`
- [src/lib/xp/handlers/hunter.js:151-155](src/lib/xp/handlers/hunter.js#L151-L155) — `advantage.undo`
- [src/lib/xp/handlers/hunter.js:178-182](src/lib/xp/handlers/hunter.js#L178-L182) — `flaw.undo`
- Dialogs that record these entries:
  - [src/components/character_creator/vtm/spendXp.vue:467-471](src/components/character_creator/vtm/spendXp.vue#L467-L471)
  - [src/components/character_creator/werewolf/spendXp.vue:539-543](src/components/character_creator/werewolf/spendXp.vue#L539-L543)
  - [src/components/character_creator/hunter/spendXp.vue:346-350](src/components/character_creator/hunter/spendXp.vue#L346-L350)

**Recommended fix (smallest blast radius — option 1 from the QA report):**

In every `advantage.undo` and `flaw.undo`, reverse by `delta` instead of assigning `priorValue`:

```js
undo: (state, entry) => {
  if (!ADVANTAGE_FLAW_COUNTERS.has(entry.payload.counter)) return;
  state[entry.payload.counter] -= entry.payload.delta;
  // Hunter / Werewolf also reset spentXp / spent_xp — keep that line as-is.
},
```

This works regardless of whether `record` captured the "right" `priorValue` because the delta is correct per-entry. **Verify the `priorValue` field is still saved** (it's useful for diagnostics and for future migration), but stop using it in the undo math.

Hunter's `handlerState` (built fresh per call from `this.advantagePoints` at [src/components/character_creator/hunter/spendXp.vue:335-343](src/components/character_creator/hunter/spendXp.vue#L335-L343)) has subtly different semantics from VtM/Werewolf — Hunter's accumulator starts at 0 and gets added to the parent on save. Empirically reproduce the bug on Hunter **before** assuming it behaves identically; the fix may still be the same (`state[counter] -= entry.payload.delta`) but verify.

**Optional secondary fix (option 2 from the QA report)**, useful so the running dialog display matches the post-save reality: in each `purchase()` handler in `spendXp.vue`, also mutate `this.advantages_remaining` (or the equivalent counter) after the `record(...)` call so subsequent `record(...)` calls in the same dialog see the updated value. This makes `priorValue` accurate per-entry going forward. **Do this in addition to**, not instead of, the `undo` fix — `undo` should be robust against arbitrary `priorValue` snapshots stored on old (pre-fix) characters.

### Bug 2 (LOW) — "Cost to Purchase: NaN" before sub-selection

In the Spend XP dialog, after picking a category like `Attributes` but before picking the specific attribute, the cost row reads `Cost to Purchase: NaN`. Fix in [src/components/character_creator/vtm/spendXp.vue](src/components/character_creator/vtm/spendXp.vue) (and the equivalent Werewolf / Hunter files). The fix is a `v-if` guard or a `Number.isFinite()` fallback in the template / computed.

### Bug 3 (LOW, pre-existing) — adsbygoogle.push() on route change

`MainLayout.vue:116` calls `adsbygoogle.push({})` from the `$route` watcher, which throws `TagError: All 'ins' elements ... already have ads` on every SPA navigation after the first. Guard so it only fires for `<ins>` elements that don't already have ads, or move the push out of the route watcher. **This is unrelated to PR #281** — consider filing as a separate commit / PR if scope matters.

## Process

This repo's CLAUDE.md says "user instructions take precedence" over default behaviors. Use TDD for the handler fixes:

1. Read `src/lib/xp/handlers/__tests__/vtm.test.js` (and the werewolf / hunter test files) to see the existing patterns.
2. **Write failing tests first** that reproduce the multi-record bug. Example skeleton for `vtm.test.js`:
   ```js
   it("advantage multi-record: undoing the top entry only reverses its own delta", () => {
     const state = { advantages_remaining: 5 };
     const e1 = handlers.advantage.record(state, { delta: 2 });
     state.advantages_remaining = 7;            // parent applied e1
     const e2 = handlers.advantage.record(state, { delta: 3 });
     state.advantages_remaining = 10;           // parent applied e2

     handlers.advantage.undo(state, e2);
     expect(state.advantages_remaining).toBe(7); // not 5
     handlers.advantage.undo(state, e1);
     expect(state.advantages_remaining).toBe(5);
   });
   ```
   Add a parallel test for `flaw`. Add the equivalent in `werewolf.test.js` and `hunter.test.js`. Run `npm run test:unit` — these should fail on `main`.
3. Apply the handler fix. Tests should pass.
4. If you do option 2 as well, write tests for the dialog component (where feasible — there are no component tests in this repo as of the QA pass, so it may be a UI manual check rather than an automated test).
5. Manually reproduce Bug 1 against the running app to confirm the fix works end-to-end. Spin up `npm run devStart` + `npx quasar dev` in background, log in as `testxp@test.com`/`TestPass123!`, walk the repro steps above on a VtM character, then also on a Werewolf and Hunter character (create minimal ones if needed). Use Playwright MCP browser tools — load them via ToolSearch.
6. Fix Bug 2 — add a test if the codebase has any equivalent component tests; otherwise verify by inspection + manual click.
7. Bug 3 is at the user's discretion — either include in this PR or split out.

## Output

- One git commit (or two, if you split Bug 3) on branch `fix-xp-log-bugs` containing the handler changes + new tests + dialog fixes.
- Run `npm run test:unit` and `npm run lint` and confirm both green before reporting done.
- Report a punch list: which bugs were fixed, which tests added, manual verification results per game line, and any remaining concerns (e.g. existing log entries on old characters that were recorded with the stale `priorValue` — note whether they'll undo correctly with the new handler).

Do NOT push or open a PR unless I explicitly ask — just leave the branch local.
