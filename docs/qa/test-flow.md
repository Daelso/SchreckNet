# SchreckNet — Repeatable QA Pass Prompt

Paste this whole file as the prompt to a new Claude Code session whenever you want to re-run the QA flow against `main`. It is self-contained: it assumes no prior conversation context.

Last verified working: 2026-05-15 against commit `54343a3` (XP Log + Undo PR #281).

---

You are doing thorough end-to-end browser testing of SchreckNet (a World of Darkness character creator — Vue 3 + Quasar 2 SPA backed by Express + Sequelize MySQL). Your job is to find bugs in character creation, editing, and the XP Log + Undo feature, across all three game lines (VtM, Werewolf, Hunter).

Use the Playwright MCP browser tools — load them via ToolSearch with `select:mcp__plugin_playwright_playwright__browser_navigate,mcp__plugin_playwright_playwright__browser_click,mcp__plugin_playwright_playwright__browser_snapshot,mcp__plugin_playwright_playwright__browser_take_screenshot,mcp__plugin_playwright_playwright__browser_type,mcp__plugin_playwright_playwright__browser_fill_form,mcp__plugin_playwright_playwright__browser_wait_for,mcp__plugin_playwright_playwright__browser_console_messages,mcp__plugin_playwright_playwright__browser_network_requests,mcp__plugin_playwright_playwright__browser_evaluate,mcp__plugin_playwright_playwright__browser_select_option,mcp__plugin_playwright_playwright__browser_press_key,mcp__plugin_playwright_playwright__browser_close`. Also load `TodoWrite`.

## Environment setup

1. **Create a fresh worktree off main** (the previous QA worktree is throwaway):
   ```bash
   git -C /home/chase/projects/SchreckNet fetch origin
   git -C /home/chase/projects/SchreckNet worktree add /home/chase/projects/SchreckNet/.worktrees/qa-$(date +%Y%m%d-%H%M) -b qa-$(date +%Y%m%d-%H%M) origin/main
   ```
   Then `cd` into that worktree. **Always prefix Bash commands** with `cd <worktree-path> && ...` because each Bash call is a fresh shell.

2. **Copy `.env`** from `/home/chase/projects/SchreckNet/.env` into the worktree.

3. **Verify MySQL container is up**: `docker ps --filter name=schrecknet-mysql --format '{{.Status}}'` should show `Up ... (healthy)`. If not, start it from the compose file in the main repo.

4. **`npm install`** inside the worktree (important — there is a known gotcha where missing deps silently resolve from the parent repo's `node_modules` and pass locally but fail in CI).

5. **Verify migration applied**: `npx sequelize-cli db:migrate:status` — should show `up 20260515150512-add-xp-log.js` (or whatever the latest XP-log migration is).

6. **Verify unit tests pass**: `npm run test:unit` — should be 54+ tests passing.

7. **Start servers in background** (use `run_in_background: true`):
   - `npm run devStart` — API on `:5000`. Wait for "Sequelize connected" + "Server started on port 5000".
   - `npx quasar dev` — frontend on `:8080`. Wait for "App URL ... http://localhost:8080/".
   - If a port is already taken by a previous run, identify the holder with `ss -lntp` and either reuse it (if it's pointing at a current worktree) or kill it before starting your own.

## Authentication

There is a pre-existing test account: **`testxp@test.com` / `TestPass123!`** (DB user_id 42). Try logging in with it first — most existing test characters belong to this user.

If that login fails (e.g. someone deleted the user), register a new one via POST `/user/register` with `{"username":"qatester","email":"qa@test.local","password":"QaTest123!","acceptance":1}`, then activate it directly in MySQL: `UPDATE users SET activated=1 WHERE username='qatester';`. DB creds are in `.env` (`DB_USER`, `DB_PASSWORD`, `DB_NAME=login`, `DB_PORT=3307`).

Auth uses JWT in httpOnly cookies; you cannot see them in `document.cookie`. Confirm login by clicking the user icon in the toolbar — if the drawer says "My VtM Characters" / "Logout", you're in.

## Browser-launch gotcha

If `browser_navigate` fails with `Browser is already in use for .../mcp-chrome-for-testing-...`, another VS Code Claude session is holding Playwright's user-data-dir lock. **Stop and ask the user** before killing those processes — they may belong to an active session in another window. If the user gives the go-ahead: `pkill -9 -f "playwright-mcp"; pkill -9 -f "chrome-for-testing"; rm -f /home/chase/.cache/ms-playwright/mcp-chrome-for-testing-*/SingletonLock`, then retry.

## Routes you'll need

- Create: `/vampire/5e`, `/werewolf/5e`, `/hunter/5e`
- Edit: `/vampire/5e/edit/:id`, `/werewolf/5e/edit/:id`, `/hunter/5e/edit/:id`
- View (public): `/vampire/5e/:id`, etc.
- My characters: `/vampire/5e/profile/:id` etc.

## What to test (priority order)

### Priority 1 — Character creation, all three game lines

For each game line, drive the UI through the full create flow and save. Verify the character appears in `myVamps` / `myGarou` / `myHunters` and that reloading the edit page preserves every field.

**VtM 5e** — fill Core Concept; pick attributes (4/3/3/3/2/2/2/2/1 = 22); pick skills (Jack-of-all-trades = 1×3 + 8×2 + 10×1 = 29); add specialties (3 per build); open Clan/Coterie → pick clan + 2 in-clan disciplines (one with 2 dots, one with 1) → pick Generation/Coterie Age → pick Predator Type and its bonus selections → Discipline Skills. Touchstones+Convictions (1-3 of each, equal). Save.

  Edge clans to cover: **Caitiff** (no in-clan disciplines), **Thin-Blood** (different rules), **Hecata** / **Tzimisce** (special discipline access), **Tremere / Banu Haqim** (Blood Sorcery + rituals).

**WtA 5e** — Tribe + Auspice → gifts list filters by patron/auspice; Renown distribution; Attributes/Skills/Specialties; native + tribe + auspice gifts; Rites; Touchstones; Advantages/Flaws.

**HtR 5e** — Creed; Drives, desperation, danger; Attributes/Skills/Specialties; Edges + perks (perks should unlock based on the edge chosen); Advantages/Flaws; Safe Houses, Organizations, Loresheets.

### Priority 2 — Editing + XP Log + Undo (the new feature; highest signal)

For each saved character:

- Open the editor. Verify every section loads with saved values.
- **Set XP** input (manual override) should NOT create a log entry. Check.
- Buy something in **Spend XP**: each category (attribute, skill, discipline/gift/edge, specialty, advantage, flaw). Each save should create a log entry visible in **XP Log**.
- **XP Log** dialog: entries newest-first, with cost + label + balance-after. Undo button appears ONLY on the top entry.
- Click Undo on the top entry. Confirmation dialog reads "Undo this purchase? <label> — you'll get N XP back." Confirm. Verify the touched field reverts AND the XP is refunded.
- Reload the page. Confirm the log entry is gone and the state is consistent.
- Note-editing on a log entry: edit a note, save the character, reload, confirm the note persists.
- **±3xp** buttons on Advantage Dots / Flaw Dots in the summary panel — should create a log entry, should be undoable.

### Priority 3 — Cross-cutting

- Favoriting a character (heart icon); confirm it appears in `/myFavorites`.
- Folders: create one, drop a character in, remove it.
- Cross-line search at `/search`.
- PDF export — download, confirm filesize > 0 and pdf-lib didn't throw in console.
- Public view (`/vampire/5e/:id`) vs edit view: edit controls hidden when anonymous or viewing another user's character.

### Priority 4 — Stress / known-concern tests

- **Multi-buy in one Spend XP session, then undo each from XP Log.** This is the PR-flagged concern. Especially test multi-buy of `Advantage` / `Flaw` in one session (delta-style purchases), where the bug is most likely to manifest. Watch for intermediate-state inconsistency after partial undo, not just final-state correctness after full undo.
- 10+ alternating buy/undo cycles — state should return to baseline every cycle.
- 10 sequential buys then 10 sequential undos — every intermediate state should be linearly consistent.
- Empty/min and max-everywhere character variants.
- Saving with required fields blank should be blocked.

## Defect capture

For each bug found, record:

- **Severity**: Critical (crashes / data loss) / High (broken feature) / Medium (wrong behavior, recoverable) / Low (cosmetic)
- **Title** (one line)
- **Steps to reproduce** (numbered, copy-pasteable)
- **Expected vs Actual**
- **Screenshot path**
- **Console errors / network failures** at the moment of failure (use `browser_console_messages` / `browser_network_requests`)
- **`file:line` hypothesis** if attributable from the trace
- **Game lines affected** (always check whether the same bug exists in the other two — XP-log handlers share structure across `vtm.js`, `werewolf.js`, `hunter.js`)

## Cleanup

- Close the browser (`browser_close`).
- Kill the dev servers you started (use the `KillBash` tool on the background-task IDs).
- Leave the worktree on disk for the user to inspect; do NOT `git worktree remove` it.

## Output

Write a markdown report to `/home/chase/projects/SchreckNet/docs/qa/reports/YYYY-MM-DD-<feature-slug>.md` (in the main repo, not the worktree — so it survives worktree cleanup). Put screenshots in a sibling `YYYY-MM-DD-<feature-slug>-screenshots/` directory. Sections:

1. **Summary** (counts, headline result)
2. **Defects** (each in the format above)
3. **What was verified** (per priority bucket — itemize what passed)
4. **Flows not tested and why** (be honest)
5. **Recommendations / follow-up**
6. **Test artifacts left behind** (created characters, DB rows, screenshots, servers still running)

A realistic full pass is 60-90 minutes. Time pressure compromises — drop in order: P4 stress → P3 cross-cutting → P1 W/H create → P1 VtM edge clans. Always keep P1 VtM happy-path + P2 XP-Log-Undo, because those are the highest-signal flows.

## Reference baseline

Prior QA reports are archived under `/home/chase/projects/SchreckNet/docs/qa/reports/`. Skim the most recent one before starting — known-broken behavior listed there gives you regression targets. As of 2026-05-15, the multi-buy advantage/flaw undo bug at [src/lib/xp/handlers/vtm.js:228](src/lib/xp/handlers/vtm.js#L228) (and parallel files in werewolf/hunter) was confirmed; check whether it's been fixed before starting your run.
