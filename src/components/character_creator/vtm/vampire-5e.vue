<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <q-form @submit="onSubmit" class="q-gutter-md" style="max-width: 880px">
    <div class="q-pa-md row justify-center text-center">
      <q-banner class="bg-primary text-white" rounded dark>
        <div class="container">
          Vampire: The Masquerade
          <div class="info q-my-sm">
            <div>Name: {{ charName }}</div>
            <div>Clan: {{ clan }}</div>
            <div>Sect: {{ sect }}</div>
            <div>Age: {{ age.label }}</div>
            <div>Generation: {{ generation.label }}</div>
            <div>Predator Type: {{ predatorType }}</div>
            <div>Humanity: {{ humanity }}</div>
            <div>Chronicle: {{ chronicle }}</div>
            <div>Concept: {{ !concept ? "None" : concept }}</div>
            <div>Specialties: {{ this.totalSpecialty }}</div>
            <div>Sire: {{ sire }}</div>
            <div>Cult: {{ cult }}</div>
          </div>
          <q-separator class="q-my-md" />
          <div class="stats">
            <div>Health: {{ stamina + 3 }}</div>
            <div>Willpower: {{ composure + resolve }}</div>
            <div>
              Potency: {{ generation.potency }}/{{ generation.maxPotency }}
            </div>
            <div>Advantage Dots Remaining: {{ advantages }}</div>
            <div>Remaining XP: {{ xp }}</div>
            <div>Flaw Dots Remaining: {{ flaws }}</div>
          </div>
          <q-separator class="q-my-md" />

          <div class="concept">
            <div>Archetype: {{ !archtypeModel ? "None" : archtypeModel }}</div>
            <div>Ambition: {{ !ambition ? "None" : ambition }}</div>
            <div>Desire: {{ !desire ? "None" : desire }}</div>
          </div>
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
              icon="app:whiteankh"
              label="Disciplines"
              caption="View disciplines and powers"
              dark
            >
              <q-card>
                <q-card-section class="backgroundDefault">
                  Disciplines:
                  <div v-if="Object.keys(disciplines).length === 0">
                    Not yet selected
                  </div>
                  <div v-for="(discipline, key) in disciplines" :key="key">
                    <div>{{ key }}: {{ discipline }}</div>
                  </div>
                  <br />
                  Powers:
                  <div v-if="Object.keys(disciplineSkills).length === 0">
                    Not yet selected
                  </div>

                  <div v-for="(discipline, key) in disciplineSkills" :key="key">
                    {{ discipline.discipline }}: {{ discipline.skill }}
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              icon="military_tech"
              label="Advantages/Flaws"
              caption="View current advantages, flaws, backgrounds, havens, and loresheets"
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
                    <div style="font-size: larger">Haven:</div>
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
                    <div style="font-size: larger">Loresheets:</div>
                    <br />
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
                    Flaws:
                    <div
                      class="q-my-sm"
                      v-if="advantagesObj.loresheets.flaws.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="flaw in advantagesObj.loresheets.flaws"
                      :key="flaw.name"
                    >
                      <div>{{ flaw.name }} - {{ flaw.cost }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              icon="settings_accessibility"
              label="Touchstones and Convictions"
              caption="Review who your kindred really is"
              dark
            >
              <q-card>
                <q-card-section class="backgroundDefault">
                  Convictions
                  <div v-if="convictions.length < 1">None</div>
                  <div v-for="(conviction, key) in convictions" :key="key">
                    {{ conviction }}
                  </div>
                </q-card-section>
              </q-card>
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
          <q-item
            :disable="
              (!this.skillsDone || !this.attributesDone) && this.debug !== true
            "
            clickable
            @click="clanSelected"
          >
            <q-tooltip
              v-if="!this.skillsDone || !this.attributesDone"
              class="bg-dark text-body2"
              >Please set valid base attributes and skills.</q-tooltip
            >
            <q-item-section avatar>
              <q-icon color="primary" name="app:ankh" style="scale: 170%" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Clan/Coterie</q-item-label>
              <q-item-label caption class="text-white"
                >Manage things like clan, disciplines and coterie</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item
            clickable
            @click="spendXp"
            :disable="
              (!this.skillsDone ||
                !this.attributesDone ||
                !this.disciplinesDone) &&
              this.debug !== true
            "
          >
            <q-tooltip
              v-if="
                !this.skillsDone ||
                !this.attributesDone ||
                !this.disciplinesDone
              "
              class="bg-dark text-body2"
              >Please set valid base attributes, skills and complete your
              clan/discipline section.</q-tooltip
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
        @charName="handleCharName($event)"
        @concept="handleConcept($event)"
        @ambition="handleAmbition($event)"
        @desire="handleDesire($event)"
        @convictions="handleConvictions($event)"
        @touchstones="handleTouchstones($event)"
        @archetype="handleArchetype($event)"
        @sect="handleSect($event)"
        @chronicle="handleChronicle($event)"
        @specialties="handleSpecialties($event)"
        v-model:specialtiePoints="totalSpecialty"
        v-model:advantagePoints="advantages"
        v-model:flawPoints="flaws"
        v-model:sire="sire"
        v-model:advantagesObj="advantagesObj"
        v-model:cult="cult"
        v-model:tab="tab"
        v-model:disciplines="disciplines"
        v-model:disciplineSkills="this.disciplineSkills"
        v-model:clanBane="clanBane"
        v-model:thinAdvantages="thinAdvantages"
        v-model:thinFlaws="thinFlaws"
        :discDone="this.disciplinesDone"
        :specials="this.specialties"
        :fullSkills="this.trueSkills"
        :specialtiesFromPred="this.specialtiesFromPred"
        :age="this.age"
        :clan="this.clan"
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
  display: grid;
  gap: 3px;
  grid-template-columns: repeat(3, 1fr);
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
}

