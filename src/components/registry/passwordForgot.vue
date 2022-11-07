<template>
  <div class="q-pa-md" style="max-width: 400px">
    <div style="margin-bottom: 20px">
      Enter your email below to reset your password. You will receive an email
      with a link that must be used within 30 minutes to recover your account.
    </div>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input
        filled
        bg-color="white"
        v-model="email"
        type="email"
        label="Your email *"
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

      <div class="q-pa-md">
        <q-btn
          label="Recover Account"
          type="submit"
          color="primary"
          icon="mail"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";

export default {
  setup() {
    const $q = useQuasar();
    const axios = require("axios");
    const email = ref(null);
    const password = ref(null);
    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    return {
      email,

      onSubmit() {
        let loginInfo = {
          email: email.value,
        };
        axios
          .post(baseUrl + "/user/passwordForgot", loginInfo, {
            withCredentials: true,
          })
          .then(() =>
            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Recovery email sent!",
            })
          )
          .catch(() =>
            $q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: "Email not found!",
            })
          );
      },
    };
  },
};
</script>
