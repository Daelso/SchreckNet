# XP Log and Undo Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every character a persistent log of XP transactions with strict LIFO undo, covering all three game lines (VtM, Werewolf, Hunter) through one shared module.

**Architecture:** New `xp_log` JSON column on `vampires` / `hunters` / `garou` tables, added via a real Sequelize migration (the repo's first). Shared `src/lib/xp/` module with pure log helpers, a Quasar dialog component, and per-game-line handler registries. Each line's existing `spendXp.vue` and `edit-*.vue` are wired to the registry — one to *record* purchases, one to *display + undo* via a new "XP Log" menu item.

**Tech Stack:** Vue 3 / Quasar 2 (webpack CLI), Sequelize 6 + MySQL, Express 4, sequelize-cli (newly introduced), vitest (newly introduced for pure-helper tests only).

**Source spec:** [docs/superpowers/specs/2026-05-15-xp-log-and-undo-design.md](../specs/2026-05-15-xp-log-and-undo-design.md). Read it before starting — it has the cost-sign convention, payload conventions, and edge-case notes that the steps below assume.

**Working branch:** `xp_log` (off `origin/main`). Worktree at `.worktrees/xp_log/`. All commits below land on `xp_log`.

**Binding instruction:** When the plan reaches Chunk 4 (the `XpLogDialog.vue` component), the executor **must invoke the `frontend-design` skill** before authoring the component. This is captured in user memory and called out again in Chunk 4.

---

## File structure

### Files to create

This is the cumulative end-state across all chunks. The "Chunk" column says where each file first appears.

| Path | Chunk | Purpose |
|---|---|---|
| `.sequelizerc` | 1 | Tells sequelize-cli where config / migrations / models live |
| `server/config/config.js` | 1 | DB connection config per env (reads from `.env`) |
| `server/migrations/<ts>-add-xp-log.js` | 1 | Adds `xp_log` JSON column to vampires/hunters/garou |
| `vitest.config.js` | 3 | Minimal vitest config |
| `src/lib/xp/xpLog.js` | 3 | Pure helpers: `appendEntry`, `undoLast`, `newId` |
| `src/lib/xp/__tests__/xpLog.test.js` | 3 | Vitest unit tests for the helpers |
| `src/lib/xp/handlers/vtm.js` | 3 | VtM type registry: `{ label, record, undo }` per type |
| `src/lib/xp/handlers/werewolf.js` | 3 | Werewolf type registry |
| `src/lib/xp/handlers/hunter.js` | 3 | Hunter type registry |
| `src/lib/xp/handlers/__tests__/vtm.test.js` | 3 | VtM record/undo round-trip tests |
| `src/lib/xp/handlers/__tests__/werewolf.test.js` | 3 | Werewolf record/undo round-trip tests |
| `src/lib/xp/handlers/__tests__/hunter.test.js` | 3 | Hunter record/undo round-trip tests |
| `src/lib/xp/XpLogDialog.vue` | 4 | Shared dialog: list of entries + LIFO undo + note edits |

### Files to modify

| Path | Change |
|---|---|
| `package.json` | devDeps: `sequelize-cli`, `vitest`. Scripts: `db:migrate`, `db:migrate:undo`, `migration:create`, `test:unit` |
| `README.md` | Add a "Database migrations" section explaining the new commands |
| `server/models/vampires.js` | Add `xp_log` JSON column |
| `server/models/Hunters.js` | Add `xp_log` JSON column |
| `server/models/werewolf/Garou.js` | Add `xp_log` JSON column |
| `server/api/vampires.js` | Accept `xp_log` in POST `/new` and the edit route; return it on GET (already does, but verify) |
| `server/api/hunters.js` | Same |
| `server/api/garou.js` | Same |
| `src/components/character_creator/vtm/spendXp.vue` | Call `vtmHandlers[type].record(...)` and append to the in-flight log on each successful purchase |
| `src/components/character_creator/werewolf/spendXp.vue` | Same with `werewolfHandlers` |
| `src/components/character_creator/hunter/spendXp.vue` | Same with `hunterHandlers` |
| `src/components/character_creator/vtm/edit-vampire-5e.vue` | Reactive `xp_log` state seeded from server; new "XP Log" menu item opening `<XpLogDialog>`; ±3xp button handlers record entries; axios save body includes `xp_log` |
| `src/components/character_creator/werewolf/edit-garou-5e.vue` | Same |
| `src/components/character_creator/hunter/edit-hunter-5e.vue` | Same |

---

## Chunk 1: Migrations infrastructure + schema migration + model updates

This chunk is one logical unit because we should not commit the new column on the models without the migration that creates it.

### Task 1.1: Add sequelize-cli + vitest devDeps and npm scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1.1.1: Add devDependencies**

Run from worktree root:

```bash
npm install --save-dev sequelize-cli@^6.6.2 vitest@^1.6.0
```

Expected: both packages added to `devDependencies` in `package.json`, `package-lock.json` updated, no other changes.

- [ ] **Step 1.1.2: Add npm scripts**

Edit `package.json` `"scripts"` block. Add (preserve existing scripts):

```json
"db:migrate": "sequelize-cli db:migrate",
"db:migrate:undo": "sequelize-cli db:migrate:undo",
"migration:create": "sequelize-cli migration:generate --name",
"test:unit": "vitest run"
```

- [ ] **Step 1.1.3: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add sequelize-cli and vitest devDeps + scripts"
```

### Task 1.2: Add .sequelizerc and server/config/config.js

**Files:**
- Create: `.sequelizerc`
- Create: `server/config/config.js`

- [ ] **Step 1.2.1: Create `.sequelizerc`**

```js
const path = require("path");

module.exports = {
  "config":          path.resolve("server/config", "config.js"),
  "models-path":     path.resolve("server", "models"),
  "migrations-path": path.resolve("server", "migrations"),
  "seeders-path":    path.resolve("server", "seeders"),
};
```

- [ ] **Step 1.2.2: Create `server/config/config.js`**

Reads the same env keys [server/database.js](../../server/database.js) already uses. CommonJS to match the rest of the server code.

Note on env conventions: sequelize-cli specifically reads `NODE_ENV` to pick the section (defaults to `development` when unset). The app itself uses a separate `process.env.ENV` (`DEV`/`prod`) for its own switches — both can coexist. The `development` and `production` sections here are intentionally identical because connection info doesn't vary; the keys exist purely so sequelize-cli can find a section.

```js
require("dotenv").config();

// sequelize-cli selects a section by NODE_ENV (development by default).
// The app itself uses process.env.ENV (DEV|prod) for its own runtime flags;
// the two env-var conventions coexist intentionally.
const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT || 3306,
  dialect:  "mysql",
};

