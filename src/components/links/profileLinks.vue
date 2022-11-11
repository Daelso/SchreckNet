<template>
  <q-item clickable style="color: red" @click="logout">
    <q-item-section avatar>
      <q-icon color="secondary" name="logout" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Logout</q-item-label>
      <q-item-label caption style="color: white">quasar.dev</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "EssentialLink",
  setup() {
    const $q = useQuasar();

    const axios = require("axios");
    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    return {
      async logout() {
        await axios
          .post(
            baseUrl + "/user/logout",
            {},
            {
              withCredentials: true,
            }
          )
          .then(() => {
            if (window.location.href.includes("localhost")) {
              window.location.replace("http://localhost:8080");
            } else {
              window.location.replace(window.location.origin);
            }
          })
          .catch(() => {
            $q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: `Failed to logout, please try again later.`,
            });
          });
      },
    };
  },
});
</script>
