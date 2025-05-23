<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <q-form @submit="onSubmit" class="q-gutter-md" style="max-width: 880px">
    <div class="q-pa-md row justify-center text-center">
      <q-banner class="bg-primary text-white" rounded dark>
        <div class="container">
          <p>Werewolf: the Apocalypse</p>
          <div v-if="imgLink">
            <q-img
              :src="imgLink"
              crossorigin="anonymous"
              v-show="isValidImageUrl(imgLink)"
              :alt="`Character Image for ${charName}`"
              spinner-color="primary"
              loading="lazy"
              style="
                border-radius: 8px;
                transition: transform 0.3s ease;
                max-width: 200px;
                max-height: 200px;
              "
              @click="zoomed = !zoomed"
              :class="{ 'hover-zoom': true, zoomed: zoomed }"
            />
          </div>
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
            <div>
              Advantage Dots Remaining:
              <q-btn @click="subtract_advantage()" flat>
                <q-tooltip class="tooltip"
                  >Remove an advantage point (+3xp) </q-tooltip
                >-</q-btn
              >
              {{ advantages }}
              <q-btn flat @click="add_advantage()"
                ><q-tooltip class="tooltip"
                  >Add an advantage point (-3xp)
                </q-tooltip>
                +</q-btn
              >
            </div>
            <div>
              Flaw Dots Remaining:
              <q-btn @click="subtract_flaw()" flat>
                <q-tooltip class="tooltip"
                  >Remove a flaw point (+3xp) </q-tooltip
                >-</q-btn
              >
              {{ flaws }}
              <q-btn flat @click="add_flaw()"
                ><q-tooltip class="tooltip">Add a flaw point (-3xp) </q-tooltip>
                +</q-btn
              >
            </div>
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
        v-model:imgLink="imgLink"
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
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
}