module.exports = {
  development: base,
  production:  base,
};
```

- [ ] **Step 1.2.3: Verify sequelize-cli is wired up**

```bash
npx sequelize-cli --version
```

Expected: a version string (not an error). No DB connection happens yet.

- [ ] **Step 1.2.4: Commit**

```bash
git add .sequelizerc server/config/config.js
git commit -m "Wire up sequelize-cli with .sequelizerc + config"
```

### Task 1.3: Generate and write the xp_log migration

**Files:**
- Create: `server/migrations/<generated-timestamp>-add-xp-log.js`

- [ ] **Step 1.3.1: Generate the migration file**

```bash
npm run migration:create -- add-xp-log
```

Expected: a new file appears under `server/migrations/` (the directory is auto-created on first run) with name like `20260515183000-add-xp-log.js` containing a stub `up` / `down` pair. Note the exact filename — subsequent steps refer to it.

- [ ] **Step 1.3.2: Replace the stub with the real migration**

Open the generated file and replace its body with:

```js
"use strict";

const TABLES = ["vampires", "hunters", "garou"];

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (const table of TABLES) {
      await queryInterface.addColumn(table, "xp_log", {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
      });
    }
  },

  async down(queryInterface) {
    for (const table of TABLES) {
      await queryInterface.removeColumn(table, "xp_log");
    }
  },
};
```

- [ ] **Step 1.3.3: Run the migration against the local dev DB**

```bash
npm run db:migrate
```

Expected output: `== <timestamp>-add-xp-log: migrating =======` followed by `== <timestamp>-add-xp-log: migrated`. A `SequelizeMeta` table is created on first run (this is normal — sequelize-cli uses it to track applied migrations).

If this fails, **stop and report**. Likely causes: `.env` DB creds missing/wrong, MySQL not running, or one of the three tables doesn't exist locally. Do not "fix" by switching to raw SQL — the whole point of this PR is to use migrations.

- [ ] **Step 1.3.4: Verify the columns exist**

Preferred (shell-agnostic — uses the same connection config sequelize-cli just used):

```bash
npx sequelize-cli db:migrate:status
```

Expected: the `add-xp-log` migration is listed with status `up`.

If you want to inspect the columns directly with `mysql`, source the env first so the credentials are exported:

```bash
set -a; source .env; set +a
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e \
  "SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM information_schema.COLUMNS \
   WHERE TABLE_SCHEMA = DATABASE() AND COLUMN_NAME = 'xp_log';"
```

Expected: three rows, one each for `vampires`, `hunters`, `garou`, all with `DATA_TYPE = json`.

- [ ] **Step 1.3.5: Roll back, re-run, confirm idempotency**

```bash
npm run db:migrate:undo
npm run db:migrate
```

Expected: undo removes the columns; second migrate re-adds them. Run the verification query from Step 1.3.4 again — three rows.

- [ ] **Step 1.3.6: Commit**

```bash
git add server/migrations/
git commit -m "Migration: add xp_log JSON column to vampires/hunters/garou"
```

### Task 1.4: Update the three Sequelize models

**Files:**
- Modify: `server/models/vampires.js`
- Modify: `server/models/Hunters.js`
- Modify: `server/models/werewolf/Garou.js`

- [ ] **Step 1.4.1: Add `xp_log` to `server/models/vampires.js`**

Locate the existing `xp` column (around [server/models/vampires.js:115](../../server/models/vampires.js#L115)). Immediately after it, add:

```js
xp_log: {
  type: Sequelize.JSON,
  allowNull: false,
  defaultValue: [],
},
```

- [ ] **Step 1.4.2: Add `xp_log` to `server/models/Hunters.js`**

Same definition. Place it after the existing `xp` column (around line 88).

- [ ] **Step 1.4.3: Add `xp_log` to `server/models/werewolf/Garou.js`**

Same definition. Place it after the existing `spent_xp` column (around line 89). Note that Garou.js uses nested-options form (`db.sequelize.define("garou", { ...cols }, options)`); add the column inside the columns object, matching the existing indentation.

- [ ] **Step 1.4.4: Verify the models still load**

```bash
node -e "require('./server/models/vampires.js'); require('./server/models/Hunters.js'); require('./server/models/werewolf/Garou.js'); console.log('models loaded OK');"
```

Expected: `models loaded OK`. Any thrown error means a typo or syntax issue.

- [ ] **Step 1.4.5: Commit**

```bash
git add server/models/vampires.js server/models/Hunters.js server/models/werewolf/Garou.js
git commit -m "Add xp_log column to Sequelize models"
```

### Task 1.5: Document migrations in README

**Files:**
- Modify: `README.md`

- [ ] **Step 1.5.1: Add a "Database migrations" section**

Append (or insert near the existing setup/dev sections) the following block. **Paste it literally** — the inner fences here use triple-backticks because the outer wrapper in this plan is just illustrative; the README itself only has the one level of fencing:

~~~markdown
## Database migrations

Schema changes go through sequelize-cli (introduced 2026-05). The flow:

```bash
npm run migration:create -- some-name   # scaffolds server/migrations/<ts>-some-name.js
# edit the generated file
npm run db:migrate                       # apply
npm run db:migrate:undo                  # undo the most recent migration
```

The CLI reads connection info from `server/config/config.js`, which reuses
the same `.env` keys the app uses at runtime. Migration history is tracked
in a `SequelizeMeta` table created on first run.

Migrations started tracking from the `add-xp-log` migration forward;
prior schema is implicit (defined directly by the Sequelize models).
~~~

- [ ] **Step 1.5.2: Commit**

```bash
git add README.md
git commit -m "Document database migration workflow"
```

---

**Chunk 1 done.** At this point: sequelize-cli is wired in, the column exists in the live DB, the models reflect it, and the migration workflow is documented. The frontend still doesn't know about `xp_log` — that comes in Chunk 3+.

---

## Chunk 2: Server API — accept and persist xp_log

Three near-identical changes to the routers. Each route family has the same shape: a POST `/new` that creates a character row, a PUT edit route that updates it, plus GETs that return all fields (no change needed — `findByPk(...).dataValues` already includes new columns).

### Task 2.1: Vampires routes

**Files:**
- Modify: `server/api/vampires.js`

- [ ] **Step 2.1.1: Add `xp_log` to the create payload**

In [server/api/vampires.js](../../server/api/vampires.js), find the `Vampires.create({...})` call (around line 16). Locate the `xp: req.body.xp,` line (around line 44). Add immediately after it:

```js
xp_log: req.body.xp_log || [],
```

The `|| []` fallback keeps the route compatible with older clients that don't send the field yet (and matches the column's default value).

- [ ] **Step 2.1.2: Add `xp_log` to the edit payload**

In the same file, find the `kindred.update({...})` call inside the `/vampire/edit/:id` route (around line 138). Locate the `xp: req.body.xp,` line (around line 166). Add immediately after it:

```js
xp_log: req.body.xp_log || [],
```

- [ ] **Step 2.1.3: Smoke-test with curl** *(optional but recommended — confirms the round-trip works before you wire the frontend)*

Start the server (`npm run devStart` in a separate shell). From the worktree:

```bash
# Replace <id> with a real vampire id owned by your dev account, and <cookie>
# with a valid `access` cookie from a logged-in browser session.
curl -s -X PUT http://localhost:5000/vampires/vampire/edit/<id> \
  -H "Content-Type: application/json" \
  -H "Cookie: access=<cookie>" \
  -d '{"xp_log": [{"id":"smoke","ts":"2026-05-15T00:00:00Z","cost":1,"balanceAfter":0,"note":"","type":"smoke","payload":{}}], "xp": 0, "name": "<existing name>"}'
