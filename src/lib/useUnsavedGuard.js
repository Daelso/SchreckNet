import {
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useQuasar } from "quasar";

// UI-only or static data keys that never represent unsaved character work.
const DEFAULT_IGNORE = [
  "attributeInfo",
  "debug",
  "handlers",
  "homebrewDialog",
  "humanityOptions",
  "nosImage",
  "saving",
  "skillInfo",
  "xpLogOpen",
  "zoomed",
];

function onBeforeUnload(event) {
  event.preventDefault();
  event.returnValue = "";
}

/**
 * Warns before leaving a character creator/editor with unsaved changes.
 *
 * Call from setup() before any `await` (route guards and lifecycle hooks
 * need the active component instance). Once the component is mounted, every
 * key in its Options-API `data()` (minus UI-only keys) is deep-watched; the
 * first change marks the form dirty. Edit pages load their character in
 * async setup, so data() is already populated by then and loading never
 * counts as a change.
 *
 * While dirty, a beforeunload prompt is armed and in-app navigation asks for
 * confirmation. Call `markSaved()` after a successful save, before
 * redirecting, so the redirect is not blocked.
 */
export function useUnsavedGuard({ ignore = [] } = {}) {
  const instance = getCurrentInstance();
  const $q = useQuasar();
  const unsavedChanges = ref(false);
  const skip = new Set([...DEFAULT_IGNORE, ...ignore]);
  let stops = [];
  let unmounted = false;

  function stopWatching() {
    stops.forEach((stop) => stop());
    stops = [];
  }

  function markDirty() {
    unsavedChanges.value = true;
    // One change is enough; no need to keep deep-watching.
    stopWatching();
  }

  function startWatching() {
    stopWatching();
    if (unmounted) return;
    const vm = instance.proxy;
    Object.keys(vm.$data)
      .filter((key) => !skip.has(key))
      .forEach((key) => {
        stops.push(vm.$watch(key, markDirty, { deep: true }));
      });
  }

  function markSaved() {
    unsavedChanges.value = false;
    nextTick(startWatching);
  }

  watch(unsavedChanges, (dirty) => {
    if (dirty) window.addEventListener("beforeunload", onBeforeUnload);
    else window.removeEventListener("beforeunload", onBeforeUnload);
  });

  onMounted(() => {
    // Let any mount-time writes from child components settle first.
    nextTick(startWatching);
  });

  onBeforeUnmount(() => {
    unmounted = true;
    stopWatching();
    window.removeEventListener("beforeunload", onBeforeUnload);
  });

  onBeforeRouteLeave(() => {
    if (!unsavedChanges.value) return true;
    return new Promise((resolve) => {
      $q.dialog({
        title: "Leave without saving?",
        message: "Your character hasn't been saved and will be lost.",
        ok: { label: "Leave", color: "secondary", unelevated: true },
        cancel: { label: "Stay", flat: true, color: "white" },
        focus: "cancel",
        persistent: true,
        dark: true,
      })
        .onOk(() => {
          unsavedChanges.value = false;
          resolve(true);
        })
        .onCancel(() => resolve(false));
    });
  });

  return { unsavedChanges, markSaved };
}
