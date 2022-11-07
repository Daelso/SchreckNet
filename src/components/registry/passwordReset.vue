<template>
  <div class="q-pa-md" style="max-width: 400px">
    <div style="margin-bottom: 20px">Enter a new password below</div>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input
        filled
        v-model="password"
        bg-color="white"
        type="password"
        label="Your new password *"
        hint="Never share this with anyone!"
        lazy-rules
        :rules="[
          (val) =>
            (val && val.length >= 8 && val.length <= 25) ||
            'We require between 8-25 characters.',
          (val) =>
            (val &&
              (val === this.passwordVerify || this.passwordVerify === null)) ||
            'Passwords do not match!',
        ]"
      />

      <q-input
        filled
        v-model="passwordVerify"
        type="password"
        bg-color="white"
        label="Type password again *"
        hint="Just making sure..."
        lazy-rules
        :rules="[
          (val) =>
            (val && val.length >= 8 && val.length <= 25) ||
            'We require between 8-25 characters.',
          (val) =>
            (val && (val === this.password || this.password === null)) ||
            'Passwords do not match!',
        ]"
      />

      <div>
        <q-btn label="Change Password" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<style>
.q-field__messages {
  color: white;
}
</style>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const $q = useQuasar();
    const axios = require("axios");
    const password = ref(null);
    const passwordVerify = ref(null);
    const router = useRouter();
    const userId = router.currentRoute._value.params.user;
    const token = router.currentRoute._value.query.token;

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    return {
      password,
      passwordVerify,

      onSubmit() {
        let loginInfo = {
          password: password.value,
        };
        axios
          .post(
            baseUrl + "/user/passwordReset/" + userId + "/" + token,
            loginInfo,
            {
              withCredentials: true,
            }
          )
          .then(() =>
            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Password reset!",
            })
          )
          .then(() => {
            router.push({ name: "login" });
          })
          .catch(() =>
            $q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message:
                "Failed to reset password! User not found or invalid token!",
            })
          );
      },
    };
  },
};
</script>
