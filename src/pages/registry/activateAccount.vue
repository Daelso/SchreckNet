<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 400px">
      <div style="margin-bottom: 20px">
        Enter the password you chose when you signed up to activate
        <strong>{{ username }}</strong
        >.
      </div>
      <q-form @submit="activateAccount" class="q-gutter-md">
        <q-input
          filled
          v-model="password"
          bg-color="white"
          type="password"
          label="Your password *"
          hint="If you didn't sign up, close this page."
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Enter your password.']"
        />
        <div>
          <q-btn
            label="Activate account"
            type="submit"
            color="primary"
            :loading="submitting"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<style>
.q-field__messages {
  color: white;
}
</style>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "accountActivation",
  setup() {
    const $q = useQuasar();
    const axios = require("axios");
    const router = useRouter();
    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    const token = router.currentRoute.value.query.token;
    const username = router.currentRoute.value.query.username;
    const password = ref("");
    const submitting = ref(false);

    // Asking for the password proves the person clicking the link is the one
    // who signed up, so nobody can register someone else's email and get them
    // to activate an account the sender controls.
    const activateAccount = () => {
      submitting.value = true;
      axios
        .post(
          baseUrl +
            "/user/activateAccount/" +
            encodeURIComponent(username) +
            "/" +
            encodeURIComponent(token),
          { password: password.value },
          { withCredentials: true }
        )
        .then(() => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Account activated!",
          });
          router.push({ name: "login" });
        })
        .catch((err) =>
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message:
              typeof err.response?.data === "string" &&
              err.response.status === 401
                ? err.response.data
                : "This activation link is invalid or has expired. Sign up again to get a new one.",
          })
        )
        .finally(() => {
          submitting.value = false;
        });
    };

    return { username, password, submitting, activateAccount };
  },
});
</script>
