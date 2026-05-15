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

// Structural validity gate for `onUndo` callers.  A corrupted entry (hostile
// or hand-edited xp_log) must not be partially undone — refunding cost while
// skipping the counter, or vice versa, leaves character state inconsistent.
// Callers should check this BEFORE popping the log, refunding XP, or invoking
// the type handler.
const DELTA_BEARING_TYPES = new Set(["advantage", "flaw"]);
export function isValidEntry(entry) {
  if (!entry || typeof entry !== "object") return false;
  if (!Number.isFinite(entry.cost)) return false;
  if (DELTA_BEARING_TYPES.has(entry.type)) {
    if (!Number.isFinite(Number(entry.payload?.delta))) return false;
  }
  return true;
}

export function undoLast(log) {
  if (log.length === 0) {
    return { log: [], entry: null };
  }
  const next = log.slice(0, -1);
  const entry = log[log.length - 1];
  return { log: next, entry };
}
