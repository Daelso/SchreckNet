<template>
  <div class="searchContainer flex flex-center">
    <div class="q-pa-md">
      <q-select
        class="select"
        filled
        clearable
        bg-color="white"
        color="secondary"
        v-model="splatPick"
        @update:model-value="this.$emit('update:splat', this.splatPick)"
        :options="splatOptions"
        label="Select a Splat"
        popup-content-style="background-color:#222831; color:white"
      >
        <template v-slot:prepend>
          <q-icon name="chat_bubble" />
        </template>
      </q-select>

      <!-- VtM Only -->
      <q-select
        v-if="this.splatPick === 'Vampire: the Masquerade'"
        class="select"
        filled
        clearable
        color="secondary"
        bg-color="grey-3"
        v-model="clanPick"
        @update:model-value="this.$emit('update:clan', this.clanPick)"
        :options="clanOptions"
        label="Search by Clan"
        popup-content-style="background-color:#222831; color:white"
      />
      <q-select
        v-if="this.splatPick === 'Vampire: the Masquerade'"
        class="select"
        filled
        clearable
        color="secondary"
        bg-color="grey-3"
        v-model="predatorPick"
        @update:model-value="this.$emit('update:predator', this.predatorPick)"
        :options="predatorOptions"
        label="Search by Predator Type"
        popup-content-style="background-color:#222831; color:white"
      />

      <!-- Hunter only -->
      <q-select
        v-if="this.splatPick === 'Hunter: the Reckoning'"
        class="select"
        filled
        clearable
        color="secondary"
        bg-color="grey-3"
        v-model="drivePick"
        @update:model-value="this.$emit('update:drive', this.drivePick)"
        :options="driveOptions"
        option-label="name"
        label="Search by Drive"
        popup-content-style="background-color:#222831; color:white"
      />

      <q-select
        v-if="this.splatPick === 'Hunter: the Reckoning'"
        class="select"
        filled
        clearable
        color="secondary"
        bg-color="grey-3"
        v-model="creedPick"
        @update:model-value="this.$emit('update:creed', this.creedPick)"
        :options="creedOptions"
        option-label="name"
        label="Search by Creed"
        popup-content-style="background-color:#222831; color:white"
      />

      <!-- WtA Only -->
      <q-select
        v-if="this.splatPick === 'Werewolf: the Apocalypse'"
        class="select"
        filled
        clearable
        color="secondary"
        bg-color="grey-3"
        v-model="tribePick"
        @update:model-value="this.$emit('update:tribe', this.tribePick)"
        :options="tribeOptions"
        option-label="tribe_name"
        option-value="tribe_id"
        label="Search by Tribe"
        popup-content-style="background-color:#222831; color:white"
      />
      <q-select
        v-if="this.splatPick === 'Werewolf: the Apocalypse'"
        class="select"
        filled
        clearable
        color="secondary"
        bg-color="grey-3"
        v-model="auspicePick"
        @update:model-value="this.$emit('update:auspice', this.auspicePick)"
        :options="auspiceOptions"
        label="Search by Auspice"
        option-label="auspice_name"
        option-value="auspice_id"
        popup-content-style="background-color:#222831; color:white"
      />

      <!-- User search -->
      <q-select
        class="select"
        use-input
        filled
        clearable
        color="secondary"
        bg-color="grey-3"
        v-model="pickedUser"
        @update:model-value="this.$emit('update:user', this.pickedUser)"
        :options="userOptions"
        label="Search by User"
        input-debounce="0"
        @filter="filterFn"
        option-label="username"
        popup-content-style="background-color:#222831; color:white"
      />
    </div>
    <q-btn
      icon="search"
      :loading="loading"
      color="#171A1E"
      text-color="white"
      label="Search"
      :disable="!this.splatPick"
      @click="this.doSearch()"
      style="margin-bottom: 10px"
    >
      <q-tooltip v-if="!this.splatPick" class="bg-dark text-body2"
        >Please select a splat first.</q-tooltip
      >
    </q-btn>
  </div>
</template>

<style scoped>
.searchContainer {
  background-color: #222831;
  max-width: 600px;
  flex-direction: column;
  margin: auto;
}
.select {
  width: 550px;
  margin-bottom: 15px;
}

@media (max-width: 800px) {
  .searchContainer {
    max-width: 400px;
    width: 300px;
    margin: auto;
  }
  .select {
    width: 250px;
    margin-bottom: 15px;
  }
}
</style>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";
import { useQuasar } from "quasar";

