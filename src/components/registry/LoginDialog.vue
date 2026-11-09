<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="login-dialog" dark>
      <q-form @submit="onSubmit" greedy>
        <q-card-section class="login-dialog__head">
          <h2 class="login-dialog__title" id="login-dialog-title">
            {{ title }}
          </h2>
          <p class="login-dialog__lede">{{ message }}</p>
        </q-card-section>

        <q-card-section class="login-dialog__fields">
          <q-input
            filled
            bg-color="white"
            v-model="email"
            type="email"
            label="Your email *"
            autocomplete="email"
            autofocus
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 6 && val.length <= 64) ||
                'Please enter a valid email address.',
              (val) =>
                (val &&
                  val.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) ||
                'Please enter a valid email address.',
            ]"
          />
          <q-input
            filled
            bg-color="white"
            v-model="password"
            type="password"
            label="Your password *"
            autocomplete="current-password"
            lazy-rules
            :rules="[(val) => !!val || 'Enter your password.']"
          />
        </q-card-section>

        <q-card-section
          v-if="error"
          class="login-dialog__error"
          role="alert"
          aria-live="assertive"
        >
          {{ error }}
        </q-card-section>

        <q-card-actions align="right" class="login-dialog__actions">
          <q-btn
            flat
            no-caps
            color="white"
            label="Cancel"
            :disable="submitting"
            @click="onDialogCancel"
          />
          <q-btn
            unelevated
            no-caps
            color="secondary"
            type="submit"
            :label="okLabel"
            :loading="submitting"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { useDialogPluginComponent } from "quasar";
import { api } from "boot/axios";
import { apiErrorMessage, apiStatus } from "src/lib/apiErrors";

// Shared across openings so the count matches the server's 5-per-15-minutes
// login limiter instead of restarting each time the dialog opens.
let loginAttempt = 0;

export default {
  props: {
    title: { type: String, default: "Log in to save" },
    message: {
      type: String,
      default:
        "Your session has expired. Log in and your changes will be saved. Everything you've entered is still here.",
    },
    okLabel: { type: String, default: "Log in and save" },
  },
  emits: [...useDialogPluginComponent.emits],
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    const email = ref("");
    const password = ref("");
    const error = ref("");
    const submitting = ref(false);

    async function onSubmit() {
      if (submitting.value) return;
      submitting.value = true;
      error.value = "";
      try {
        await api.post(
          "/user/login",
          { email: email.value, password: password.value },
          { withCredentials: true }
        );
        loginAttempt = 0;
        onDialogOK();
      } catch (err) {
        const status = apiStatus(err);
        if (status === 401) {
          loginAttempt++;
          error.value =
            loginAttempt <= 5
              ? `Incorrect email or password! Login attempt ${loginAttempt}/5`
              : "Login attempts exceeded, please try again in fifteen minutes. Try resetting your password if you continue to fail to login.";
        } else {
          error.value = apiErrorMessage(err);
        }
        password.value = "";
      } finally {
        submitting.value = false;
      }
    }

    return {
      dialogRef,
      onDialogHide,
      onDialogCancel,
      email,
      password,
      error,
      submitting,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.login-dialog {
  width: min(420px, calc(100vw - 32px));
  background: #171a1e;
  color: white;
  border-top: 3px solid #e31c25;
  border-radius: 4px;
  font-family: monospace;
}

.login-dialog__head {
  background: #222831;
  padding: 20px 24px 16px;
}

.login-dialog__title {
  margin: 0 0 8px;
  font-family: TMUnicorn;
  font-size: 1.9em;
  line-height: 1.1;
  font-weight: normal;
  letter-spacing: 0.02em;
  text-shadow: 3px 2px 3px black;
}

.login-dialog__lede {
  margin: 0;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.95em;
  line-height: 1.5;
  max-width: 36em;
}

.login-dialog__fields {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 20px 24px 0;
}

.login-dialog__error {
  margin: 4px 24px 0;
  padding: 10px 12px;
  border-left: 3px solid #e31c25;
  background: rgba(227, 28, 37, 0.12);
  color: #ffd7d9;
  font-size: 0.9em;
  line-height: 1.4;
}

.login-dialog__actions {
  padding: 16px 24px 20px;
  gap: 8px;
}
</style>
