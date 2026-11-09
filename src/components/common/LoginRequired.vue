<template>
  <div class="load-state">
    <q-icon name="lock_outline" size="28px" color="secondary" />
    <div class="load-state__message">{{ message }}</div>
    <div class="load-state__links">
      <q-btn
        unelevated
        no-caps
        color="secondary"
        icon="login"
        label="Log In"
        to="/login"
      />
      <router-link to="/register">Register</router-link>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

// Shown in place of account-only content when nobody is logged in.
export default defineComponent({
  name: "LoginRequired",
  props: {
    message: { type: String, default: "Log in to see this page." },
  },
});
</script>