import clans from "../character_creator/vtm/5eClanBanes.json";
import predatorTypes from "../character_creator/vtm/predatorTypes.json";
import driveTypes from "../character_creator/hunter/drives.json";
import creedTypes from "../character_creator/hunter/creeds.json";

export default defineComponent({
  name: "searchBox",
  props: [
    "splat",
    "user",
    "clan",
    "predator",
    "kindred",
    "drive",
    "hunter",
    "creed",
    "garou",
    "tribe",
    "auspice",
  ],
  emits: [
    "update:splat",
    "update:user",
    "update:clan",
    "update:predator",
    "update:kindred",
    "update:hunter",
    "update:drive",
    "update:creed",
    "update:garou",
    "update:tribe",
    "update:auspice",
  ],
  async setup() {
    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }
    const $q = useQuasar();
    const axios = require("axios");
    const stringOptions = await axios
      .get(baseUrl + "/user/users", {
        withCredentials: true,
      })
      .then((resp) => {
        return resp.data;
      });
    const splatOptions = ref([
      "Vampire: the Masquerade",
      "Hunter: the Reckoning",
      "Werewolf: the Apocalypse",
    ]);

    const [tribesResponse, auspicesResponse] = await Promise.all([
      axios.get(baseUrl + "/garou/tribes"),
      axios.get(baseUrl + "/garou/auspices"),
    ]);

    const tribeOptions = tribesResponse.data;
    const auspiceOptions = auspicesResponse.data;

    const userList = ref(stringOptions);

    return {
      splatOptions,
      tribeOptions,
      auspiceOptions,
      userOptions: userList,
      filterFn(val, update) {
        if (val === "") {
          update(() => {
            userList.value = stringOptions;
          });
          return;
        }

        update(() => {
          const needle = val.toLowerCase();

          userList.value = stringOptions.filter(
            (v) => v.username.toLowerCase().indexOf(needle) > -1
          );
        });
      },
    };
  },
  data(props) {
    return {
      splatPick: props.splat,
      pickedUser: props.user,
      clanPick: props.clan,
      tribePick: props.tribe,
      auspicePick: props.auspice,
      predatorPick: props.predator,
      drivePick: props.drive,
      creedPick: props.creed,
      vampires: [],
      hunters: [],
      garous: [],
      loading: false,
      clanOptions: Object.keys(clans.clans),
      predatorOptions: predatorTypes.predator,
      driveOptions: driveTypes,
      creedOptions: creedTypes,
    };
  },

  methods: {
    async doSearch() {
      this.loading = true;
      this.vampires = [];
      this.hunters = [];
      this.garous = [];
      let baseUrl = "";
      if (window.location.href.includes("localhost")) {
        baseUrl = "http://localhost:5000";
      } else {
        baseUrl = window.location.origin;
      }

      if (this.splatPick === "Vampire: the Masquerade") {
        let searchParams = {
          game: this.splatPick,
          clan: this.clanPick,
          predator: this.predatorPick,
        };

        if (this.pickedUser !== null) {
          searchParams.user = this.pickedUser.user_id;
        }

        this.vampires = await this.$axios.post(
          baseUrl + "/search/vampires",
          { searchParams },
          {
            withCredentials: true,
          }
        );
        this.$emit("update:kindred", this.vampires.data);
        this.$emit("update:hunter", []);
        this.$emit("update:garou", []);
      }

      if (this.splatPick === "Hunter: the Reckoning") {
        let searchParams = {
          game: this.splatPick,
          drive: this.drivePick,
          creed: this.creedPick,
        };

        if (this.pickedUser !== null) {
          searchParams.user = this.pickedUser.user_id;
        }

        this.hunters = await this.$axios.post(
          baseUrl + "/search/hunters",
          { searchParams },
          {
            withCredentials: true,
          }
        );
        this.$emit("update:kindred", []);
        this.$emit("update:hunter", this.hunters.data);
        this.$emit("update:garou", []);
      }

      if (this.splatPick === "Werewolf: the Apocalypse") {
        let searchParams = {
          game: this.splatPick,
          tribe: this.tribePick,
          auspice: this.auspicePick,
        };

        if (this.pickedUser !== null) {
          searchParams.user = this.pickedUser.user_id;
        }

        this.garous = await this.$axios.post(
          baseUrl + "/search/garou",
          { searchParams },
          {
            withCredentials: true,
          }
        );
        this.$emit("update:kindred", []);
        this.$emit("update:hunter", []);
        this.$emit("update:garou", this.garous.data);
      }
      this.loading = false;
    },
  },
});
</script>
