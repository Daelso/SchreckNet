# XP Log and Undo — Design

**Date:** 2026-05-15
**Status:** Approved (brainstorm)
**Author:** brainstorm with user

## Goal

Give each character a persistent, human-readable log of XP transactions and let the player undo the most recent one. Cover all three game lines (VtM, Werewolf, Hunter) through a single shared module so future additions don't require duplicating dialogs or log utilities.

## Background

SchreckNet today persists only the **resulting state** of XP spends. The character has an integer `xp` column and the JSON columns it touches (`attributes`, `skills`, `disciplines`, `discipline_skills`, `specialties`, `advantages_remaining`, `flaws_remaining`). There is no record of *what* was bought, *when*, or *for how much*. Three places mutate XP today:

1. The per-game-line `spendXp.vue` dialog (the main category-driven purchase flow).
2. The `±3xp` advantage/flaw buttons on each `edit-*.vue` edit screen.
3. A free-form "Set XP" input on the edit screen, used to record ST grants.

Players who misclick, change their mind, or want to audit a character's progression currently have no recourse beyond manually undoing the resulting state edits.

## Scope

In scope:

- All three game lines (VtM, Werewolf, Hunter) in this first pass.
- Log of every `spendXp.vue` purchase and every `±3xp` advantage/flaw click.
- LIFO undo (only the most recent log entry can be reverted at a time).
- Forward-looking only — existing characters start with empty logs; no backfill.
- One-time set-up of `sequelize-cli` migrations infrastructure plus the migration that adds the new column.

Out of scope:

