# SchreckNet end-to-end tests

Browser-driven regression tests using [`@playwright/test`](https://playwright.dev/).
Specs live in `tests/e2e/`; helpers in `tests/e2e/helpers/`; auth + DB
seed fixtures in `tests/e2e/fixtures/`.

## Running

```bash
# One-time per machine (downloads chromium):
npx playwright install chromium

# Run the suite:
npm run test:e2e

# Or just one spec, in headed mode, to debug:
npx playwright test tests/e2e/xp-log/multi-buy-advantage-undo.spec.js --headed
```

`playwright.config.js` is set to `webServer: [...]` so Playwright will
boot the API (`node server.js` on `:5000`) and the SPA (`npx quasar dev`
on `:8080`) for you. If the servers are already up locally,
`reuseExistingServer: true` lets the run attach to them instead of
double-booting.

## Prerequisites

- MySQL container running (`docker compose up -d` from the repo root, or
  the equivalent local install on `127.0.0.1:3307`).
- `.env` populated with the same `DB_*` keys the server uses — the seed
  helpers read it directly via `dotenv`.
- A test user `testxp@test.com` / `TestPass123!` with `activated = 1`
  exists in the `users` table (user_id 42). Re-create with:
  ```sql
  -- one-time, if missing
  INSERT INTO users (username, email, password, terms_accepted, activated)
  VALUES ('testxp', 'testxp@test.com', '<bcrypt-hash>', 1, 1);
  ```

## Conventions

- **One worker.** Specs share MySQL state. Parallel runs would race on
  the seeded character rows. Keep `workers: 1` in `playwright.config.js`
  until the seed helpers grow per-test isolation.
- **Seed → assert → cleanup.** `beforeEach` clones a template character
  into the test user; `afterEach` deletes it. Don't mutate user-facing
  characters (e.g. `QA Tester Vamp` id 103) — leave them alone for
  manual exploration.
- **Use the helpers.** Quasar selects need a click-then-pick ritual that
  doesn't compose with naive `select()`; the spendXp dialog re-renders
  refs after Save. The helpers in `tests/e2e/helpers/` encode the
  patterns that actually work — extend them rather than rolling
  per-spec workarounds.
- **`hideWebpackOverlay(page)` early.** The webpack-dev-server runtime
  error overlay (a benign ResizeObserver loop, mostly) intercepts
  pointer events and breaks subsequent clicks. Call it after the first
  navigation in each spec.

## Adding a new spec

1. Drop a `*.spec.js` under `tests/e2e/<feature>/`.
2. If the spec needs a fresh character, use `seedVampire` /
   `seedGarou` / `seedHunter` from `fixtures/seed.js`.
3. Use `loginAsTestxp(context)` in `beforeEach` to drop auth cookies
   on the browser context.
4. Always `deleteCharacter(table, id)` in `afterEach`.
5. Run locally with `--headed --debug` while developing.

## Roadmap

The first spec covers PR #284's regression on V/W/H. Highest-value
follow-ups (in rough priority):

- XP log note editing persistence (`xp-log/note-editing.spec.js`)
- ±3xp summary-button buys + undo (`xp-log/summary-button-buy.spec.js`)
- Cross-line favorites round-trip (`favorites/round-trip.spec.js`) —
  requires the fix in PR #285 to be on `main` (it is, as of
  `b698574`)
- VtM clan-specific XP categories (Tremere rituals, Hecata oblivion
  ceremonies)
- Public-view-vs-edit-view auth check on V/W/H
- PDF export — assert filesize > 0 and the character name appears

A GitHub Action (`.github/workflows/e2e.yml`) wiring this into CI is
deliberately deferred to its own PR — get the spec stable locally
first, then automate.
