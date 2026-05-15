<template>
  <q-dialog v-model="isOpen" persistent>
    <q-layout view="Lhh lpR fff" container>
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title class="banner xp-log-title">XP Log</q-toolbar-title>
          <q-chip class="balance-chip" square>
            <span class="balance-num">{{ remainingXp }}</span>
            <span class="balance-label">XP Remaining</span>
          </q-chip>
          <q-btn flat dense round icon="close" @click="isOpen = false" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding class="bg-dark xp-log-body">
          <div v-if="log.length === 0" class="empty-state">
            <q-icon name="event_note" size="56px" class="empty-icon" />
            <p class="empty-title">No XP transactions logged yet.</p>
            <p class="empty-subtitle">
              Purchases made through Spend XP will appear here.
            </p>
          </div>

          <div v-else class="timeline">
            <div
              v-for="(entry, index) in displayedEntries"
              :key="entry.id"
              class="timeline-entry"
            >
              <div class="timeline-rail">
                <div
                  class="timeline-node"
                  :class="{ 'is-top': index === 0 }"
                />
                <div
                  v-if="index < displayedEntries.length - 1"
                  class="timeline-line"
                />
              </div>

              <div class="entry-card" :class="{ 'is-top': index === 0 }">
                <div class="entry-header">
                  <span class="entry-timestamp">
                    {{ formatTimestamp(entry.ts) }}
                  </span>
                  <q-btn
                    v-if="index === 0"
                    class="undo-btn"
                    label="Undo"
                    icon="undo"
                    no-caps
                    @click="confirmUndo(entry)"
                  />
                </div>

                <div class="entry-title">{{ labelFor(entry) }}</div>

                <div class="entry-meta">
                  <span class="entry-cost" :class="{ refund: entry.cost < 0 }">
                    {{
                      entry.cost >= 0
                        ? `Cost: ${entry.cost} XP`
                        : `Refund: ${-entry.cost} XP`
                    }}
                  </span>
                  <span class="entry-balance">
                    Balance after: {{ entry.balanceAfter }}
                  </span>
                </div>

                <q-input
                  :model-value="entry.note ?? ''"
                  @update:model-value="onNoteInput(entry.id, $event)"
                  dense
                  borderless
                  :debounce="300"
                  placeholder="Add a note…"
                  class="entry-note"
                />
              </div>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
import { useQuasar } from "quasar";

export default {
  name: "XpLogDialog",
  props: {
    modelValue: { type: Boolean, required: true },
    log: { type: Array, required: true },
    handlers: { type: Object, required: true },
    remainingXp: { type: Number, required: true },
  },
  emits: ["update:modelValue", "undo", "note-edit"],
  setup() {
    return { $q: useQuasar() };
  },
  computed: {
    isOpen: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
    displayedEntries() {
      return [...this.log].reverse();
    },
  },
  methods: {
    labelFor(entry) {
      const handler = this.handlers[entry.type];
      return handler?.label ? handler.label(entry) : entry.type;
    },
    formatTimestamp(ts) {
      const date = new Date(ts);
      return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    confirmUndo(entry) {
      const label = this.labelFor(entry);
      const xpTail =
        entry.cost >= 0
          ? `you'll get ${entry.cost} XP back`
          : `you'll re-spend ${-entry.cost} XP`;
      const handler = this.handlers[entry.type];
      const effect = handler?.undoEffect ? handler.undoEffect(entry) : null;
      const message = effect
        ? `${label} — ${xpTail}, and ${effect}.`
        : `${label} — ${xpTail}.`;
      this.$q
        .dialog({
          title: "Undo this purchase?",
          message,
          ok: { label: "Undo", color: "secondary", unelevated: true },
          cancel: { flat: true, color: "white" },
          persistent: true,
          class: "xp-log-confirm",
        })
        .onOk(() => {
          this.$emit("undo", entry);
        });
    },
    onNoteInput(id, note) {
      this.$emit("note-edit", { id, note });
    },
  },
};
</script>

<style lang="scss" scoped>
.xp-log-title {
  font-family: TMUnicorn;
  font-size: 1.7em;
  text-shadow: 3px 2px 3px black;
  letter-spacing: 0.04em;
}

.balance-chip {
  background: rgba(227, 28, 37, 0.12);
  border: 1px solid #e31c25;
  color: white;
  font-weight: 600;
  margin-right: 8px;
  padding: 4px 12px;
  border-radius: 2px;

  .balance-num {
    font-family: TMUnicorn;
    color: #e31c25;
    font-size: 1.4em;
    margin-right: 6px;
    text-shadow: 1px 1px 2px black;
  }

  .balance-label {
    text-transform: uppercase;
    font-size: 0.7em;
    letter-spacing: 0.12em;
    opacity: 0.85;
  }
}

.xp-log-body {
  min-height: 320px;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
  opacity: 0.85;

  .empty-icon {
    color: #e31c25;
    opacity: 0.45;
    margin-bottom: 18px;
  }

  .empty-title {
    font-family: TMUnicorn;
    font-size: 1.5em;
    margin-bottom: 8px;
    text-shadow: 2px 1px 2px black;
    letter-spacing: 0.02em;
  }

  .empty-subtitle {
    font-size: 0.95em;
    color: rgba(255, 255, 255, 0.55);
    margin: 0;
    font-style: italic;
  }
}

.timeline {
  display: flex;
  flex-direction: column;
}

.timeline-entry {
  display: flex;
  align-items: stretch;
  gap: 14px;
}

.timeline-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 14px;
  flex-shrink: 0;
}

