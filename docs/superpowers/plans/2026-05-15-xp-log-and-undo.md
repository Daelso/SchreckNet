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