- Logging the "Set XP" manual input (out-of-band ST adjustment, not a purchase).
- Arbitrary undo / reorder of historical entries.
- Backfilling history for existing characters.
- Server-side validation of log contents (consistent with the project's existing client-trusting posture).
- A retroactive baseline migration for all existing tables. Migration tracking begins from this PR forward.

## Design decisions

| Decision | Choice | Rationale |
|---|---|---|
| Game lines covered | All 3 in v1 | User explicitly chose this and asked for a modular implementation |
| Undo model | Strict LIFO | Naturally respects prereqs; simple to reason about |
| What's logged | spendXp purchases + ±3xp buttons | "Set XP" excluded as out-of-band ST adjustment |
| UI placement | New "XP Log" menu item beside "Spend XP" | Keeps the spend dialog clean |
| Per-entry data | Basics + editable note + balance-after | Most useful for skimming and storytelling context |
| Storage | New `xp_log` JSON column per game-line table | Matches the existing project pattern (all complex data lives in JSON columns) |
| Entry representation | Typed entries with per-type record/undo handlers | Readable, debuggable, matches `spendXp.vue`'s existing switch shape |
| Migrations | Set up `sequelize-cli` + write the `xp_log` migration | Future schema changes go through migrations; existing implicit schema stays untouched |

## Data model

### Log entry envelope (uniform across game lines)

```js
{
  id: "uuid",              // stable Vue key; future-proofs for arbitrary undo
  ts: "2026-05-15T18:42:11Z",
  cost: 6,                 // signed: positive = spent, negative = refunded
  balanceAfter: 27,        // cached running balance after this entry
  note: "",                // optional, free text, post-hoc editable
  type: "discipline_purchase",
  payload: { /* type-specific */ }
}
```

### Per-game-line entry types (v1)

The exact list is read from each `spendXp.vue` during planning, but the v1 set is:

- **VtM** — `attribute_raise`, `skill_raise`, `specialty`, `clan_discipline`, `caitiff_discipline`, `out_of_clan_discipline`, `blood_potency`, `blood_ritual`, `oblivion_ceremony`, `advantage_point`, `flaw_point`.
- **Werewolf** — `attribute_raise`, `skill_raise`, `specialty`, `gift`, `rite`, plus any others enumerated in `werewolf/spendXp.vue` (e.g. renown). Final list confirmed in the implementation plan.
- **Hunter** — `attribute_raise`, `skill_raise`, `specialty`, `edge`, `perk`, plus any others in `hunter/spendXp.vue`. Final list confirmed in the implementation plan.

### Payload conventions

- For purchases that **raise a scalar** (attribute, skill, discipline level, blood potency): payload stores `{ field, priorValue, newValue }`. Undo restores `priorValue` by direct assignment — not by decrement — so any post-purchase manual edit results in the recorded prior value rather than something arbitrarily wrong.
- For purchases that **push into an array** (specialties, discipline skills, rituals, ceremonies): payload stores an `entryId` generated at purchase time and written onto the pushed item. Undo removes the item with that id rather than popping the array tail (which is unsafe if non-XP code also touched the array).
- For purchases that **increment a counter** (advantage/flaw remaining): payload stores `{ counter, priorValue }`. Undo restores the prior value.

### Cost sign convention

`cost` is signed: **positive = XP spent**, **negative = XP refunded**.

- Spend XP dialog purchases — `cost > 0`.
- "Add a flaw/advantage point" button — `cost: +3`.
- "Remove a flaw/advantage point" button — `cost: -3` (this is a refund event; it produces a log entry whose undo *re-adds* the point at cost +3).
- Recording an entry — applies `xp -= cost` (positive cost decreases the balance; negative cost increases it).
- Undoing an entry — removes the entry and applies `xp += cost`, the exact inverse. A positive cost refunds; a negative cost re-spends.

### Database

Add an `xp_log` column to each game-line model:

```js
xp_log: {
  type: Sequelize.JSON,
  allowNull: false,
  defaultValue: []
}
```

Tables affected: `vampires`, `hunters`, and the Werewolf table (exact name verified from [server/models/werewolf/](server/models/werewolf/) during planning).

## Module layout

```
src/lib/xp/
  xpLog.js              # shared pure helpers (no Vue, no game knowledge)
  XpLogDialog.vue       # shared dialog component
  handlers/
    vtm.js              # type → { label, record, undo }
    werewolf.js
    hunter.js
```

### `xpLog.js`

Pure functions:

- `appendEntry(log, partialEntry, currentXp) → updatedLog` — fills `id`, `ts`, `balanceAfter`.
- `undoLast(log) → { log, entry }` — pops the tail; caller applies the per-type undo.

### `handlers/<line>.js`

Each exports a registry keyed by entry `type`:

```js
export default {
  attribute_raise: {
    label: (entry) => `Raised ${entry.payload.attribute} to ${entry.payload.newValue}`,
    record: (charState, input) => ({ type: "attribute_raise", cost, payload: {...} }),
    undo:   (charState, entry) => { /* mutate charState back */ }
  },
  // ...
}
```

`record` is called from `spendXp.vue` and the `±3xp` button handlers immediately after a successful purchase. `undo` is called by `XpLogDialog` when the user confirms an undo.

### `XpLogDialog.vue`

Props: `log`, `handlers`, `initialXp`. Emits `undo(entry)` (parent applies the state mutation), `note-edit({ id, note })`, `update:modelValue`.

Game-line-agnostic. Renders rows using `handlers[entry.type].label(entry)`. The top entry is the only one with an "Undo" button.

### Per game line

Each `spendXp.vue` and `edit-*.vue` imports its game-line handler registry and wires it into the dialog. One registry, two consumers.

**Modularity benefit:** adding a fourth game line later requires (a) a new `handlers/<line>.js`, (b) the column + route field for that line, (c) two short wirings in that line's existing `spendXp.vue` and `edit-*.vue`. No copy-pasted dialog or log utility code.

## UI flow

### Entry point

In each `edit-*.vue` action list, add a `q-item` directly below "Spend XP":

```
[icon] XP Log
       Review and undo recent XP transactions
```

Visual treatment matches the existing list items: same dark theme, same `q-icon` colour scheme, same accessory text style.

### Dialog body

`q-dialog` matching the existing `bg-primary` header / `bg-dark` body style of `spendXp.vue`. Vertically-scrolling list of entries, **newest first**:

```
┌─ XP Log — 27 XP Remaining ──────────────────────┐
│  May 15, 2026 · 18:42                  [Undo]   │
│  Raised Dominate to 2 (Mesmerize)               │
│  Cost: 6 XP    Balance after: 27                │
│  [editable note ...]                            │
├─────────────────────────────────────────────────┤
│  May 14, 2026 · 21:10                           │
│  Specialty: Streetwise — Pickpocket             │
│  Cost: 3 XP    Balance after: 33                │
│  Session 4 reward                               │
└─────────────────────────────────────────────────┘
```

### Interactions

- **Undo** appears only on the top entry. Click → confirmation dialog whose body is rendered from `handlers[entry.type].label(entry)` ("Undo *Raised Dominate to 2 (Mesmerize)*? You'll get 6 XP back.") → on confirm, the entry pops, the registered `undo` handler mutates the character state, and `xp += entry.cost`. The newly-revealed top entry gains an Undo button on next render.
- **Note** is an inline editable text input per row. On blur, the new text is committed to **local reactive state** (no per-keystroke API calls, no separate save action). Notes persist to the server on the next character Save, like any other field. Editing a note does not require confirmation, does not touch XP, and is not itself undoable.
- **Empty state**: friendly message — "No XP transactions logged yet. Purchases made through Spend XP will appear here." No synthetic "starting balance" row is rendered in v1 — consistent with the "no backfill" stance, and `balanceAfter` is meaningful only relative to the XP total at the time each entry was recorded.
- **Persistence**: undo and note edits stage a change to local reactive state. They persist only when the user clicks the existing edit-screen Save button — same lifecycle as every other field on the character.

### Implementation note (binding)

When the implementation plan reaches the steps that author `XpLogDialog.vue` and the new menu item, the implementer **must invoke the `frontend-design` skill** before writing component code. This ensures the visual treatment matches SchreckNet's established aesthetic (dark theme, `bg-primary` headers, Quasar idioms in use today) rather than defaulting to generic styling. This is captured in user memory and should be carried into the implementation plan.

## Server changes

### Migrations infrastructure (one-time)

- Add `sequelize-cli` as a **devDependency**.
- New `.sequelizerc` at repo root pointing CLI at `server/`-relative paths:
  ```js
  const path = require("path");
  module.exports = {
    "config":          path.resolve("server/config", "config.js"),
    "models-path":     path.resolve("server", "models"),
    "migrations-path": path.resolve("server", "migrations"),
    "seeders-path":    path.resolve("server", "seeders"),
  };
  ```
- New file `server/config/config.js` exporting `{ development, production }` envs, reading from the same `process.env.DB_*` keys already used by [server/database.js](server/database.js).
- New empty directory `server/migrations/`.
- New `package.json` scripts:
  ```
  "db:migrate":       "sequelize-cli db:migrate",
  "db:migrate:undo":  "sequelize-cli db:migrate:undo",
  "migration:create": "sequelize-cli migration:generate --name"
  ```
- README note: schema changes are made via `npm run migration:create -- some-name`, edit the generated file, then `npm run db:migrate`.

`sequelize-cli` will create a `SequelizeMeta` table on first run and start tracking from this PR's migration. Existing tables are not touched.

### The `xp_log` migration

`server/migrations/<timestamp>-add-xp-log.js`:

- `up`: `addColumn` on each of `vampires`, `hunters`, and the Werewolf table — `xp_log` JSON, `allowNull: false`, `defaultValue: []`.
- `down`: `removeColumn` for each of the three.

### Model updates

Add `xp_log` to each of the three game-line Sequelize models with the same definition as above.

### API route updates

In [server/api/vampires.js](server/api/vampires.js), [server/api/hunters.js](server/api/hunters.js), and [server/api/garou.js](server/api/garou.js):

- Character-create (POST) handlers — accept and persist `req.body.xp_log` (default `[]`).
- Character-update (PUT/POST edit) handlers — accept and persist `req.body.xp_log`.
- Character-read (GET) handlers — already return the full row, so `xp_log` flows through naturally once the column exists.

### Frontend integration

- Each `edit-*.vue` adds `xp_log` to the reactive state initialized from the loaded character (defaulting to `[]` if absent for legacy characters).
- The character-save axios body includes `xp_log`.
- The view pages (`kindredView.vue`, `werewolfView.vue`, `hunterView.vue`) are unchanged — the log is owner-facing only and isn't surfaced in public views.

## Edge cases and limitations

- **Drift from manual edits.** Direct edits via the attributes/skills panels or via "Set XP" are not logged. The "restore to recorded prior value" approach (rather than `--`) keeps undo deterministic but can still overwrite a manual edit made after the original purchase. Documented in the dialog's help text: "Undo restores the character to the state recorded at purchase. Manual edits made afterwards may be reverted too."
- **Array-mutation safety.** Pushed items (specialties, discipline skills) carry a `entryId` matching the log entry, so undo always removes the correct item even if non-XP code also touched the array.
- **Legacy characters.** Load with no `xp_log` → frontend defaults to `[]`. Note in PR description.
- **Log size.** Realistically dozens to low hundreds of entries; comparable to existing JSON-column sizes in the project.
- **Concurrency.** Single-user single-tab edit assumption — same posture as every other character field today. No optimistic locking added.
- **Server-side validation.** Out of scope. The server already trusts the client for all character data; we don't introduce a new trust boundary here.

## Testing

The repo has no test suite (`npm test` is a stub). Verification is manual, captured in the PR description as a checklist that walks each entry type through: purchase via Spend XP → log entry appears → save character → reload → entry persists → undo → both `xp` and the touched character field revert. Plus the `±3xp` button paths and the note-edit path. The frontend-design skill invocation during component authoring substitutes for a UI test pass on visual quality.

## Open questions for the implementation plan

- Confirm the exact Werewolf table name (URL slug is `werewolf`, code says `garou`).
- Enumerate the full Werewolf and Hunter `spendXp.vue` switch cases to finalize their per-line type sets.
