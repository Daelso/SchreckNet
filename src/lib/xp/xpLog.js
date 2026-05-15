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
