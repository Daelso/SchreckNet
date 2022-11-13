<template>
  <q-form @submit="onSubmit" class="q-gutter-md" style="max-width: 1200px">
    <div class="q-pa-md row justify-center text-center">
      <q-banner class="bg-primary text-white" inline-actions rounded dark>
        Name: {{ charName }} Clan: {{ clan }} Generation:
        {{ generation }} Remaining XP: {{ xp }}
        {{ generation }}
        <template v-slot:action>
          <q-btn flat label="Save Character" type="submit" color="white" />
        </template>
      </q-banner>
    </div>
    <div class="q-pa-md col justify-left text-center">
      <q-card class="my-card bg-primary text-white">
        <q-list>
          <q-item clickable @click="clanSelected">
            <q-item-section avatar>
              <q-icon color="primary" name="local_bar" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Affiliations:</q-item-label>
              <q-item-label caption class="text-white"
                >Manage things like clan, sire, sect.</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section avatar>
              <q-icon color="red" name="local_gas_station" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Gas Station</q-item-label>
              <q-item-label caption class="text-white"
                >Fill your gas tank.</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section avatar>
              <q-icon color="amber" name="local_movies" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Cinema XYZ</q-item-label>
              <q-item-label caption class="text-white"
                >Watch a movie.</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <div class="q-pa-md row justify-center text-center">
      <q-card class="bg-primary">
        <q-tabs
          v-model="tab"
          class="bg-primary"
          active-color="secondary"
          indicator-color="secondary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="basicInfo" label="Core Concept" />
          <q-tab name="alarms" label="Alarms" />
          <q-tab name="movies" label="Movies" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated class="bg-primary">
          <q-tab-panel name="basicInfo" class="q-m-b-xl">
            <q-input
              filled
              class="select"
              bg-color="grey-3"
              v-model="charName"
              label="Your character's name *"
              lazy-rules
              label-color="primary"
              :rules="[
                (val) =>
                  (typeof val === 'string' &&
                    val.length > 3 &&
                    val.length <= 128) ||
                  'Please enter a valid name, between 3-128 characters',
              ]"
            />
            <q-input
              filled
              bg-color="grey-3"
              v-model="job"
              label="What did you do in life *"
              autogrow
              lazy-rules
              label-color="primary"
              :rules="[
                (val) =>
                  (typeof val === 'string' && val.length <= 2000) ||
                  'Please keep this field under 2000 characters',
              ]"
            />
            <q-input
              filled
              bg-color="grey-3"
              v-model="embracedWhen"
              label="When were you embraced *"
              autogrow
              lazy-rules
              label-color="primary"
              :rules="[
                (val) =>
                  (typeof val === 'string' && val.length <= 2000) ||
                  'Please keep this field under 2000 characters',
              ]"
            />
            <q-input
              filled
              bg-color="grey-3"
              v-model="embracedWhere"
              label="Where were you embraced *"
              autogrow
              lazy-rules
              label-color="primary"
              :rules="[
                (val) =>
                  (typeof val === 'string' && val.length <= 2000) ||
                  'Please keep this field under 2000 characters',
              ]"
            />
            <q-input
              filled
              bg-color="grey-3"
              v-model="whereNow"
              label="Where do you call home now *"
              autogrow
              label-color="primary"
              lazy-rules
              :rules="[
                (val) =>
                  (typeof val === 'string' && val.length <= 2000) ||
                  'Please keep this field under 2000 characters',
              ]"
            />
            <q-input
              filled
              bg-color="grey-3"
              v-model="sire"
              label-color="primary"
              label="Your sire (if known) *"
              lazy-rules
              :rules="[
                (val) => typeof val === 'string' || 'Please enter a string',
              ]"
            />
            <q-input
              filled
              bg-color="grey-3"
              v-model="title"
              label="Your character's title *"
              lazy-rules
              label-color="primary"
              :rules="[
                (val) =>
                  (typeof val === 'string' &&
                    val.length > 3 &&
                    val.length <= 128) ||
                  'Please enter a valid title, between 3-128 characters',
              ]"
            />
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <div class="text-h6">Alarms</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="movies">
            <div class="text-h6">Movies</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-form>
</template>

<style>
.select {
  width: 800px;
}
.q-field__counter {
  color: white;
}
@media only screen and (max-width: 600px) {
  .select {
    width: 300px;
  }
}
</style>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";
import clanSelect from "../vtm/5eClanSelect.vue";

export default {
  emits: ["newClan"],
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

    return {
      tab: ref("basicInfo"),
    };
  },
  data() {
    const router = useRouter();

    return {
      charName: "",
      title: "",
      archtypeModel: ref(null),
      clan: ref("Brujah"),
      sect: ref("Camarilla"),
      sire: "",
      job: "",
      generation: 5,
      embracedWhen: "",
      embracedWhere: "",
      whereNow: "",
      xp: 0,
    };
  },
  methods: {
    onSubmit() {
      console.log(this.charName);
      console.log(this.title);
      console.log(this.archtypeModel);
      console.log(this.clan);
    },
    clanSelected() {
      this.$q
        .dialog({
          component: clanSelect,
          persistent: true,
          // props forwarded to your custom component
          componentProps: {
            info: {
              clan: this.clan,
              sect: this.sect,
              archtype: this.archtypeModel,
            },
            // ...more..props...
          },
        })
        .onOk((data) => {
          console.log("Saved");
          this.clan = data;
        });
    },
  },
};
</script>