.concept {
  display: grid;
  gap: 3px;
  grid-template-columns: repeat(3, 1fr);
}
</style>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import clanSelect from "../vtm/5eClanSelect.vue";
import tabs from "../vtm/tabs.vue";
import spendXp from "../vtm/spendXp.vue";
import attributes from "../vtm/5eAttributes.vue";
import skills from "../vtm/5eSkills.vue";
import attributeInfo from "../vtm/5eAttributes.json";
import skillInfo from "../vtm/5eSkills.json";
import { useMeta } from "quasar";

const metaData = {
  title: "SchreckNet",
  titleTemplate: (title) => `${title} - VtM 5e Creator`,

  // meta tags
  meta: {
    keywords: {
      name: "keywords",
      content:
        "vtm, character creator, vtm5e, vampire the masquerade, schrecknet, WoD, world of darkness",
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
      debug: false,
      saving: false,
      advantagesObj: {
        merits: { advantages: [], flaws: [] },
        backgrounds: { advantages: [], flaws: [] },
        haven: { advantages: [], flaws: [] },
        loresheets: { advantages: [], flaws: [] },
      },
      attributesDone: false,
      attributeInfo,
      skillInfo,
      age: { label: "Childer", bonusXp: 0 },
      archtypeModel: ref(null),
      ambition: "",
      attributePoints: 22,
      skillPoints: 29,
      charName: "",
      cult: "None",
      disableBlurb: "",
      baseCharisma: 0,
      baseComposure: 0,
      baseDexterity: 0,
      baseIntelligence: 0,
      baseManipulation: 0,
      baseResolve: 0,
      baseStamina: 0,
      baseStrength: 0,
      baseWits: 0,
      gainedPoints: 0,
      baseSpecialties: 1,
      gainedSpecialties: 0,
      totalSpecialty: 1,
      disciplinesDone: false,
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
      thinAdvantages: 0,
      thinFlaws: 0,
      chronicle: "",
      convictions: [],
      disciplineSkills: [],
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
      predatorType: "Alleycat",
      specialties: [],
      specialtiesFromPred: [],
      specialtiesFromXp: [],
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
      skillsDone: false,
      tooltips: ref([
        "Supernatural quickness and reflexes",
        "The Discipline of physical vigor and strength",
        "The ability to attract, sway, and control emotions",
      ]),
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
        return;
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
        clan: this.clan,
        concept: this.concept,
        ambition: this.ambition,
        desire: this.desire,
        archetype: this.archtypeModel,
        sect: this.sect,
        cult: this.cult,
        chronicle: this.chronicle,
        age: this.age.label,
        generation: this.generation.label,
        predatorType: this.predatorType,
        health: this.stamina + 3,
        humanity: this.humanity,
        willpower: this.composure + this.resolve,
        potency: this.generation.potency,
        maxPotency: this.generation.maxPotency,
        sireName: this.sire,
        xp: this.xp,
        convictions: this.convictions,
        touchstones: this.touchstones,
        disciplines: this.disciplines,
        disciplineSkills: this.disciplineSkills,
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
        .post(baseUrl + "/vampires/new", character, {
          withCredentials: true,
        })
        .then((res) => {
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Kindred created!",
          });
          this.$router.push({
            name: "vampire5eView",
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
      this.saving = false;
      this.$q.loading.hide();
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
    handleArchetype(data) {
      this.archtypeModel = data;
    },
    handleSect(data) {
      this.sect = data;
    },
    handleChronicle(data) {
      this.chronicle = data;
    },
    handleSpecialties(data) {
      this.specialties = data;
    },

    clanSelected() {
      this.$q
        .dialog({
          component: clanSelect,
          persistent: true,
          componentProps: {
            info: {
              age: this.age,
              bane: this.clanBane,
              clan: this.clan,
              compulsion: this.compulsion,
              desc: this.clanDesc,
              disciplines: this.disciplines,
              discSkills: this.disciplineSkills,
              generation: this.generation,
              humanity: this.humanity,
              predatorType: this.predatorType,
              thinAdvantages: this.thinAdvantages,
              thinFlaws: this.thinFlaws,
              tooltips: this.tooltips,
              xp: this.xp,
              disciplinesDone: this.disciplinesDone,
              merits: this.advantagesObj,
            },
          },
        })
        .onOk((data) => {
          this.age = data.age;
          this.clan = data.clan;
          this.clanBane = data.bane;
          this.disciplines = data.disciplines;
          this.tooltips = data.tooltips;
          this.clanDesc = data.desc;
          this.compulsion = data.compulsion;
          this.generation = data.generation;
          this.humanity = data.humanity;
          this.xp = data.xp;
          this.advantages = data.advantages;
          this.flaws = data.flaws;
          this.disciplineSkills = data.discSkillsSelected;
          this.predatorType = data.predatorType;
          this.specialtiesFromPred = data.specialtiesFromPred;
          this.disciplinesDone = data.disciplinesDone;
          this.advantagesObj = data.merits;
          this.thinAdvantages = data.thinAdvantages;
          this.thinFlaws = data.thinFlaws;
        });
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
              charisma: this.baseCharisma,
              composure: this.baseComposure,
              dexterity: this.baseDexterity,
              intelligence: this.baseIntelligence,
              manipulation: this.baseManipulation,
              resolve: this.baseResolve,
              stamina: this.baseStamina,
              strength: this.baseStrength,
              wits: this.baseWits,
              xp: this.xp,
            },
          },
        })
        .onOk((data) => {
          this.attributesDone = data.attributesDone;
          this.attributePoints = data.attributePoints;
          this.baseCharisma = data.charisma;
          this.baseComposure = data.composure;
          this.baseDexterity = data.dexterity;
          this.baseIntelligence = data.intelligence;
          this.baseManipulation = data.manipulation;
          this.baseResolve = data.resolve;
          this.baseStamina = data.stamina;
          this.baseStrength = data.strength;
          this.baseWits = data.wits;
          this.xp = data.xp;
          this.addModifiers();
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
              cult: this.cult,
              clan: this.clan,
              disciplines: this.disciplines,
              disciplineSkills: this.disciplineSkills,
              skills: this.trueSkills,
              specialtiesFromXp: this.specialtiesFromXp,
              potency: this.generation.potency,
              xp: this.xp,
            },
          },
        })
        .onOk((data) => {
          this.xp = data.xp;
          this.advantages = this.advantages + data.advantages.value;
          this.generation.potency = data.potency;
          this.disciplines = data.disciplines;
          this.disciplineSkills = data.disciplineSkillsObj;
          this.specialtiesFromXp = data.specialtiesFromXp;
          this.trueSkills = data.skills;
          data.attributes.value.forEach((attribute) => {
            this[attribute.name.toLowerCase()] = attribute.points;
          });
        });
    },
    addModifiers() {
      this.charisma = this.baseCharisma;
      this.composure = this.baseComposure;
      this.dexterity = this.baseDexterity;
      this.intelligence = this.baseIntelligence;
      this.manipulation = this.baseManipulation;
      this.resolve = this.baseResolve;
      this.stamina = this.baseStamina;
      this.strength = this.baseStrength;
      this.wits = this.baseWits;
    },

    finalSpecialties() {
      let specialties = [];
      specialties = this.specialties.concat(
        this.specialtiesFromPred,
        this.specialtiesFromXp
      );

      return specialties;
    },

    saveGuard() {
      //primary sections
      if (!this.skillsDone || !this.attributesDone || !this.disciplinesDone) {
        this.disableBlurb =
          "Please complete the base attributes, skills and disciplines sections.";
        return true;
      }
      //Touchstones/convictions
      if (
        this.convictions.length < 1 ||
        this.touchstones < 1 ||
        this.touchstones.length !== this.convictions.length
      ) {
        this.disableBlurb =
          "Must between 1-3 convictions/touchstones, they also must be equal.";
        return true;
      }
      //Core Concept
      if (
        !this.charName ||
        !this.concept ||
        !this.ambition ||
        !this.desire ||
        !this.archtypeModel ||
        !this.sect ||
        !this.chronicle
      ) {
        this.disableBlurb =
          "Please complete all * fields in the core concept tab.";
        return true;
      }

      if (
        this.clan === "Thin-Blood" &&
        this.thinAdvantages !== this.thinFlaws
      ) {
        this.disableBlurb =
          "Thin-Bloods must have an equal amount of thin-blood merits and flaws.";
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
};
</script>
