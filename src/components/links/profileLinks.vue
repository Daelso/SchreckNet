<template>
  <q-item
    clickable
    style="color: red"
    :to="{ name: 'myVamps', params: { id: this.currentUser.id } }"
  >
    <q-item-section avatar>
      <q-icon color="secondary" name="app:ankh" style="scale: 180%" />
    </q-item-section>

    <q-item-section>
      <q-item-label>My VtM Characters</q-item-label>
      <q-item-label caption style="color: white"
        >View your created Kindred</q-item-label
      >
    </q-item-section>
  </q-item>
  <q-separator />
  <q-item
    clickable
    style="color: red"
    :to="{ name: 'myGarou', params: { id: this.currentUser.id } }"
  >
    <q-item-section avatar>
      <q-icon color="secondary" name="app:claws" style="scale: 125%" />
    </q-item-section>

    <q-item-section>
      <q-item-label>My WtA Characters</q-item-label>
      <q-item-label caption style="color: white"
        >View your created Garou</q-item-label
      >
    </q-item-section>
  </q-item>
  <q-separator />
  <q-item
    clickable
    style="color: red"
    :to="{ name: 'myHunts', params: { id: this.currentUser.id } }"
  >
    <q-item-section avatar>
      <q-icon color="secondary" name="app:hunter" style="scale: 150%" />
    </q-item-section>

    <q-item-section>
      <q-item-label>My HtR Characters</q-item-label>
      <q-item-label caption style="color: white"
        >View your created Hunters</q-item-label
      >
    </q-item-section>
  </q-item>
  <q-separator />

  <q-item clickable style="color: red" :to="{ name: 'myFavs' }">
    <q-item-section avatar>
      <q-icon color="secondary" name="favorite" />
    </q-item-section>

    <q-item-section>
      <q-item-label>My Favorited Characters</q-item-label>
      <q-item-label caption style="color: white"
        >View your favorited characters</q-item-label
      >
    </q-item-section>
  </q-item>
  <q-separator />
  <q-item clickable style="color: red" :to="{ name: 'myGames' }">
    <q-item-section avatar>
      <q-icon color="secondary" name="groups" />
    </q-item-section>

    <q-item-section>
      <q-item-label>My Games</q-item-label>
      <q-item-label caption style="color: white"
        >Games Created by You</q-item-label
      >
    </q-item-section>
  </q-item>
  <q-separator />
  <q-item clickable style="color: red" @click="logout">
    <q-item-section avatar>
      <q-icon color="secondary" name="logout" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Logout</q-item-label>
      <q-item-label caption style="color: white"
        >Stay safe, Kindred.</q-item-label
      >
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { ref } from "vue";

export default defineComponent({
  name: "EssentialLink",
  async setup() {
    const $q = useQuasar();

    const axios = require("axios");
    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    let currentUser = ref(null);

    currentUser.value = await axios
      .get(baseUrl + "/user/currentUser", {
        withCredentials: true,
      })
      .then((resp) => {
        return resp.data;
      });

    return {
      currentUser,
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
