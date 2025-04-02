<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <div
    v-if="
      !this.pageFound ||
      !this.currentUser ||
      this.currentUser.id !== this.hunter.created_by
    "
  >
    <notFound />
  </div>
  <q-form @submit="onSubmit" class="q-gutter-md" style="max-width: 880px">
    <div class="q-pa-md row justify-center text-center">
      <q-banner class="bg-primary text-white" rounded dark>
        <div class="container">
          Hunter: the Reckoning
          <div class="info q-my-sm">
            <div>Name: {{ charName ? charName : "Unknown" }}</div>
            <div>Creed: {{ creed.name ? creed.name : "Unknown" }}</div>
            <div>Cell: {{ cell ? cell : "Unknown" }}</div>
          </div>
          <div class="concept q-mt-md">
            <div>Concept: {{ !concept ? "None" : concept }}</div>
            <div>Ambition: {{ !ambition ? "None" : ambition }}</div>
            <div>Desire: {{ !desire ? "None" : desire }}</div>
          </div>
          <div class="q-mt-md">
            <div>Drive: {{ !drive ? "None" : drive.name }}</div>
            <div>Redemption: {{ !redemption ? "None" : redemption }}</div>
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
              >{{ advantages }}
              <q-btn flat @click="add_advantage()"
                ><q-tooltip class="tooltip"
                  >Add an advantage point (-3xp)
                </q-tooltip>
                +</q-btn
              >
            </div>
            <div>
              <q-btn @click="subtract_flaw()" flat>
                <q-tooltip class="tooltip"
                  >Remove a flaw point (+3xp) </q-tooltip
                >-</q-btn
              >
              Flaw Dots Remaining: {{ flaws }}
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
              icon="app:whiteHunter"
              label="Edges & Perks"
              caption="View edges and perks"
              dark
            >
              <q-card>
                <q-card-section class="backgroundDefault">
                  Edges:
                  <div v-if="this.edgeArr.edges.length === 0">
                    Not yet selected
                  </div>
                  <div v-for="(edge, key) in this.edgeArr.edges" :key="key">
                    <div>{{ edge.category }} - {{ edge.edge }}</div>
                  </div>
                  <br />
                  Perks:
                  <div v-if="this.edgeArr.perks.length === 0">
                    Not yet selected
                  </div>

                  <div v-for="(perk, key) in this.edgeArr.perks" :key="key">
                    {{ perk.category }} - {{ perk.perk }}
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
                <q-card-section class="backgroundDefault advantages">
                  <div>
                    <div style="font-size: larger">Merits:</div>
                    <br />
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
                    <br />
                    <div>
                      <div style="font-size: larger">Backgrounds:</div>
                      <br />
                      Advantages:
                      <div
                        class="q-my-sm"
                        v-if="advantagesObj.backgrounds.advantages.length === 0"
                      >
                        Not yet selected
                      </div>
                      <div
                        v-for="advantage in advantagesObj.backgrounds
                          .advantages"
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
                  </div>
                  <div>
                    <div style="font-size: larger">Safe House:</div>
                    <br />
                    Advantages:
                    <div
                      class="q-my-sm"
                      v-if="advantagesObj.haven.advantages.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="advantage in advantagesObj.haven.advantages"
                      :key="advantage.name"
                    >
                      <div>{{ advantage.name }} - {{ advantage.cost }}</div>
                    </div>
                    Flaws:
                    <div
                      class="q-my-sm"
                      v-if="advantagesObj.haven.flaws.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="flaw in advantagesObj.haven.flaws"
                      :key="flaw.name"
                    >
                      <div>{{ flaw.name }} - {{ flaw.cost }}</div>
                    </div>
                    <br />
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
            label="Update Character"
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
          <q-item clickable @click="edges">
            <q-item-section avatar>
              <q-icon color="secondary" name="app:hunter" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Edges & Perks</q-item-label>
              <q-item-label caption class="text-white"
                >Select your Edges & Perks</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item
            clickable
            @click="spendXp"
            :disable="
              (!this.skillsDone || !this.attributesDone || !this.edgeDone) &&
              this.debug !== true
            "
          >
            <q-tooltip
              v-if="
                !this.skillsDone ||
                !this.attributesDone ||
                !this.edgeDone ||
                this.xp === 0
              "
              class="bg-dark text-body2"
              >Please set valid base attributes, skills, complete your
              edges/perks section and have xp remaining to spend.</q-tooltip
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
        v-model:charName="charName"
        v-model:concept="concept"
        v-model:ambition="ambition"
        v-model:desire="desire"
        v-model:touchstones="touchstones"
        v-model:chronicle="chronicle"
        @specialties="handleSpecialties($event)"
        v-model:specialtiePoints="totalSpecialty"
        v-model:advantagePoints="advantages"
        v-model:flawPoints="flaws"
        v-model:advantagesObj="advantagesObj"
        v-model:creed="creed"
        v-model:drive="drive"
        v-model:redemption="redemption"
        v-model:cell="cell"
        v-model:tab="tab"
        v-model:xp="xp"
        :specials="this.specialties"
        :fullSkills="this.trueSkills"
        :cell="this.cell"
        :debug="this.debug"
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
    font-size: 3vw;
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
</style>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import tabs from "./tabs.vue";
import spendXp from "./spendXp.vue";
import attributes from "./5eAttributes.vue";
import skills from "../vtm/5eSkills.vue";
import attributeInfo from "../vtm/5eAttributes.json";
import skillInfo from "../vtm/5eSkills.json";
import { useMeta } from "quasar";
import edgeComponent from "./edges.vue";
import notFound from "../../../pages/ErrorNotFound.vue";