.timeline-node {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #e31c25;
  background: transparent;
  margin-top: 14px;
  flex-shrink: 0;
  transition: transform 0.3s ease;

  &.is-top {
    background: #e31c25;
    box-shadow: 0 0 12px rgba(227, 28, 37, 0.7);
    animation: xp-log-pulse 2.4s ease-in-out infinite;
  }
}

@keyframes xp-log-pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 8px rgba(227, 28, 37, 0.5);
  }
  50% {
    transform: scale(1.18);
    box-shadow: 0 0 16px rgba(227, 28, 37, 0.9);
  }
}

.timeline-line {
  flex: 1 1 auto;
  width: 2px;
  background: linear-gradient(
    180deg,
    rgba(227, 28, 37, 0.5),
    rgba(227, 28, 37, 0.15)
  );
  margin-top: 4px;
  min-height: 16px;
}

.entry-card {
  flex: 1 1 auto;
  background: #222831;
  border: 1px solid rgba(227, 28, 37, 0.2);
  border-left: 3px solid rgba(227, 28, 37, 0.35);
  padding: 12px 16px;
  margin-bottom: 14px;
  border-radius: 3px;
  transition: border-color 0.2s ease, box-shadow 0.25s ease;

  &.is-top {
    border-left-color: #e31c25;
    border-color: rgba(227, 28, 37, 0.45);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
  }
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  gap: 8px;
}

.entry-timestamp {
  font-family: monospace;
  font-size: 0.78em;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.02em;
}

.undo-btn {
  background: #e31c25;
  color: white;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.78em;
  padding: 2px 12px;
  border-radius: 3px;
  transition: transform 0.15s ease, background 0.15s ease;

  &:hover {
    background: #c0151c;
    transform: scale(1.05);
  }
}

.entry-title {
  font-size: 1.05em;
  font-weight: 600;
  margin-bottom: 6px;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.95);
}

.entry-meta {
  display: flex;
  gap: 18px;
  font-size: 0.88em;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.entry-cost {
  color: #e31c25;
  font-weight: 600;

  &.refund {
    color: #21ba45;
  }
}

.entry-balance {
  color: rgba(255, 255, 255, 0.65);
}

.entry-note {
  font-style: italic;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 2px;

  :deep(.q-field__native) {
    padding-top: 4px;
    padding-bottom: 4px;
    color: rgba(255, 255, 255, 0.85);
  }

  :deep(.q-field__native::placeholder) {
    color: rgba(255, 255, 255, 0.35);
    font-style: italic;
  }

  &:focus-within {
    :deep(.q-field__control) {
      box-shadow: inset 0 -2px 0 #e31c25;
    }
  }
}
</style>
