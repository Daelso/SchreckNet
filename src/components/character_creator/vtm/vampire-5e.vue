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
            <div>Skills Done: {{ skillsDone }}</div>
            <div>Attributes Done: {{ attributesDone }}</div>
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
                <q-card-section class="backgroundDefault">
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
                  <div v-for="(skill, key) in skillInfo.skills" :key="key">
                    {{ skill }}: {{ this.trueSkills[skill.toLowerCase()] }}/5
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
              icon="app:ankh"
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
                    <div v-if="discipline > 0">{{ key }}: {{ discipline }}</div>
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
              caption="View current advantages, flaws, backgrounds, havens and loresheets"
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
          <q-btn flat label="Save Character" type="submit" color="white" />
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
          <q-item clickable @click="clanSelected">
            <q-tooltip
              v-if="!this.skillsDone || !this.attributesDone"
              class="bg-dark text-body2"
              >Please set valid base attributes and skills</q-tooltip
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
          <q-item :disable="!this.skillsDone || !this.attributesDone" clickable>
            <q-tooltip
              v-if="!this.skillsDone || !this.attributesDone"
              class="bg-dark text-body2"
              >Please set valid base attributes and skills</q-tooltip
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
        v-model:disciplines="disciplines"
        v-model:clanBane="clanBane"
        :specials="this.specialties"
        :fullSkills="this.trueSkills"
        :specialtiesFromPred="this.specialtiesFromPred"
        :age="this.age"
        :clan="this.clan"
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
@media only screen and (max-width: 600px) {
  .select {
    width: 300px;
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
import attributes from "../vtm/5eAttributes.vue";
import skills from "../vtm/5eSkills.vue";
import attributeInfo from "../vtm/5eAttributes.json";
import skillInfo from "../vtm/5eSkills.json";

export default {
  components: {
    tabs,
  },
  setup() {
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
              tooltips: this.tooltips,
              xp: this.xp,
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
          this.advantages = this.baseAdvantages + data.advantages.value;
          this.flaws = this.baseFlaws + data.flaws.value;
          this.disciplineSkills = data.discSkillsSelected;
          this.predatorType = data.predatorType;
          this.specialtiesFromPred = data.specialtiesFromPred;
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
    addModifiers() {
      this.charisma = this.baseCharisma + 1;
      this.composure = this.baseComposure + 1;
      this.dexterity = this.baseDexterity + 1;
      this.intelligence = this.baseIntelligence + 1;
      this.manipulation = this.baseManipulation + 1;
      this.resolve = this.baseResolve + 1;
      this.stamina = this.baseStamina + 1;
      this.strength = this.baseStrength + 1;
      this.wits = this.baseWits + 1;
    },

    finalSpecialties() {
      let specialties = this.specialties.concat(this.specialtiesFromPred);
      return specialties;
    },
  },
};
</script>
