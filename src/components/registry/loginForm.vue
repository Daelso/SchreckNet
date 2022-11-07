<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="onSubmit" @reset="resetRedirect" class="q-gutter-md">
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

      <q-input
        filled
        bg-color="white"
        v-model="password"
        type="password"
        label="Your password *"
      />

      <div>
        <q-btn label="Log in" type="submit" color="primary" />
        <q-btn
          label="Reset Password"
          type="reset"
          color="secondary"
          flat
          class="q-ml-sm"
        />
      </div>
      <q-btn
        label="Create an account"
        @click="this.registerRedirect()"
        color="secondary"
        flat
        class="q-ml-sm"
      />
    </q-form>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const $q = useQuasar();
    const axios = require("axios");
    const email = ref(null);
    const password = ref(null);
    const router = useRouter();
    let loginAttempt = 0;

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    return {
      email,
      password,

      onSubmit() {
        let loginInfo = {
          email: email.value,
          password: password.value,
        };
        axios
          .post(baseUrl + "/user/login", loginInfo, {
            withCredentials: true,
          })
          .then(() =>
            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Logged in, welcome back!",
            })
          )
          .then(() => {
            if (window.location.href.includes("localhost")) {
              window.location.replace("http://localhost:8080");
            } else {
              window.location.replace(window.location.origin);
            }
          })
          .catch(() => {
            loginAttempt++;
            if (loginAttempt <= 5) {
              $q.notify({
                color: "red-5",
                textColor: "white",
                icon: "warning",
                message: `Incorrect email or password! Login attempt ${loginAttempt}/5`,
              });
            } else {
              $q.notify({
                color: "red-5",
                textColor: "white",
                icon: "warning",
                message: `Login attempts exceeded, please try again in fifteen minutes. Try resetting your password if you continue to fail to login.`,
              });
            }
          });
      },
    };
  },
  data() {
    const router = useRouter();
    return {
      resetRedirect() {
        router.push({ name: "passwordForgot" });
      },
      registerRedirect() {
        router.push({ name: "register" });
      },
    };
  },
};
</script>
