<template>
  <div
    class="fullscreen bg-primary text-secondary text-center q-pa-md flex flex-center"
  >
    <div class="not-found">
      <div class="not-found__code">404</div>

      <div class="not-found__message">You've taken a wrong turn...</div>

      <q-btn
        class="q-mt-xl"
        color="secondary"
        text-color="primary"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<style scoped>
.not-found {
  max-width: 100%;
}
.not-found__code {
  font-size: clamp(6rem, 30vh, 38vw);
  line-height: 1;
}
.not-found__message {
  /* text-h2 sizing, scaled down to fit narrow phones */
  font-size: clamp(1.75rem, 7vw, 3.75rem);
  line-height: 1.2;
  overflow-wrap: break-word;
  /* muted red that stays readable on the primary background (4.7:1) */
  color: #e86a72;
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorNotFound",
});
</script>