```

Then GET the character and confirm `xp_log` round-trips:

```bash
curl -s http://localhost:5000/vampires/vampire/<id> | jq .xp_log
```

Expected: the smoke array you just sent comes back. (This step is a one-time sanity check — you can revert the smoke entry by issuing another PUT with `xp_log: []`.)

- [ ] **Step 2.1.4: Commit**

```bash
git add server/api/vampires.js
git commit -m "Vampires routes: accept and persist xp_log"
```

### Task 2.2: Hunters routes

**Files:**
- Modify: `server/api/hunters.js`

- [ ] **Step 2.2.1: Locate the create and edit payloads**

In [server/api/hunters.js](../../server/api/hunters.js), find the two places that read from `req.body` to write character fields — typically a `Hunters.create({...})` in the POST `/new` route and a `hunter.update({...})` in a PUT edit route. The exact structure mirrors vampires.js.

- [ ] **Step 2.2.2: Add `xp_log` to both payloads**

In each place, after the existing `xp: req.body.xp,` line, add:

```js
xp_log: req.body.xp_log || [],
```

If there is any divergence from the vampires.js shape (e.g. the edit route uses a different verb or path), document it inline as a code comment but make the same body-field addition.

- [ ] **Step 2.2.3: Commit**

```bash
git add server/api/hunters.js
git commit -m "Hunters routes: accept and persist xp_log"
```

### Task 2.3: Garou routes

**Files:**
- Modify: `server/api/garou.js`

- [ ] **Step 2.3.1: Locate the create and edit payloads**

In [server/api/garou.js](../../server/api/garou.js), find the equivalent create and update payloads. Garou's model has both `xp` and `spent_xp` columns — leave both untouched and add `xp_log` next to `xp` (or wherever feels structurally consistent in that file).

- [ ] **Step 2.3.2: Add `xp_log` to both payloads**

Same one-liner:

```js
xp_log: req.body.xp_log || [],
```

- [ ] **Step 2.3.3: Commit**

```bash
git add server/api/garou.js
git commit -m "Garou routes: accept and persist xp_log"
```

---

**Chunk 2 done.** The server now round-trips `xp_log` for all three game lines. The frontend still doesn't send the field, so no behavior changes user-visibly yet — but a future GET will surface `[]` for legacy characters and whatever was persisted for any character touched after Chunk 5.

---

## Chunk 3: Shared frontend lib + handler registries (TDD)

This is the only chunk with automated tests. We test the pure helpers in `xpLog.js` and the per-line handler `record`/`undo` round-trips. The Vue component (Chunk 4) and per-line integration glue (Chunk 5) are verified manually.

### Task 3.1: Vitest configuration

**Files:**
- Create: `vitest.config.js`

- [ ] **Step 3.1.1: Write `vitest.config.js`**

Minimal config. The project uses webpack-based Quasar; vitest runs independently and only over plain `.js` files for now.

```js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/lib/**/*.test.js"],
    environment: "node",
  },
});
```

- [ ] **Step 3.1.2: Verify vitest discovers no tests yet**

```bash
npm run test:unit
```

Expected: exits 0 with "No test files found, exiting with code 0" or similar. Vitest is wired but has nothing to run yet.

- [ ] **Step 3.1.3: Commit**

```bash
git add vitest.config.js
git commit -m "Vitest config (pure helpers only)"
```

### Task 3.2: Pure log helpers — TDD

**Files:**
- Create: `src/lib/xp/xpLog.js`
- Create: `src/lib/xp/__tests__/xpLog.test.js`

The helpers we're building:

- `newId()` — returns a string id unique enough for in-memory + JSON storage. Use `crypto.randomUUID()` (available in Node 18+ and modern browsers).
- `appendEntry(log, partialEntry, currentXp)` — returns a new log array with the entry appended. Fills `id`, `ts`, and `balanceAfter`. **Does not mutate inputs.**
- `undoLast(log)` — returns `{ log: <new array with tail popped>, entry: <the popped entry or null> }`. Does not mutate inputs.

- [ ] **Step 3.2.1: Write the failing tests**

Create `src/lib/xp/__tests__/xpLog.test.js`:

```js
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
```

- [ ] **Step 3.2.2: Run tests — verify they fail with "module not found" or similar**

```bash
npm run test:unit -- src/lib/xp/__tests__/xpLog.test.js
```

Expected: FAIL. The import resolves to a non-existent file.

- [ ] **Step 3.2.3: Write the minimal implementation**

Create `src/lib/xp/xpLog.js`:

```js
// globalThis.crypto.randomUUID is available in browsers and Node >= 19 as a
// global. The project requires Node >= 22.12 (see CLAUDE.md), so no fallback
// is needed; this works identically in the Quasar bundle and in vitest.
export function newId() {
  return globalThis.crypto.randomUUID();
}

export function appendEntry(log, partial, currentXp) {
  const entry = {
    id: newId(),
    ts: new Date().toISOString(),
    note: "",
    ...partial,
    balanceAfter: currentXp - partial.cost,
  };
  return [...log, entry];
}

