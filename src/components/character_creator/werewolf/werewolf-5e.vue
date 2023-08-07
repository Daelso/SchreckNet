<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <q-form @submit="onSubmit" class="q-gutter-md" style="max-width: 880px">
    <div class="q-pa-md row justify-center text-center">
      <q-banner class="bg-primary text-white" rounded dark>
        <div class="container">
          Werewolf: The Apocalypse
          <div class="info q-my-sm">
            <div>Name: {{ charName ? charName : "Unknown" }}</div>
            <div>Chronicle: {{ chronicle ? chronicle : "Unknown" }}</div>
            <div>Concept: {{ !concept ? "None" : concept }}</div>
          </div>
          <div class="concept q-mt-md">
            <div>Tribe: {{ !tribe ? "None" : tribe.tribe_name }}</div>
            <div>Auspice: {{ !auspice ? "None" : auspice.auspice_name }}</div>
            <div>Patron: {{ !tribe ? "None" : tribe.patron }}</div>
          </div>
          <div class="concept q-mt-md">
            <div>Glory: {{ renownTotal.glory }}</div>
            <div>Honor: {{ renownTotal.honor }}</div>
            <div>Wisdom: {{ renownTotal.wisdom }}</div>
          </div>
          <div class="concept q-mt-md">
            <div>Total Renown: {{ this.renownSum }}</div>
          </div>

          <q-separator class="q-my-md" />
          <div class="stats q-my-sm">
            <div>Health: {{ stamina + 3 }}</div>
            <div>Willpower: {{ composure + resolve }}</div>
            <div>Advantage Dots Remaining: {{ advantages }}</div>
            <div>Flaw Dots Remaining: {{ flaws }}</div>
          </div>
          <div style="margin: auto">Remaining XP: {{ xp }}</div>

          <q-separator class="q-my-md" />

          <q-list bordered class="rounded-borders">
            <q-expansion-item
              icon="attribution"
              label="Attributes"
              caption="View finalized attributes"
              dark
            >
              <q-card>
                <q-card-section class="backgroundDefault attributes">
                  <div
                    v-for="i in Math.ceil(attributeInfo.Attributes.length / 3)"
                    :key="i"
                  >
                    {{
                      i === 1
                        ? "Physical"
                        : i === 2
                        ? "Social"
                        : i === 3
                        ? "Mental"
                        : ""
                    }}
                  </div>
                  <div
                    v-for="(attribute, key) in attributeInfo.Attributes"
                    :key="key"
                  >
                    {{ attribute }}: {{ this[attribute.toLowerCase()] }}/5
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              icon="trending_up"
              label="Skills"
              caption="View finalized skills"
              dark
            >
              <q-card>
                <q-card-section class="backgroundDefault">
                  <div class="attributes">
                    <div
                      v-for="i in Math.ceil(
                        attributeInfo.Attributes.length / 3
                      )"
                      :key="i"
                    >
                      {{
                        i === 1
                          ? "Physical"
                          : i === 2
                          ? "Social"
                          : i === 3
                          ? "Mental"
                          : ""
                      }}
                    </div>
                    <div v-for="(skill, key) in skillInfo.skills" :key="key">
                      {{ skill }}: {{ this.trueSkills[skill.toLowerCase()] }}/5
                    </div>
                  </div>
                  <q-separator />
                  <br />
                  Specialties:
                  <div v-if="finalSpecialties().length < 1">None yet</div>
                  <div
                    v-for="(specialty, key) in finalSpecialties()"
                    :key="key"
                  >
                    Skill:
                    {{
                      specialty.skill[0].toUpperCase() +
                      specialty.skill.slice(1)
                    }}
                    - {{ specialty.specialty }}
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              icon="app:whiteClaws"
              label="Gifts & Rites"
              caption="View your gifts"
              dark
            >
              <q-card>
                <q-card-section class="backgroundDefault gifts">
                  <!-- Display gifts in three columns -->
                  <div>
                    <div>Native Gifts:</div>
                    <div v-if="combineGifts.native.length === 0">
                      Not yet selected
                    </div>
                    <div
                      v-for="(gift, index) in combineGifts.native"
                      :key="index"
                    >
                      {{ gift.gift_name }}
                    </div>
                  </div>
                  <div>
                    <div>Tribe Gifts:</div>
                    <div v-if="combineGifts.tribe.length === 0">
                      Not yet selected
                    </div>
                    <div
                      v-for="(gift, index) in combineGifts.tribe"
                      :key="index"
                    >
                      {{ gift.gift_name }}
                    </div>
                  </div>
                  <div>
                    <div>Auspice Gifts:</div>
                    <div v-if="combineGifts.auspice.length === 0">
                      Not yet selected
                    </div>
                    <div
                      v-for="(gift, index) in combineGifts.auspice"
                      :key="index"
                    >
                      {{ gift.gift_name }}
                    </div>
                  </div>
                  <div>
                    <div>Rites:</div>
                    <div v-if="combineGifts.rite.length === 0">
                      Not yet selected
                    </div>
                    <div
                      v-for="(gift, index) in combineGifts.rite"
                      :key="index"
                    >
                      {{ gift.rite_name }}
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              icon="military_tech"
              label="Advantages/Flaws"
              caption="View current advantages, flaws, backgrounds and safe houses"
              dark
            >
              <q-card>
                <q-card-section class="backgroundDefault merits_container">
                  <div class="grid-column">
                    <div class="merit-header">Merits:</div>

                    Advantages:
                    <div
                      class="q-my-sm"
                      v-if="advantagesObj.merits.advantages.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="advantage in advantagesObj.merits.advantages"
                      :key="advantage.name"
                    >
                      <div>{{ advantage.name }} - {{ advantage.cost }}</div>
                    </div>
                    Flaws:
                    <div
                      class="q-my-sm"
                      v-if="advantagesObj.merits.flaws.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="flaw in advantagesObj.merits.flaws"
                      :key="flaw.name"
                    >
                      <div>{{ flaw.name }} - {{ flaw.cost }}</div>
                    </div>
                  </div>
                  <div class="grid-column">
                    <div class="merit-header">Backgrounds:</div>

                    Advantages:
                    <div
                      class="q-my-sm"
                      v-if="advantagesObj.backgrounds.advantages.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="advantage in advantagesObj.backgrounds.advantages"
                      :key="advantage.name"
                    >
                      <div>{{ advantage.name }} - {{ advantage.cost }}</div>
                    </div>
                    Flaws:
                    <div
                      class="q-my-sm"
                      v-if="advantagesObj.backgrounds.flaws.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="flaw in advantagesObj.backgrounds.flaws"
                      :key="flaw.name"
                    >
                      <div>{{ flaw.name }} - {{ flaw.cost }}</div>
                    </div>
                  </div>

                  <div class="grid-column">
                    <div class="merit-header">Caern:</div>

                    Advantages:
                    <div
                      class="q-my-sm"
                      v-if="advantagesObj.caern.advantages.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="advantage in advantagesObj.caern.advantages"
                      :key="advantage.name"
                    >
                      <div>{{ advantage.name }} - {{ advantage.cost }}</div>
                    </div>
                    Flaws:
                    <div
                      class="q-my-sm"
                      v-if="advantagesObj.caern.flaws.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="flaw in advantagesObj.caern.flaws"
                      :key="flaw.name"
                    >
                      <div>{{ flaw.name }} - {{ flaw.cost }}</div>
                    </div>
                  </div>
                  <div class="grid-column">
                    <div class="merit-header">Loresheets:</div>

                    Advantages:
                    <div
                      class="q-my-sm"
                      v-if="advantagesObj.loresheets.advantages.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="advantage in advantagesObj.loresheets.advantages"
                      :key="advantage.name"
                    >
                      <div>{{ advantage.name }} - {{ advantage.cost }}</div>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="backgroundDefault">
                  <div class="centered-column">
                    <div class="merit-header">Talismans:</div>

                    Advantages:
                    <div
                      class="q-my-sm"
                      v-if="advantagesObj.talismans.advantages.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="advantage in advantagesObj.talismans.advantages"
                      :key="advantage.name"
                    >
                      <div>{{ advantage.name }} - {{ advantage.cost }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              icon="settings_accessibility"
              label="Touchstones"
              caption="Who do you fight for?"
              dark
            >
              <q-card>
                <q-card-section class="backgroundDefault">
                  Touchstones
                  <div v-if="touchstones.length < 1">None</div>
                  <div v-for="(touchstone, key) in touchstones" :key="key">
                    {{ touchstone }}
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>

        <template v-slot:action>
          <q-btn
            :disable="this.saveGuard()"
            flat
            label="Save Character"
            type="submit"
            color="white"
          />
          <q-tooltip v-if="this.saveGuard()" class="bg-dark text-body2">{{
            this.disableBlurb
          }}</q-tooltip>
        </template>
      </q-banner>
    </div>
    <div class="q-pa-md col justify-center text-center">
      <q-card class="bg-primary text-white container">
        <q-list>
          <q-item clickable @click="attributes">
            <q-item-section avatar>
              <q-icon color="secondary" name="attribution" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Attributes</q-item-label>
              <q-item-label caption class="text-white"
                >Set your base, unmodified, attributes</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item clickable @click="skills">
            <q-item-section avatar>
              <q-icon color="secondary" name="trending_up" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Skills</q-item-label>
              <q-item-label caption class="text-white"
                >Set your base, unmodified, skills</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item clickable @click="tribes">
            <q-item-section avatar>
              <q-icon color="secondary" name="app:claws" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Tribes, Auspice & Gifts</q-item-label>
              <q-item-label caption class="text-white"
                >Select your Tribe, Auspice & Gifts</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item
            clickable
            @click="spendXp"
            :disable="
              (!this.skillsDone || !this.attributesDone || !this.tribesDone) &&
              this.debug !== true
            "
          >
            <q-tooltip
              v-if="
                !this.skillsDone ||
                !this.attributesDone ||
                !this.tribesDone ||
                this.xp === 0
              "
              class="bg-dark text-body2"
              >Please set valid base attributes, skills, complete your tribe,
              auspice and gift section and have xp remaining to
              spend.</q-tooltip
            >
            <q-item-section avatar>
              <q-icon color="secondary" name="upgrade" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Spend XP</q-item-label>
              <q-item-label caption class="text-white"
                >Upgrade your abilities by spending your remaining
                xp</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
      <tabs
        @specialties="handleSpecialties($event)"
        v-model:charName="charName"
        v-model:chronicle="chronicle"
        v-model:concept="concept"
        v-model:specialtiePoints="totalSpecialty"
        v-model:advantagePoints="advantages"
        v-model:flawPoints="flaws"
        v-model:advantagesObj="advantagesObj"
        v-model:tab="tab"
        v-model:xp="xp"
        v-model:touchstones="touchstones"
        :specials="this.specialties"
        :fullSkills="this.trueSkills"
        :debug="this.debug"
      />
    </div>
  </q-form>
</template>

<style>
.merits_container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  justify-items: center;
}

