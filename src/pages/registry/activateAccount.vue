<template>
  <q-page class="flex flex-center"> Activating your account... </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent } from "vue";
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

    const token = router.currentRoute._value.query.token;
    const username = router.currentRoute._value.query.username;

    const activateAccount = () => {
      axios
        .post(
          baseUrl + "/user/activateAccount/" + username + "/" + token,
          {},
          {
            withCredentials: true,
          }
        )
        .then(() =>
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Account successfully activated!",
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
              "Failed to activate account! User not found or invalid token!",
          })
        );
    };
    activateAccount();
  },
});
</script>