export function undoLast(log) {
  if (log.length === 0) {
    return { log: [], entry: null };
  }
  const next = log.slice(0, -1);
  const entry = log[log.length - 1];
  return { log: next, entry };
}
```

- [ ] **Step 3.2.4: Re-run tests — verify they pass**

```bash
npm run test:unit -- src/lib/xp/__tests__/xpLog.test.js
```

Expected: PASS. All tests green.

- [ ] **Step 3.2.5: Commit**

```bash
git add src/lib/xp/xpLog.js src/lib/xp/__tests__/xpLog.test.js
git commit -m "Add pure XP log helpers (appendEntry, undoLast, newId)"
```

### Task 3.3: VtM handler registry — TDD

**Files:**
- Create: `src/lib/xp/handlers/vtm.js`
- Create: `src/lib/xp/handlers/__tests__/vtm.test.js`

The registry shape (per spec):

```js
export default {
  <type>: {
    label: (entry) => "human-readable description",
    record: (charState, input) => ({ type, cost, payload }),  // does NOT touch xp/xp_log itself
    undo:   (charState, entry) => void,                        // mutates charState back
  },
  // ...
}
```

**Important separation:** `record` produces the entry envelope minus `id`/`ts`/`balanceAfter` (those are filled by `appendEntry`). `record` does not mutate `charState` — the existing `spendXp.vue` purchase logic still mutates the character. `record` only describes *what was changed*. `undo` is the only function that mutates `charState` (to reverse the change).

The VtM types (from the spec):

`attribute_raise`, `skill_raise`, `specialty`, `clan_discipline`, `caitiff_discipline`, `out_of_clan_discipline`, `blood_potency`, `blood_ritual`, `oblivion_ceremony`, `advantage_point`, `flaw_point`.

**Verification before coding:** before writing the registry, the executor must read [src/components/character_creator/vtm/spendXp.vue](../../src/components/character_creator/vtm/spendXp.vue) — specifically the big switch in `purchaseMade()` (around line 446) — and the `±3xp` button handlers in [src/components/character_creator/vtm/edit-vampire-5e.vue](../../src/components/character_creator/vtm/edit-vampire-5e.vue) (around lines 1280–1330). The registry is a structured rewrite of what those switches already do.

**On charState shape:** the `record(charState, input)` API is an adapter, not a source of truth. The handler should accept whatever the existing `spendXp.vue` already has on hand (attribute object, skill key, discipline name + power, etc.) and read from `charState` in the same shape `spendXp.vue` reads it. If a field is shaped differently than the test example below (e.g. `attributes` happens to be a Map instead of an array in some flow), match the real shape — don't normalize charState. The handler's only job is to describe the change and reverse it.

- [ ] **Step 3.3.1: Write the failing tests**

Create `src/lib/xp/handlers/__tests__/vtm.test.js`. Cover *every* type with a record-then-undo round trip. Pattern:

```js
import { describe, it, expect } from "vitest";
import handlers from "../vtm.js";

describe("vtm handlers — record/undo round trip", () => {
  it("attribute_raise: record then undo restores prior points", () => {
    const charState = {
      attributes: [{ name: "Strength", points: 2 }],
    };
    const input = { attributeName: "Strength" }; // the data spendXp.vue has on hand
    const entry = handlers.attribute_raise.record(charState, input);

    // record describes the change; spendXp.vue applies it
    expect(entry.type).toBe("attribute_raise");
    expect(entry.cost).toBe(15); // (2+1)*5 per spec table
    expect(entry.payload).toEqual({
      attribute: "Strength",
      priorValue: 2,
      newValue: 3,
    });

    // simulate the mutation spendXp.vue would do
    charState.attributes[0].points = 3;

    // ... then undo restores
    handlers.attribute_raise.undo(charState, entry);
    expect(charState.attributes[0].points).toBe(2);
  });

  it("skill_raise: record then undo restores prior level", () => {
    const charState = { skills: { brawl: 1 } };
    const entry = handlers.skill_raise.record(charState, { skillName: "Brawl" });
    expect(entry.cost).toBe(6); // (1+1)*3
    expect(entry.payload).toEqual({ skill: "brawl", priorValue: 1, newValue: 2 });
    charState.skills.brawl = 2;
    handlers.skill_raise.undo(charState, entry);
    expect(charState.skills.brawl).toBe(1);
  });

  it("specialty: record adds an entryId, undo removes the matching item", () => {
    const charState = { specialtiesFromXp: [] };
    const entry = handlers.specialty.record(charState, {
      skill: "Streetwise",
      specialty: "Pickpocket",
    });
    expect(entry.cost).toBe(3);
    expect(entry.payload.entryId).toMatch(/.+/);
    // simulate spendXp.vue pushing the specialty (it must include the entryId)
    charState.specialtiesFromXp.push({
      entryId: entry.payload.entryId,
      skill: "Streetwise",
      specialty: "Pickpocket",
    });
    handlers.specialty.undo(charState, entry);
    expect(charState.specialtiesFromXp).toEqual([]);
  });

  it("clan_discipline: record then undo restores level and removes the power", () => {
    const charState = {
      disciplines: { Dominate: 1 },
      disciplineSkillsObj: [],
    };
    const entry = handlers.clan_discipline.record(charState, {
      discipline: "Dominate",
      power: "Mesmerize",
    });
    expect(entry.cost).toBe(10); // (1+1)*5
    expect(entry.payload).toMatchObject({
      discipline: "Dominate",
      priorValue: 1,
      newValue: 2,
      power: "Mesmerize",
    });
    expect(entry.payload.entryId).toMatch(/.+/);

    // simulate spendXp.vue mutation
    charState.disciplines.Dominate = 2;
    charState.disciplineSkillsObj.push({
      entryId: entry.payload.entryId,
      discipline: "Dominate",
      skill: "Mesmerize",
    });

    handlers.clan_discipline.undo(charState, entry);
    expect(charState.disciplines.Dominate).toBe(1);
    expect(charState.disciplineSkillsObj).toEqual([]);
  });

  // Cover the remaining types with one round-trip each. Use the cost formulas
  // from the current spendXp.vue switch as ground truth:
  //   caitiff_discipline:    first dot = 6; subsequent = (lvl+1)*6
  //   out_of_clan_discipline: (lvl+1)*7
  //   blood_potency:         (potency+1)*10
  //   blood_ritual:          ritualLevel * 3       (no scalar change; push into disciplineSkillsObj)
  //   oblivion_ceremony:     ceremonyLevel * 3     (same shape as blood_ritual)
  //   advantage_point:       3 each (positive when adding, negative when refunding via the - button)
  //   flaw_point:            3 each (positive when adding, negative when refunding)
  //
  // For advantage_point/flaw_point, the input includes a sign:
  //   { delta: +1 }  -> cost +3, payload { counter: "advantages_remaining", priorValue, delta: +1 }
  //   { delta: -1 }  -> cost -3, payload { ... delta: -1 }  (the "Remove" button)

  it.todo("caitiff_discipline first-dot");
  it.todo("caitiff_discipline subsequent-dot");
  it.todo("out_of_clan_discipline new-to-clan");
  it.todo("out_of_clan_discipline already-known");
  it.todo("blood_potency");
  it.todo("blood_ritual");
  it.todo("oblivion_ceremony");
  it.todo("advantage_point add");
  it.todo("advantage_point remove");
  it.todo("flaw_point add");
  it.todo("flaw_point remove");
});
```

(The `.todo` items are flagged so the test runner reports them as pending — they must be replaced with real tests in the same pattern as the four examples above before this task is considered done.)

- [ ] **Step 3.3.2: Run tests, expect failure**

```bash
npm run test:unit -- src/lib/xp/handlers/__tests__/vtm.test.js
```

Expected: module-not-found.

- [ ] **Step 3.3.3: Write the registry**

Create `src/lib/xp/handlers/vtm.js`. Implement each type as `{ label, record, undo }`. Reference the cost formulas from the existing `spendXp.vue` switch and the payload conventions from the spec. Skeleton:

```js
import { newId } from "../xpLog.js";