const metaData = {
  title: "SchreckNet",
  titleTemplate: (title) => `${title} - Hunter 5e Editor`,

  // meta tags
  meta: {
    keywords: {
      name: "keywords",
      content:
        "hunter, character creator, h5, hunter the reckoning, h5e, schrecknet, WoD, world of darkness",
    },
  },
};

export default {
  components: {
    tabs,
    notFound,
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
    let pageFound = ref(false);

    const hunterId = ref(window.location.href.split("/")[6]);

    const hunter = await axios
      .get(baseUrl + "/hunters/hunter/" + hunterId.value, {
        withCredentials: true,
      })
      .then((resp) => {
        pageFound.value = true;
        return resp.data;
      })
      .catch((err) => {
        console.log(err);
        return "blah";
      });

    const currentUser = await axios
      .get(baseUrl + "/user/currentUser", {
        withCredentials: true,
      })
      .then((resp) => {
        return resp.data;
      });

    return {
      tab: ref("coreConcept"),
      layout: ref(false),
      pageFound,
      currentUser: ref(currentUser),
      hunter: ref(hunter),
    };
  },
  data() {
    return {
      debug: false,
      advantagesObj: this.hunter.advantages,
      attributesDone: true,
      attributeInfo,
      skillInfo,
      creed: this.hunter.creed,
      ambition: this.hunter.ambition,
      drive: this.hunter.drive,
      redemption: this.hunter.redemption,
      edgeDist: { dist: "Two edges", distArr: [2, 0] },
      attributePoints: 0,
      skillPoints: 0,
      charName: this.hunter.charName,
      disableBlurb: "",
      gainedPoints: 0,
      baseSpecialties: 1,
      gainedSpecialties: 0,
      totalSpecialty: this.hunter.remaining_specialties,
      charisma: this.hunter.attributes.charisma,
      composure: this.hunter.attributes.composure,
      dexterity: this.hunter.attributes.dexterity,
      intelligence: this.hunter.attributes.intelligence,
      manipulation: this.hunter.attributes.manipulation,
      resolve: this.hunter.attributes.resolve,
      stamina: this.hunter.attributes.stamina,
      strength: this.hunter.attributes.strength,
      wits: this.hunter.attributes.wits,
      baseFlaws: 2,
      baseAdvantages: 7,
      flaws: this.hunter.flaws_remaining,
      advantages: this.hunter.advantages_remaining,
      chronicle: this.hunter.chronicle,
      edgeArr: this.hunter.edges,
      baseSkills: {
        athletics: this.hunter.skills.athletics,
        brawl: this.hunter.skills.brawl,
        craft: this.hunter.skills.craft,
        drive: this.hunter.skills.drive,
        firearms: this.hunter.skills.firearms,
        melee: this.hunter.skills.melee,
        larceny: this.hunter.skills.larceny,
        stealth: this.hunter.skills.stealth,
        survival: this.hunter.skills.survival,
        animalken: this.hunter.skills.animalken,
        etiquette: this.hunter.skills.etiquette,
        insight: this.hunter.skills.insight,
        intimidation: this.hunter.skills.intimidation,
        leadership: this.hunter.skills.leadership,
        performance: this.hunter.skills.performance,
        persuasion: this.hunter.skills.persuasion,
        streetwise: this.hunter.skills.streetwise,
        subterfuge: this.hunter.skills.subterfuge,
        academics: this.hunter.skills.academics,
        awareness: this.hunter.skills.awareness,
        finance: this.hunter.skills.finance,
        investigation: this.hunter.skills.investigation,
        medicine: this.hunter.skills.medicine,
        occult: this.hunter.skills.occult,
        politics: this.hunter.skills.politics,
        science: this.hunter.skills.science,
        technology: this.hunter.skills.technology,
      },
      trueSkills: {
        athletics: this.hunter.skills.athletics,
        brawl: this.hunter.skills.brawl,
        craft: this.hunter.skills.craft,
        drive: this.hunter.skills.drive,
        firearms: this.hunter.skills.firearms,
        melee: this.hunter.skills.melee,
        larceny: this.hunter.skills.larceny,
        stealth: this.hunter.skills.stealth,
        survival: this.hunter.skills.survival,
        animalken: this.hunter.skills.animalken,
        etiquette: this.hunter.skills.etiquette,
        insight: this.hunter.skills.insight,
        intimidation: this.hunter.skills.intimidation,
        leadership: this.hunter.skills.leadership,
        performance: this.hunter.skills.performance,
        persuasion: this.hunter.skills.persuasion,
        streetwise: this.hunter.skills.streetwise,
        subterfuge: this.hunter.skills.subterfuge,
        academics: this.hunter.skills.academics,
        awareness: this.hunter.skills.awareness,
        finance: this.hunter.skills.finance,
        investigation: this.hunter.skills.investigation,
        medicine: this.hunter.skills.medicine,
        occult: this.hunter.skills.occult,
        politics: this.hunter.skills.politics,
        science: this.hunter.skills.science,
        technology: this.hunter.skills.technology,
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
      specialties: this.hunter.specialties,
      specialtiesFromXp: [],
      cell: this.hunter.cell,
      desire: this.hunter.desire,
      concept: this.hunter.concept,
      touchstones: this.hunter.touchstones,
      xp: this.hunter.xp,
      spentXp: 0,
      skillsDone: true,
      edgeDone: true,
      saving: false,
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
        cell: this.cell,
        concept: this.concept,
        ambition: this.ambition,
        desire: this.desire,
        chronicle: this.chronicle,
        health: this.stamina + 3,
        edgeArr: this.edgeArr,
        willpower: this.composure + this.resolve,
        xp: this.xp,
        spentXp: this.spentXp,
        drive: this.drive,
        redemption: this.redemption,
        creed: this.creed,
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
        .put(baseUrl + "/hunters/hunter/edit/" + this.hunter.id, character, {
          withCredentials: true,
        })
        .then((res) => {
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Hunter updated!",
          });
          this.$router.push({
            name: "hunter5eView",
            params: { id: this.hunter.id },
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
    edges() {
      this.$q
        .dialog({
          component: edgeComponent,
          persistent: true,
          componentProps: {
            info: {
              edgeArr: this.edgeArr,
              edgeDist: this.edgeDist,
              edgeDone: this.edgeDone,
            },
          },
        })
        .onOk((data) => {
          this.edgeArr = data.edgeArr;
          this.edgeDist = data.edgeDist;
          this.edgeDone = data.edgeDone;
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
              edgeArr: this.edgeArr,
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
          data.attributes.value.forEach((attribute) => {
            this[attribute.name.toLowerCase()] = attribute.points;
          });
          this.edgeArr = data.edgeArr;
          this.flaws = this.flaws + data.flaws_remaining.value;
        });
    },

    finalSpecialties() {
      let specialties = [];
      specialties = this.specialties.concat(this.specialtiesFromXp);

      return specialties;
    },

    saveGuard() {
      //primary sections
      if (!this.skillsDone || !this.attributesDone || !this.edgeDone) {
        this.disableBlurb =
          "Please complete the base attributes, skills sections and edges/perks.";
        return true;
      }
      //Touchstones
      if (this.touchstones < 1 || this.touchstones.length > 3) {
        this.disableBlurb = "Must have between 1-3 touchstones.";
        return true;
      }
      //Core Concept
      if (
        !this.charName ||
        !this.concept ||
        !this.ambition ||
        !this.desire ||
        !this.cell ||
        !this.chronicle ||
        !this.drive ||
        !this.creed
      ) {
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
};
</script>