.grid-column {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  padding: 10px;
}

.centered-column {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}

.merit-header {
  padding: 1em;
  font-size: 1.2em;
}

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
.backgroundDefault {
  background-color: #171a1e;
}
.attributes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
  grid-row-gap: 5px;
}

@media only screen and (max-width: 600px) {
  .select {
    width: 300px;
  }
  .attributes {
    display: grid;
    grid-row-gap: 20px;
    width: 100%;
    font-size: 0.95em;
    width: 365px;
  }
}
.info {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 45px;
}

.stats {
  display: grid;
  gap: 3px;
  grid-template-columns: repeat(2, 1fr);
}

.advantages {
  display: grid;
  gap: 3px;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
}

.concept {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 45px;
}

.gifts {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
}
</style>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import tabs from "../werewolf/tabs.vue";
import spendXp from "../werewolf/spendXp.vue";
import attributes from "../werewolf/5eAttributes.vue";
import skills from "../vtm/5eSkills.vue";
import attributeInfo from "../vtm/5eAttributes.json";
import skillInfo from "../vtm/5eSkills.json";
import { useMeta } from "quasar";
import tribeComponent from "../werewolf/tribes.vue";

const metaData = {
  title: "SchreckNet",
  titleTemplate: (title) => `${title} - Werewolf: The Apocalypse Creator`,

  // meta tags
  meta: {
    keywords: {
      name: "keywords",
      content:
        "werewolf, character creator, wta, wta5, werewolf the apocalypse, w5e, schrecknet, WoD, world of darkness",
    },
  },
};