const handlers = {
  attribute_raise: {
    label: (e) => `Raised ${e.payload.attribute} to ${e.payload.newValue}`,
    record: (state, input) => {
      const attr = state.attributes.find((a) => a.name === input.attributeName);
      const priorValue = attr.points;
      const newValue = priorValue + 1;
      return {
        type: "attribute_raise",
        cost: newValue * 5,
        payload: { attribute: input.attributeName, priorValue, newValue },
      };
    },
    undo: (state, entry) => {
      const attr = state.attributes.find((a) => a.name === entry.payload.attribute);
      attr.points = entry.payload.priorValue;
    },
  },
  // ... implement skill_raise, specialty, clan_discipline, caitiff_discipline,
  //     out_of_clan_discipline, blood_potency, blood_ritual, oblivion_ceremony,
  //     advantage_point, flaw_point following the same pattern.
};

export default handlers;
```

For array-pushing types (`specialty`, `clan_discipline`, `caitiff_discipline`, `out_of_clan_discipline`, `blood_ritual`, `oblivion_ceremony`), generate `entryId` inside `record` and surface it on the payload; `undo` filters the target array by that `entryId`.

- [ ] **Step 3.3.4: Replace each `.todo` test with a real round-trip test, then re-run**

```bash
npm run test:unit -- src/lib/xp/handlers/__tests__/vtm.test.js
```

Expected: all tests pass, no `.todo` remaining. **Do not commit with `.todo` placeholders in the test file.**

- [ ] **Step 3.3.5: Commit**

```bash
git add src/lib/xp/handlers/vtm.js src/lib/xp/handlers/__tests__/vtm.test.js
git commit -m "Add VtM XP handler registry with record/undo round-trip tests"
```

### Task 3.4: Werewolf handler registry — TDD

**Files:**
- Create: `src/lib/xp/handlers/werewolf.js`
- Create: `src/lib/xp/handlers/__tests__/werewolf.test.js`

- [ ] **Step 3.4.1: Enumerate Werewolf types**

Read [src/components/character_creator/werewolf/spendXp.vue](../../src/components/character_creator/werewolf/spendXp.vue) — specifically its `purchaseMade()` switch — and list every case. Likely set (verify): `attribute_raise`, `skill_raise`, `specialty`, `gift`, `rite`, plus any renown- or merit-related cases.

Also note: the Garou model has both `xp` and `spent_xp` columns. If `werewolf/spendXp.vue` updates `spent_xp` on purchase, the handler's `undo` must reverse that too. Confirm by reading the file.

- [ ] **Step 3.4.2: Write the failing tests**

Same pattern as Task 3.3 — one round-trip test per type. Stub the rest as `.todo` and fill them in step 3.4.4.

If `spent_xp` is touched by any purchase in `werewolf/spendXp.vue`, include an explicit assertion in that type's round-trip test that `charState.spent_xp` returns to its pre-record value after `undo`.

- [ ] **Step 3.4.3: Run, expect failure**

```bash
npm run test:unit -- src/lib/xp/handlers/__tests__/werewolf.test.js
```

- [ ] **Step 3.4.4: Implement the registry, fill remaining tests, run**

```bash
npm run test:unit -- src/lib/xp/handlers/__tests__/werewolf.test.js
```

Expected: PASS, no `.todo` left.

- [ ] **Step 3.4.5: Commit**

```bash
git add src/lib/xp/handlers/werewolf.js src/lib/xp/handlers/__tests__/werewolf.test.js
git commit -m "Add Werewolf XP handler registry with record/undo round-trip tests"
```

### Task 3.5: Hunter handler registry — TDD

**Files:**
- Create: `src/lib/xp/handlers/hunter.js`
- Create: `src/lib/xp/handlers/__tests__/hunter.test.js`

- [ ] **Step 3.5.1: Enumerate Hunter types**

Read [src/components/character_creator/hunter/spendXp.vue](../../src/components/character_creator/hunter/spendXp.vue). Likely set (verify): `attribute_raise`, `skill_raise`, `specialty`, `edge`, `perk`, plus any drives/loresheets cases.

- [ ] **Step 3.5.2: Write the failing tests**

Same pattern as 3.3.

- [ ] **Step 3.5.3: Run, expect failure**

```bash
npm run test:unit -- src/lib/xp/handlers/__tests__/hunter.test.js
```

- [ ] **Step 3.5.4: Implement the registry, fill remaining tests, run**

```bash
npm run test:unit -- src/lib/xp/handlers/__tests__/hunter.test.js
```

Expected: PASS, no `.todo` left.

- [ ] **Step 3.5.5: Commit**

```bash
git add src/lib/xp/handlers/hunter.js src/lib/xp/handlers/__tests__/hunter.test.js
git commit -m "Add Hunter XP handler registry with record/undo round-trip tests"
```

### Task 3.6: Run the full suite + guard against leftover .todo

- [ ] **Step 3.6.1: Run all unit tests**

```bash
npm run test:unit
```

Expected: every file under `src/lib/xp/**/*.test.js` passes. No `.todo`, no skipped tests.

- [ ] **Step 3.6.2: Fail loudly if any `.todo` is still in the test files**

```bash
if grep -RE "(^|\s)it\.todo\(" src/lib/xp; then
  echo "Leftover .todo in tests — fill these in before declaring Chunk 3 done." >&2
  exit 1
