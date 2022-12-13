<template>
  <q-card
    v-for="vamp in this.kindred"
    :key="vamp"
    class="my-card"
    flat
    bordered
  >
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <q-icon color="secondary" name="app:ankh" style="scale: 180%" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ vamp.charName }}</q-item-label>
        <q-item-label style="color: white" caption>
          {{ vamp.clan }} ({{ vamp.sect }}) - {{ vamp.predator_type }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator />

    <q-card-section horizontal>
      <q-card-section>
        {{ lorem }}
      </q-card-section>

      <q-separator vertical />

      <q-card-section class="col-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </q-card-section>
    </q-card-section>
    <q-separator />
    <q-card-actions>
      <q-btn
        style="margin: auto"
        flat
        color="white"
        @click="
          this.router.push({ name: 'vampire5eView', params: { id: vamp.id } })
        "
      >
        View Character
      </q-btn>
    </q-card-actions>
  </q-card>
</template>
<style scoped>
.my-card {
  width: 100%;
  max-width: 350px;
  margin-right: 15px;
  color: white;
  background-color: #222831;
}

@media (max-width: 800px) {
  .my-card {
    margin-bottom: 15px;
  }
}
</style>
<script>
import { useRouter } from "vue-router";

export default {
  async setup() {
    const router = useRouter();

    const axios = require("axios");
    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    let kindred = await axios
      .get(baseUrl + "/vampires/card", {
        withCredentials: true,
      })
      .then((resp) => {
        return resp.data;
      })
      .catch((err) => {
        console.log(err);
        return "Not found!";
      });

    console.log(kindred);

    return {
      kindred,
      router,
      lorem:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    };
  },
};
</script>