export default {
  components: {
    tabs,
  },
  setup() {
    const router = useRouter();
    const axios = require("axios");
    useMeta(metaData);

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    return {
      tab: ref("coreConcept"),
      layout: ref(false),
    };
  },
  data() {
    return {
      debug: true,
      advantagesObj: {
        merits: { advantages: [], flaws: [] },
        backgrounds: { advantages: [], flaws: [] },
        caern: { advantages: [], flaws: [] },
        loresheets: { advantages: [] },
        talismans: { advantages: [] },
      },
      attributesDone: false,
      attributeInfo,
      skillInfo,
      tribe_renown: { glory: 0, honor: 0, wisdom: 0 },
      purchased_renown: { glory: 0, honor: 0, wisdom: 0 },
      chronicle: "",
      edgeDist: { dist: "Two edges, one perk", distArr: [2, 1] },
      attributePoints: 22,
      skillPoints: 29,
      charName: "",
      disableBlurb: "",
      gainedPoints: 0,
      baseSpecialties: 1,
      gainedSpecialties: 0,
      totalSpecialty: 1,
      charisma: 0,
      composure: 0,
      dexterity: 0,
      intelligence: 0,
      manipulation: 0,
      resolve: 0,
      stamina: 0,
      strength: 0,
      wits: 0,
      baseFlaws: 2,
      baseAdvantages: 7,
      flaws: 2,
      advantages: 7,
      baseSkills: {
        athletics: 0,
        brawl: 0,
        craft: 0,
        drive: 0,
        firearms: 0,
        melee: 0,
        larceny: 0,
        stealth: 0,
        survival: 0,
        animalken: 0,
        etiquette: 0,
        insight: 0,
        intimidation: 0,
        leadership: 0,
        performance: 0,
        persuasion: 0,
        streetwise: 0,
        subterfuge: 0,
        academics: 0,
        awareness: 0,
        finance: 0,
        investigation: 0,
        medicine: 0,
        occult: 0,
        politics: 0,
        science: 0,
        technology: 0,
      },
      trueSkills: {
        athletics: 0,
        brawl: 0,
        craft: 0,
        drive: 0,
        firearms: 0,
        melee: 0,
        larceny: 0,
        stealth: 0,
        survival: 0,
        animalken: 0,
        etiquette: 0,
        insight: 0,
        intimidation: 0,
        leadership: 0,
        performance: 0,
        persuasion: 0,
        streetwise: 0,
        subterfuge: 0,
        academics: 0,
        awareness: 0,
        finance: 0,
        investigation: 0,
        medicine: 0,
        occult: 0,
        politics: 0,
        science: 0,
        technology: 0,
      },
      skillDistribution: {
        label: "Jack-of-all-trades",
        pointsTotal: 29,
        distribution: [
          3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
          0, 0, 0, 0,
        ],
        distributionDesc: "One Skill at 3; eight Skills at 2; ten Skills at 1",
      },
      specialties: [],
      specialtiesFromXp: [],
      concept: "",
      touchstones: [],
      xp: 250,
      spentXp: 0,
      skillsDone: false,
      tribesDone: false,
      saving: false,
      tribe: null,
      auspice: null,
      tribe_gifts: {
        native: null,
        auspice: null,
        tribe: null,
        rite: null,
      },
      purchased_gifts: {
        native: [],
        auspice: [],
        tribe: [],
        rite: [],
      },
      bonus_renown: null,
    };
  },
  methods: {
    onSubmit() {
      if (this.saving === true) {
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "Saving...",
        });
      }
      this.saving = true;
      this.$q.loading.show({
        delay: 50, // ms
      });
      const axios = require("axios");

      let baseUrl = "";
      if (window.location.href.includes("localhost")) {
        baseUrl = "http://localhost:5000";
      } else {
        baseUrl = window.location.origin;
      }

      let character = {
        name: this.charName,
        concept: this.concept,
        chronicle: this.chronicle,
        health: this.stamina + 3,
        willpower: this.composure + this.resolve,
        xp: this.xp,
        spentXp: this.spentXp,
        touchstones: this.touchstones,
        remainingSpecialties: this.totalSpecialty,
        skills: this.trueSkills,
        attributes: {
          charisma: this.charisma,
          composure: this.composure,
          dexterity: this.dexterity,
          intelligence: this.intelligence,
          manipulation: this.manipulation,
          resolve: this.resolve,
          stamina: this.stamina,
          strength: this.strength,
          wits: this.wits,
        },
        specialties: this.finalSpecialties(),
        advantages: this.advantagesObj,
        advantages_remaining: this.advantages,
        flaws_remaining: this.flaws,
      };

      axios
        .post(baseUrl + "/hunters/new", character, {
          withCredentials: true,
        })
        .then((res) => {
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Hunter created!",
          });
          this.$router.push({
            name: "hunter5eView",
            params: { id: res.data },
          });
        })
        .catch((err) =>
          this.$q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: err.message,
          })
        );
      this.$q.loading.hide();
      this.saving = false;
    },

    handleSpecialties(data) {
      this.specialties = data;
    },

    attributes() {
      this.$q
        .dialog({
          component: attributes,
          persistent: true,
          componentProps: {
            info: {
              attributesDone: this.attributesDone,
              attributePoints: this.attributePoints,
              charisma: this.charisma,
              composure: this.composure,
              dexterity: this.dexterity,
              intelligence: this.intelligence,
              manipulation: this.manipulation,
              resolve: this.resolve,
              stamina: this.stamina,
              strength: this.strength,
              wits: this.wits,
              xp: this.xp,
            },
          },
        })
        .onOk((data) => {
          this.attributesDone = data.attributesDone;
          this.attributePoints = data.attributePoints;
          this.charisma = data.charisma;
          this.composure = data.composure;
          this.dexterity = data.dexterity;
          this.intelligence = data.intelligence;
          this.manipulation = data.manipulation;
          this.resolve = data.resolve;
          this.stamina = data.stamina;
          this.strength = data.strength;
          this.wits = data.wits;
          this.xp = data.xp;
        });
    },
    skills() {
      this.$q
        .dialog({
          component: skills,
          persistent: true,
          componentProps: {
            info: {
              specialtyPoints: this.totalSpecialty,
              baseSkills: this.baseSkills,
              skillPoints: this.skillPoints,
              skillDistribution: this.skillDistribution,
              skillsDone: this.skillsDone,
              specialties: this.specialties,
            },
          },
        })
        .onOk((data) => {
          this.skillPoints = data.skillPoints;
          this.trueSkills = { ...this.trueSkills, ...this.baseSkills };
          this.skillDistribution = data.skillDistribution;
          this.skillsDone = data.skillsDone;
          this.totalSpecialty = data.specialtyPoints;
          this.specialties = data.specialties;
        });
    },
    tribes() {
      this.$q
        .dialog({
          component: tribeComponent,
          persistent: true,
          componentProps: {
            info: {
              tribe: this.tribe,
              auspice: this.auspice,
              tribesDone: this.tribesDone,
              renown: this.tribe_renown,
              tribe_gifts: this.tribe_gifts,
              renown_sum: this.renownSum,
              bonus_renown: this.bonus_renown,
            },
          },
        })
        .onOk((data) => {
          this.tribe = data.tribe;
          this.auspice = data.auspice;
          this.tribesDone = data.tribesDone;
          this.tribe_renown = data.renown;
          this.tribe_gifts = data.tribe_gifts;
          this.bonus_renown = data.bonus_renown;
        });
    },
    spendXp() {
      this.$q
        .dialog({
          component: spendXp,
          persistent: true,
          componentProps: {
            info: {
              attributes: [
                { name: "Charisma", points: this.charisma },
                { name: "Composure", points: this.composure },
                { name: "Dexterity", points: this.dexterity },
                { name: "Manipulation", points: this.manipulation },
                { name: "Intelligence", points: this.intelligence },
                { name: "Resolve", points: this.resolve },
                { name: "Stamina", points: this.stamina },
                { name: "Strength", points: this.strength },
                { name: "Wits", points: this.wits },
              ],
              skills: this.trueSkills,
              specialtiesFromXp: this.specialtiesFromXp,
              xp: this.xp,
              spentXp: this.spentXp,
              tribe_renown: this.tribe_renown,
              purchased_renown: this.purchased_renown,
              tribe: this.tribe,
              auspice: this.auspice,
              gift_count: this.getGiftAmount,
              purchased_gifts: this.purchased_gifts,
            },
          },
        })
        .onOk((data) => {
          this.xp = data.xp;
          this.spentXp = data.spentXp;
          this.advantages = this.advantages + data.advantages.value;
          this.specialtiesFromXp = data.specialtiesFromXp;
          this.trueSkills = data.skills;
          this.purchased_renown = data.purchased_renown;
          this.tribe_renown = data.tribe_renown;
          this.purchased_gifts = data.purchased_gifts;
          data.attributes.value.forEach((attribute) => {
            this[attribute.name.toLowerCase()] = attribute.points;
          });
        });
    },

    finalSpecialties() {
      let specialties = [];
      specialties = this.specialties.concat(this.specialtiesFromXp);

      return specialties;
    },

    saveGuard() {
      //primary sections
      if (!this.skillsDone || !this.attributesDone || !this.tribesDone) {
        this.disableBlurb =
          "Please complete the base attributes, skills sections and select your tribe, auspice and gifts.";
        return true;
      }
      //Touchstones
      if (this.touchstones < 1 || this.touchstones.length > 3) {
        this.disableBlurb = "Must have between 1-3 touchstones.";
        return true;
      }
      //Core Concept
      if (!this.charName || !this.concept || !this.chronicle) {
        this.disableBlurb =
          "Please complete all * fields in the core concept tab.";
        return true;
      }

      return false;
    },

    sortSkills() {
      let optionsArr = [];
      for (const skill in this.trueSkills) {
        if (this.trueSkills[skill] > 0) {
          optionsArr.push(skill[0].toUpperCase() + skill.slice(1));
        }
      }
      return optionsArr;
    },

    isMobile() {
      var check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    },
  },
  computed: {
    renownTotal() {
      let trueRenown = { glory: 0, honor: 0, wisdom: 0 };
      trueRenown.glory = this.tribe_renown.glory + this.purchased_renown.glory;
      trueRenown.honor = this.tribe_renown.honor + this.purchased_renown.honor;
      trueRenown.wisdom =
        this.tribe_renown.wisdom + this.purchased_renown.wisdom;

      return trueRenown;
    },

    renownSum() {
      const totalRenown = this.renownTotal;
      const sum = Object.values(totalRenown).reduce(
        (acc, value) => acc + value,
        0
      );

      return sum;
    },

    combineGifts() {
      let gifts = { native: [], tribe: [], auspice: [], rite: [] };

      for (let key in this.tribe_gifts) {
        if (this.tribe_gifts[key] !== null) {
          gifts[key].push(this.tribe_gifts[key]);
        }
      }

      for (let key in this.purchased_gifts) {
        if (this.purchased_gifts[key].length > 0) {
          gifts[key] = [...gifts[key], ...this.purchased_gifts[key]];
        }
      }

      return gifts;
    },

    getGiftAmount() {
      const gifts = this.combineGifts;

      return Object.keys(gifts)
        .filter((key) => key !== "rite") // Filter out the "rite" key
        .reduce((sum, key) => sum + gifts[key].length, 0);
    },
  },
};
</script>