fi
```

Expected: no output and exit 0. Any matches mean a type wasn't tested — go back and write the test.

---

**Chunk 3 done.** Pure helpers + three registries exist with full round-trip coverage. Nothing is wired into the actual Vue components yet — that's Chunk 4 (dialog) and Chunk 5 (per-line glue).

---

## Chunk 4: XpLogDialog component

> **Required first step:** Before authoring any of the component code in this chunk, **invoke the `frontend-design` skill**. This is a binding instruction in user memory (file: `feedback_frontend_design_skill.md`). The skill produces the visual design and structure; the steps below give you the *interface contract* (props/emits/behavior) it must satisfy, but the layout, copy, colors, and visual polish are the skill's job.

### Task 4.1: Invoke frontend-design and produce a design artifact

- [ ] **Step 4.1.1: Invoke the `frontend-design` skill**

Provide it with this context:

- **Component:** `src/lib/xp/XpLogDialog.vue` (new Quasar `q-dialog`).
- **Aesthetic anchor:** the existing `spendXp.vue` dialog for any of the three game lines — `bg-primary` header, `bg-dark` page body, `q-toolbar` with title and a Save button on the right. Match this voice.
- **Reference mockup from the spec:**
  ```
  ┌─ XP Log — 27 XP Remaining ──────────────────────┐
  │  May 15, 2026 · 18:42                  [Undo]   │
  │  Raised Dominate to 2 (Mesmerize)               │
  │  Cost: 6 XP    Balance after: 27                │
  │  [editable note ...]                            │
  ├─────────────────────────────────────────────────┤
  │  ...                                            │
  └─────────────────────────────────────────────────┘
  ```
- **Constraints:**
  - Entries listed **newest first**.
  - The top entry (only) shows an "Undo" button. All other entries: no undo affordance.
  - Each entry has a per-row inline note input. Commits to local state on blur.
  - Empty state copy: "No XP transactions logged yet. Purchases made through Spend XP will appear here."
- **Interface contract:** see Step 4.2.1 below — frontend-design must respect the props/emits there.

Produce a design artifact (the skill's output) before moving to 4.2.

### Task 4.2: Implement XpLogDialog.vue against the design

**Files:**
- Create: `src/lib/xp/XpLogDialog.vue`

- [ ] **Step 4.2.1: Define the component interface**

```
Props:
  modelValue        Boolean              // open/closed (v-model)
  log               Array<LogEntry>      // chronological (oldest first); reverse for display
  handlers          Object               // { [type]: { label, record, undo } }
  remainingXp       Number               // current xp total, for the header

Emits:
  update:modelValue (bool)               // close-on-cancel
  undo              (entry: LogEntry)    // parent applies handlers[type].undo + xp += cost + removes the entry
  note-edit         ({ id, note })       // parent finds entry by id and replaces note in local reactive state
