<template>
  <q-form @submit="onSubmit" class="q-gutter-md" style="max-width: 880px">
    <div class="q-pa-md row justify-center text-center">
      <q-banner class="bg-primary text-white" inline-actions rounded dark>
        Name: {{ charName }}
        <br />
        Clan: {{ clan }}
        <br />
        Age:
        {{ age.label }}
        <br />
        Generation:
        {{ generation.label }}
        <br />
        Potency: {{ generation.potency }}/{{ generation.maxPotency }}
        <br />
        Humanity: {{ humanity }}
        <br />
        Remaining XP: {{ xp }}
        <br />
        Convictions: {{ convictions }}
        <br />
        Touchstones: {{ touchstones }}
        <br />
        Disciplines:

        <div v-for="(discipline, key) in disciplines" :key="key">
          {{ key }}: {{ discipline }}
        </div>
        <template v-slot:action>
          <q-btn flat label="Save Character" type="submit" color="white" />
        </template>
      </q-banner>
    </div>
    <div class="q-pa-md col justify-left text-center">
      <q-card class="bg-primary text-white">
        <q-list>
          <q-item clickable @click="clanSelected">
            <q-item-section avatar>
              <q-icon color="primary" name="app:ankh" style="scale: 170%" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Affiliations:</q-item-label>
              <q-item-label caption class="text-white"
                >Manage things like clan, disciplines, sire, sect.</q-item-label
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
      <tabs
        @charName="handleCharName($event)"
        @concept="handleConcept($event)"
        @ambition="handleAmbition($event)"
        @desire="handleDesire($event)"
        @convictions="handleConvictions($event)"
        @touchstones="handleTouchstones($event)"
      />
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
.q-field__bottom {
  color: white;
  margin-bottom: 3px;
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
import tabs from "../vtm/tabs.vue";

export default {
  components: {
    tabs,
  },
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
      age: { label: "Childer", bonusXp: 0 },
      ambition: "",
      charName: "",
      archtypeModel: ref(null),
      chronicle: "",
      convictions: [],
      clan: ref("Brujah"),
      clanBane: ref(
        "Violent Temper: Subtract dice equal to the Bane Severity of the Brujah from any roll to resist fury frenzy. This cannot take the pool below one die (V5 Corebook p.67)"
      ),
      clanDesc: ref(
        "The 'Rabble' rebel against power and rage against tyranny."
      ),
      clanCompulsion: ref(
        "Rebellion: the vampire takes a stand against whatever or whomever they see as the status quo in the situation, whether that is their leader, a viewpoint expressed by a potential vessel, or just the task they were supposed to do at the moment. Until they have gone against their orders or expectations, perceived or real, the vampire receives a two dice penalty to all rolls. This Compulsion ends once they have managed to either make someone change their minds (by force if necessary) or done the opposite of what was expected of them. (V5 Corebook p.210)"
      ),
      desire: "",
      disciplines: {},
      humanity: 7,
      sect: ref("Camarilla"),
      sire: null,
      concept: "",
      generation: { label: "12th", potency: 1, maxPotency: 3 },
      touchstones: [],
      xp: 0,
      tooltips: ref([
        "Supernatural quickness and reflexes",
        "The Discipline of physical vigor and strength",
        "The ability to attract, sway, and control emotions",
      ]),
    };
  },
  methods: {
    onSubmit() {
      console.log(this.charName);
      console.log(this.archtypeModel);
      console.log(this.clan);
    },
    handleCharName(data) {
      this.charName = data;
    },
    handleConcept(data) {
      this.concept = data;
    },
    handleAmbition(data) {
      this.ambition = data;
    },
    handleDesire(data) {
      this.desire = data;
    },
    handleConvictions(data) {
      this.convictions = data;
    },
    handleTouchstones(data) {
      this.touchstones = data;
    },
    clanSelected() {
      this.$q
        .dialog({
          component: clanSelect,
          persistent: true,
          componentProps: {
            info: {
              age: this.age,
              archtype: this.archtypeModel,
              bane: this.clanBane,
              clan: this.clan,
              compulsion: this.compulsion,
              desc: this.clanDesc,
              disciplines: this.disciplines,
              generation: this.generation,
              humanity: this.humanity,
              sect: this.sect,
              sire: this.sire,
              tooltips: this.tooltips,
              xp: this.xp,
            },
          },
        })
        .onOk((data) => {
          this.age = data.age;
          this.clan = data.clan;
          this.clanBane = data.bane;
          let selectedDisc = data.disciplines._rawValue;
          let discChoices = data.disciplineChoices._rawValue;
          this.disciplines = {};
          this.tooltips = data.tooltips;
          this.clanDesc = data.desc;
          this.compulsion = data.compulsion;
          this.sire = data.sire;
          this.archtypeModel = data.archtype;
          this.generation = data.generation;
          this.humanity = data.humanity;
          this.xp = data.xp;

          selectedDisc.forEach(
            (key, i) => (this.disciplines[key] = discChoices[i])
          );
        });
    },
  },
};
</script>