.centered-column {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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

.hover-zoom:hover {
  transform: scale(1.5);
  cursor: pointer;
}
.zoomed {
  transform: scale(1.3);
  z-index: 10;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
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
import nosImage from "../../../assets/images/Nosfer_logo.png";

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
  async setup() {
    const router = useRouter();
    const axios = require("axios");
    useMeta(metaData);

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    const url = window.location.href;
    const regex = /\/edit\/(\d+)$/; // Match "/edit/" followed by one or more digits at the end of the string
    const match = url.match(regex);
    let garou = null;
    if (match) {
      try {
        const capturedNumber = match[1];
        const garouResponse = await axios.get(
          baseUrl + `/garou/garou/${capturedNumber}`
        );
        garou = garouResponse.data;
      } catch (err) {
        garou = null;
      }
    }

    return {
      tab: ref("coreConcept"),
      layout: ref(false),
      baseUrl: ref(baseUrl),
      garou: ref(garou),
    };
  },

  data() {
    return {
      debug: false,
      nosImage,
      zoomed: false,
      garou_id: this.garou.id,
      advantagesObj: this.garou.advantages,
      attributesDone: true,
      attributeInfo,
      skillInfo,
      tribe_renown: { ...this.garou.tribe_renown },
      purchased_renown: { ...this.garou.purchased_renown },
      chronicle: this.garou.chronicle,
      attributePoints: 22,
      skillPoints: 29,
      charName: this.garou.charName,
      disableBlurb: "",
      gainedPoints: 0,
      baseSpecialties: 1,
      gainedSpecialties: 0,
      imgLink: this.garou.image_link,
      totalSpecialty: this.garou.remaining_specialties,
      charisma: this.garou.attributes.charisma,
      composure: this.garou.attributes.composure,
      dexterity: this.garou.attributes.dexterity,
      intelligence: this.garou.attributes.intelligence,
      manipulation: this.garou.attributes.manipulation,
      resolve: this.garou.attributes.resolve,
      stamina: this.garou.attributes.stamina,
      strength: this.garou.attributes.strength,
      wits: this.garou.attributes.wits,
      baseFlaws: 2,
      baseAdvantages: 7,
      flaws: this.garou.flaws_remaining,
      advantages: this.garou.advantages_remaining,
      baseSkills: {
        athletics: this.garou.skills.athletics,
        brawl: this.garou.skills.brawl,
        craft: this.garou.skills.craft,
        drive: this.garou.skills.drive,
        firearms: this.garou.skills.firearms,
        melee: this.garou.skills.melee,
        larceny: this.garou.skills.larceny,
        stealth: this.garou.skills.stealth,
        survival: this.garou.skills.survival,
        animalken: this.garou.skills.animalken,
        etiquette: this.garou.skills.etiquette,
        insight: this.garou.skills.insight,
        intimidation: this.garou.skills.intimidation,
        leadership: this.garou.skills.leadership,
        performance: this.garou.skills.performance,
        persuasion: this.garou.skills.persuasion,
        streetwise: this.garou.skills.streetwise,
        subterfuge: this.garou.skills.subterfuge,
        academics: this.garou.skills.academics,
        awareness: this.garou.skills.awareness,
        finance: this.garou.skills.finance,
        investigation: this.garou.skills.investigation,
        medicine: this.garou.skills.medicine,
        occult: this.garou.skills.occult,
        politics: this.garou.skills.politics,
        science: this.garou.skills.science,
        technology: this.garou.skills.technology,
      },
      trueSkills: {
        athletics: this.garou.skills.athletics,
        brawl: this.garou.skills.brawl,
        craft: this.garou.skills.craft,
        drive: this.garou.skills.drive,
        firearms: this.garou.skills.firearms,
        melee: this.garou.skills.melee,
        larceny: this.garou.skills.larceny,
        stealth: this.garou.skills.stealth,
        survival: this.garou.skills.survival,
        animalken: this.garou.skills.animalken,
        etiquette: this.garou.skills.etiquette,
        insight: this.garou.skills.insight,
        intimidation: this.garou.skills.intimidation,
        leadership: this.garou.skills.leadership,
        performance: this.garou.skills.performance,
        persuasion: this.garou.skills.persuasion,
        streetwise: this.garou.skills.streetwise,
        subterfuge: this.garou.skills.subterfuge,
        academics: this.garou.skills.academics,
        awareness: this.garou.skills.awareness,
        finance: this.garou.skills.finance,
        investigation: this.garou.skills.investigation,
        medicine: this.garou.skills.medicine,
        occult: this.garou.skills.occult,
        politics: this.garou.skills.politics,
        science: this.garou.skills.science,
        technology: this.garou.skills.technology,
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
      specialties: this.garou.specialties,
      specialtiesFromXp: [],
      concept: this.garou.concept,
      touchstones: this.garou.touchstones,
      xp: this.garou.xp,
      spentXp: this.garou.spent_xp,
      skillsDone: true,
      tribesDone: true,
      saving: false,
      tribe: this.garou.tribe,
      auspice: this.garou.auspice,
      tribe_gifts: this.garou.tribe_gifts,
      purchased_gifts: this.garou.purchased_gifts,
      bonus_renown: { ...this.garou.bonus_renown },
    };
  },
  methods: {
    isValidImageUrl(url) {
      try {
        const parsed = new URL(url);
        const allowedHosts = ["i.imgur.com", "imgur.com"];
        const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

        return (
          ["https:"].includes(parsed.protocol) &&
          allowedHosts.some((host) => parsed.hostname.endsWith(host)) &&
          allowedExtensions.some((ext) =>
            parsed.pathname.toLowerCase().endsWith(ext)
          )
        );
      } catch {
        return false;
      }
    },
    onSubmit() {
      if (this.saving === true) {
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "Saving...",
        });
        return;
      }
      this.saving = true;
      this.$q.loading.show({
        delay: 50, // ms
      });
      const axios = require("axios");

      let character = {
        name: this.charName,
        concept: this.concept,
        chronicle: this.chronicle,
        health: this.stamina + 3,
        willpower: this.composure + this.resolve,
        xp: this.xp,
        spent_xp: this.spentXp,
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
        tribe: this.tribe,
        auspice: this.auspice,
        advantages: this.advantagesObj,
        advantages_remaining: this.advantages,
        flaws_remaining: this.flaws,
        tribe_gifts: this.tribe_gifts,
        purchased_gifts: this.purchased_gifts,
        tribe_renown: this.tribe_renown,
        purchased_renown: this.purchased_renown,
        bonus_renown: this.bonus_renown,
      };

      axios
        .put(this.baseUrl + `/garou/edit/${this.garou_id}`, character, {
          withCredentials: true,
        })
        .then((res) => {
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: `${this.charName} updated!`,
          });
          this.$router.push({
            name: "garou5eView",
            params: { id: this.garou_id },
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
              flaws_remaining: this.flaws,
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
          this.flaws = this.flaws + data.flaws_remaining.value;
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

    add_flaw() {
      if (this.xp >= 3) {
        ++this.flaws;
        this.xp = this.xp - 3;
      } else {
        this.$q.notify({
          message: "Not enough XP remaining!",
          color: "primary",
          avatar: nosImage,
          timeout: 1500,
        });
      }
    },
    subtract_flaw() {
      if (this.flaws !== 0) {
        --this.flaws;
        this.xp = this.xp + 3;
      } else {
        this.$q.notify({
          message: "You have 0 remaining flaws!",
          color: "primary",
          avatar: nosImage,
          timeout: 1500,
        });
      }
    },
    add_advantage() {
      if (this.xp >= 3) {
        ++this.advantages;
        this.xp = this.xp - 3;
      } else {
        this.$q.notify({
          message: "Not enough XP remaining!",
          color: "primary",
          avatar: nosImage,
          timeout: 1500,
        });
      }
    },
    subtract_advantage() {
      if (this.advantages !== 0) {
        --this.advantages;
        this.xp = this.xp + 3;
      } else {
        this.$q.notify({
          message: "You have 0 remaining advantages!",
          color: "primary",
          avatar: nosImage,
          timeout: 1500,
        });
      }
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