```

The dialog does **not** call the registry's `undo` itself, and does **not** mutate the `log` array. It emits intent; the parent mutates and persists.

- [ ] **Step 4.2.2: Author the component**

Implement against the frontend-design output. Key behavioral details:

1. Header reads `"XP Log — {{ remainingXp }} XP Remaining"` (mirrors `spendXp.vue`'s pattern).
2. Render `[...log].reverse()` so newest is on top.
3. For each row: `handlers[entry.type]?.label(entry)` for the main line. Defensive `?.` — if a row's type is unknown (legacy data, future versioning), render `entry.type` literally and skip undo.
4. The top row shows an `Undo` button. Clicking opens a Quasar `$q.dialog({...})` confirm (the imperative API, accessed inside the component via `useQuasar()` → `$q.dialog`): title `Undo this purchase?`, body `${handlers[entry.type].label(entry)} — you'll get ${entry.cost} XP back.` when `entry.cost > 0`, or `${label} — you'll re-spend ${-entry.cost} XP.` when `entry.cost < 0`. On `ok`, emit `undo(entry)`.
5. The note input is a Quasar `q-input` `dense` `borderless` `:debounce="300"` (native debounce — avoids a lodash import) with `@blur` emitting `note-edit({ id: entry.id, note: newValue })`. Pre-fill `:model-value="entry.note ?? ''"`.
6. Empty state: when `log.length === 0`, render the empty-state copy in place of the list.

- [ ] **Step 4.2.3: Manual smoke**

Add a temporary import + `<XpLogDialog>` instance to one of the existing edit pages (e.g. `edit-vampire-5e.vue`) with stub data:

```js
const stubLog = [
  { id: "1", ts: "2026-05-15T18:42:11Z", cost: 6, balanceAfter: 27, note: "", type: "smoke", payload: {} },
];
```

Stub `handlers = { smoke: { label: (e) => `Smoke entry (${e.cost} XP)` } }`. Wire a temporary parent-side handler:

```js
function onUndoSmoke(entry)   { console.log("UNDO EMITTED", entry); }
function onNoteEditSmoke(payload) { console.log("NOTE EDIT EMITTED", payload); }
```

Verify (with the browser console open):
- Dialog opens, renders the row.
- Undo button appears only on the top row; clicking it opens the confirm; confirming logs `UNDO EMITTED` with the full entry object.
- Editing the note input and blurring logs `NOTE EDIT EMITTED { id, note }`.
- Empty state renders when `log = []`.

**Revert the stub (and the two console handlers) before committing.** The dialog ships with no temporary scaffolding in the parent.

- [ ] **Step 4.2.4: Commit**

```bash
git add src/lib/xp/XpLogDialog.vue
git commit -m "Add shared XpLogDialog component (newest-first, LIFO undo, editable notes)"
```

---

**Chunk 4 done.** The dialog exists, satisfies the interface contract, and visually fits the project. It still has no per-line wiring — that's Chunk 5.

---

## Chunk 5: Per-game-line integration

Same recipe applied three times — VtM, Werewolf, Hunter. Read the recipe first; the per-line tasks (5.2, 5.3, 5.4) substitute file paths and handler imports.

### The recipe (read once, apply to each line)

For a given game line with handler module `H` (e.g. `../../lib/xp/handlers/vtm.js`), `spendXp.vue` at `S`, and `edit-*.vue` at `E`:

**1. In `S` (the spendXp dialog):**

- Import the handler registry and the helper: `import handlers from "<H>"; import { appendEntry } from "../../lib/xp/xpLog.js";` (adjust relative path per file location).
- In each branch of the `purchaseMade()` switch where a purchase succeeds, *after* the existing state mutation (`this.disciplines[name]++`, push, etc.) and *before* `this.localXP -= this.cost`:
  - Compute the entry: `const partial = handlers[<type>].record(this, <input>);`
    - `<type>` is the snake_case type from the handler registry, mapped from the existing switch case label (e.g. `"Clan Discipline"` → `"clan_discipline"`).
    - `<input>` is whatever the existing branch already has on hand (e.g. for clan discipline: `{ discipline: this.clanDiscInput, power: this.disciplinePower }`).
  - Append it to the dialog's local log: `this.localLog = appendEntry(this.localLog, partial, this.localXP);`
  - For array-pushing types (specialty, discipline, ritual, ceremony), the existing push must include `entryId: partial.payload.entryId` so undo can find the item later. Add that field to the push.
- Add `localLog` to the component's reactive state, seeded from `props.info.xp_log` (`localLog: ref(props.info.xp_log ?? [])`).
- Add `localLog` to the `onOKClick` payload so it flows back to the parent.

**2. In `E` (the edit page):**

- Import `handlers from "<H>"`, `XpLogDialog from "../../lib/xp/XpLogDialog.vue"`, and `{ appendEntry, undoLast } from "../../lib/xp/xpLog.js"`.
- Add `xp_log` to the reactive state, seeded from `this.kindred.xp_log ?? []` (or the line-equivalent: `garou`, `hunter`).
- Pass `xp_log` into the `spendXp` dialog props: `xp_log: this.xp_log`.
- In the `spendXp` callback that receives `data`, replace `this.xp_log` with `data.xp_log` (which the dialog returns alongside xp, attributes, etc.).
- Convert the existing `±3xp` button handlers (the buttons whose tooltips say `Add an advantage point (-3xp)` / `Remove an advantage point (+3xp)` and the matching pair for flaws):
  - Sign convention: **adding a point costs 3 XP** (the player spends), **removing a point refunds 3 XP**. The handler's `cost` follows the spec's "positive = spent, negative = refunded" rule, so `record` returns `cost: +3` for an add and `cost: -3` for a remove.
  - Before the existing `this.xp -= 3` / `this.xp += 3` math, call:
    - **Add an advantage point** (the `-3 XP` button — spends 3 XP, gains a point): `this.xp_log = appendEntry(this.xp_log, handlers.advantage_point.record(this, { delta: +1 }), this.xp);` — handler returns `cost: +3`.
    - **Remove an advantage point** (the `+3 XP` button — refunds 3 XP, loses a point): `this.xp_log = appendEntry(this.xp_log, handlers.advantage_point.record(this, { delta: -1 }), this.xp);` — handler returns `cost: -3`.
    - Mirror exactly for `flaw_point`.
  - The existing `this.xp ± 3` math is left in place; `appendEntry` only records.
- Add a new `q-item` to the action list immediately below the existing "Spend XP" item:

  ```vue
  <q-item clickable @click="xpLogOpen = true" :disable="!skillsDone || !attributesDone || !disciplinesDone">
    <q-item-section avatar><q-icon color="secondary" name="history" /></q-item-section>
    <q-item-section>
      <q-item-label>XP Log</q-item-label>
      <q-item-label caption class="text-white">Review and undo recent XP transactions</q-item-label>
    </q-item-section>
  </q-item>
  ```

  (For Werewolf/Hunter, use the equivalent gating conditions that already apply to that line's "Spend XP" item.)

- Mount the dialog as a sibling element in the edit page's template (mirroring how `manageDisciplineFlaw` is wired today):

  ```vue
  <XpLogDialog
    v-model="xpLogOpen"
    :log="xp_log"
    :handlers="handlers"
    :remaining-xp="xp"
    @undo="onUndo"
    @note-edit="onNoteEdit"
  />
  ```

  Add `xpLogOpen = ref(false)` (Composition setup) or `xpLogOpen: false` (Options API `data()`) to the component's reactive state, matching whichever style the existing edit page uses.

- Add the two emit handlers (Options API form; convert to Composition if the page uses it):

  ```js
  onUndo(entry) {
    const { log: next } = undoLast(this.xp_log);
    handlers[entry.type].undo(this, entry);
    this.xp += entry.cost;
    this.xp_log = next;
  },
  onNoteEdit({ id, note }) {
    this.xp_log = this.xp_log.map((e) => (e.id === id ? { ...e, note } : e));
  },
  ```

  Do **not** invoke the dialog via the imperative `$q.dialog({ component: ... })` plugin — that contradicts the v-model-based emit contract Chunk 4 defines for the component.

- **Do not** wire any logging into the existing "Set XP" input. Per spec it is intentionally out of scope (it represents an out-of-band ST grant, not a purchase). Leave that input untouched.

- Update the axios save body (both the create and edit calls) to include `xp_log: this.xp_log` alongside the existing `xp: this.xp` field. There are typically 2–4 axios calls in each edit page; grep for `xp:` to find them and add the sibling field in each.

**3. Manual smoke for the line:**

- Run the dev stack (`quasar dev` + `npm run devStart`).
- Open an existing character in the editor.
- Spend XP via the dialog on at least three different categories. After saving, the log persists across reload.
- Open the XP Log dialog. Undo the top entry. Confirm: XP refunds, the touched character field returns to its prior value, the entry disappears.
- Trigger a refund event (Remove an advantage point). Open the log — a `cost: -3` entry appears. Undo it — XP drops by 3 and the advantage_remaining counter goes back up.
- Edit a note. Save the character. Reload. The note persists.

### Task 5.1: VtM integration

**Files:**
- Modify: `src/components/character_creator/vtm/spendXp.vue`
- Modify: `src/components/character_creator/vtm/edit-vampire-5e.vue`

Apply the recipe with:

- `H` = `src/lib/xp/handlers/vtm.js`
- `S` = [src/components/character_creator/vtm/spendXp.vue](../../src/components/character_creator/vtm/spendXp.vue) — `purchaseMade()` switch starts at line 446.
- `E` = [src/components/character_creator/vtm/edit-vampire-5e.vue](../../src/components/character_creator/vtm/edit-vampire-5e.vue) — `spendXp` method at line 1167, `±3xp` button handlers near line 1280–1330, character-load axios call around line 882, character-save axios calls around lines 920, 971, 1074, 1122, 1192.

VtM-specific notes:

- **Label → type mapping** (from the existing `purchaseMade()` switch in `spendXp.vue`):

  | spendXp switch label | Registry type |
  |---|---|
  | `"Advantage"` | `advantage_point` (with `delta: +1`) |
  | `"Attributes"` | `attribute_raise` |
  | `"Blood Potency"` | `blood_potency` |
  | `"Blood Sorcery Ritual"` | `blood_ritual` |
  | `"Caitiff Discipline"` | `caitiff_discipline` |
  | `"Clan Discipline"` | `clan_discipline` |
  | `"Flaw"` | `flaw_point` (with `delta: +1`) |
  | `"Oblivion Ceremony"` | `oblivion_ceremony` |
  | `"Out of Clan Discipline"` | `out_of_clan_discipline` |
  | `"Skills"` | `skill_raise` |
  | `"Specialty"` | `specialty` |

  `Thin-Blood Alchemy` is an empty branch in the current switch — skip it. The two `±3xp` button handlers in the edit page map to `advantage_point` / `flaw_point` with `delta: -1` (the "Remove" buttons).

- The dialog already does `disciplineSkillsObj.push({ discipline, skill })`; extend each such push with the `entryId` from the registered entry.
- Advantage/flaw `±3xp` are wired to buttons in the edit page's clan/coterie card header.

Steps:

- [ ] **Step 5.1.1: Read both files end-to-end and map every existing purchase branch to its registry type.** Make a list (in your head or scratch file). Do not start editing until the mapping is complete.

- [ ] **Step 5.1.2: Apply the recipe to `spendXp.vue`.** One purchase branch at a time, in switch order. After each branch, save and reload the page; the dialog should still work for that category (the log just isn't surfaced yet).

- [ ] **Step 5.1.3: Apply the recipe to `edit-vampire-5e.vue`** — load/save axios bodies, ±3xp button handlers, new "XP Log" menu item, `<XpLogDialog>` mount, `onUndo` / `onNoteEdit` handlers.

- [ ] **Step 5.1.4: Run the manual smoke for VtM.** Use the checklist under "Manual smoke for the line" above.

- [ ] **Step 5.1.5: Commit**

```bash
git add src/components/character_creator/vtm/spendXp.vue \
        src/components/character_creator/vtm/edit-vampire-5e.vue
