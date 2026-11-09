<template>
  <div class="load-state" role="alert">
    <q-icon name="error_outline" size="28px" color="secondary" />
    <div class="load-state__message">{{ message }}</div>
    <q-btn
      outline
      no-caps
      color="secondary"
      icon="refresh"
      label="Retry"
      :loading="loading"
      @click="$emit('retry')"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";

// Inline "this part didn't load" notice with a Retry button.
export default defineComponent({
  name: "LoadError",
  props: {
    message: {
      type: String,
      default: "That didn't load. Try again in a moment.",
    },
    loading: { type: Boolean, default: false },
  },
  emits: ["retry"],
});
</script>