git commit -m "VtM: record XP transactions and surface the XP Log dialog"
```

### Task 5.2: Werewolf integration

**Files:**
- Modify: `src/components/character_creator/werewolf/spendXp.vue`
- Modify: `src/components/character_creator/werewolf/edit-garou-5e.vue`

Apply the recipe with:

- `H` = `src/lib/xp/handlers/werewolf.js`
- `S` = [src/components/character_creator/werewolf/spendXp.vue](../../src/components/character_creator/werewolf/spendXp.vue)
- `E` = [src/components/character_creator/werewolf/edit-garou-5e.vue](../../src/components/character_creator/werewolf/edit-garou-5e.vue)

Werewolf-specific notes:

- The Garou model has both `xp` and `spent_xp`. If any purchase branch in `werewolf/spendXp.vue` increments `spent_xp` (or any equivalent), the corresponding handler entry's `undo` (already covered in Chunk 3 Task 3.4) must reverse that — and the recipe's axios-body update must include `spent_xp` if the existing code persists it. Grep for `spent_xp` in the edit page to confirm.
- All other notes from VtM apply.

Steps:

- [ ] **Step 5.2.1: Produce the label→type mapping and the axios-save-site list as written artifacts before editing.** Reuse the type enumeration from Chunk 3 Task 3.4. Grep `edit-garou-5e.vue` for `xp:` and `xp,` to surface every place a save body is built — there are typically 2–4 such sites. Note them inline at the top of the file or in a scratch note.
- [ ] **Step 5.2.2: Apply the recipe to `werewolf/spendXp.vue`.**
- [ ] **Step 5.2.3: Apply the recipe to `edit-garou-5e.vue`.** Make sure every axios-save site you listed in 5.2.1 now includes `xp_log: this.xp_log`. If the file also persists `spent_xp`, propagate it the same way (the column is already in the model).
- [ ] **Step 5.2.4: Run the manual smoke for Werewolf.**
- [ ] **Step 5.2.5: Commit**

```bash
git add src/components/character_creator/werewolf/spendXp.vue \
        src/components/character_creator/werewolf/edit-garou-5e.vue
git commit -m "Werewolf: record XP transactions and surface the XP Log dialog"
```

### Task 5.3: Hunter integration

**Files:**
- Modify: `src/components/character_creator/hunter/spendXp.vue`
- Modify: `src/components/character_creator/hunter/edit-hunter-5e.vue`

Apply the recipe with:

- `H` = `src/lib/xp/handlers/hunter.js`
- `S` = [src/components/character_creator/hunter/spendXp.vue](../../src/components/character_creator/hunter/spendXp.vue)
- `E` = [src/components/character_creator/hunter/edit-hunter-5e.vue](../../src/components/character_creator/hunter/edit-hunter-5e.vue) — `±3xp` buttons at lines 57–80.

Hunter-specific notes: Hunter's categories include Edges and Perks (instead of Disciplines). The handler types from Chunk 3 Task 3.5 already cover these.

Steps:

- [ ] **Step 5.3.1: Produce the label→type mapping and the axios-save-site list as written artifacts before editing.** Reuse the type enumeration from Chunk 3 Task 3.5. Grep `edit-hunter-5e.vue` for `xp:` and `xp,` to surface every save site.
- [ ] **Step 5.3.2: Apply the recipe to `hunter/spendXp.vue`.**
- [ ] **Step 5.3.3: Apply the recipe to `edit-hunter-5e.vue`.** Make sure every axios-save site you listed in 5.3.1 now includes `xp_log: this.xp_log`.
- [ ] **Step 5.3.4: Run the manual smoke for Hunter.**
- [ ] **Step 5.3.5: Commit**

```bash
git add src/components/character_creator/hunter/spendXp.vue \
        src/components/character_creator/hunter/edit-hunter-5e.vue
git commit -m "Hunter: record XP transactions and surface the XP Log dialog"
```

### Task 5.4: Cross-line consistency check

- [ ] **Step 5.4.1: Run the full unit test suite one more time**

```bash
npm run test:unit
```

Expected: PASS, no `.todo`.

- [ ] **Step 5.4.2: Spot-check each of the three edit pages**

For each of `edit-vampire-5e.vue`, `edit-garou-5e.vue`, `edit-hunter-5e.vue`, confirm:

- An "XP Log" item appears in the side action list.
- The Spend XP flow records entries; the log dialog shows them; LIFO undo works.
- Reload after save preserves the log; the round-trip through the API works.
- Manual XP edits via the "Set XP" input do not produce log entries (per spec, those are explicitly out of scope).

---

**Chunk 5 done.** All three game lines now record purchases, surface the log, and support LIFO undo.
