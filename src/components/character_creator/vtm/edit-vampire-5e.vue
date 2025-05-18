<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <div
    v-if="
      !this.pageFound ||
      !this.currentUser ||
      this.currentUser.id !== this.kindred.created_by
    "
  >
    <notFound />
  </div>
  <div class="q-gutter-md" style="max-width: 880px">
    <div class="q-pa-md row justify-center text-center">
      <q-banner class="bg-primary text-white" rounded dark>
        <div class="container">
          <p>Vampire: the Masquerade</p>
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
            <div>Name: {{ charName }}</div>
            <div>
              Clan: {{ clan }} {{ this.altBane ? "(Alternate Bane)" : "" }}
            </div>

            <div>Sect: {{ sect }}</div>
            <div>
              Age: {{ age.label }}
              {{ this.altAncilla ? "(Alternate Rules)" : "" }}
            </div>
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
          <div class="stats q-my-sm">
            <div>Health: {{ stamina + 3 }}</div>
            <div>Willpower: {{ composure + resolve }}</div>
            <div class="q-my-sm">
              Potency: {{ generation.potency }}/{{ generation.maxPotency }}
            </div>
            <div class="flex flex-center">
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
            <div>Remaining XP: {{ xp }}</div>
            <div class="flex flex-center">
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
                    <div v-if="key !== 'Caitiff'">
                      {{ key }}: {{ discipline }}
                    </div>
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
            flat
            label="Update Character"
            type="submit"
            color="white"
            :disable="this.saveGuard()"
            @click="onSubmit()"
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
            @click="confirmClanSelect()"
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
        <q-input color="red" dark type="number" v-model="xp" label="Set XP">
          <template v-slot:prepend>
            <q-icon name="app:ankh" />
          </template>
        </q-input>

        <q-select
          v-model="humanity"
          :options="humanityOptions"
          label="Set Humanity"
          label-color="primary"
          bg-color="grey-3"
          filled
          color="secondary"
          style="width: 50%; margin: auto; padding: 10px"
          popup-content-style="background-color:#222831; color:white"
        />
      </q-card>
      <tabs
        v-model:charName="charName"
        v-model:concept="concept"
        v-model:ambition="ambition"
        v-model:desire="desire"
        v-model:convictions="convictions"
        v-model:touchstones="touchstones"
        v-model:archetype="archtypeModel"
        v-model:sect="sect"
        v-model:chronicle="chronicle"
        v-model:specialtiePoints="totalSpecialty"
        v-model:advantagePoints="advantages"
        v-model:flawPoints="flaws"
        v-model:sire="sire"
        v-model:advantagesObj="advantagesObj"
        v-model:cult="cult"
        v-model:imgLink="imgLink"
        v-model:tab="tab"
        v-model:disciplines="disciplines"
        v-model:disciplineSkills="this.disciplineSkills"
        v-model:clanBane="clanBane"
        v-model:thinAdvantages="thinAdvantages"
        v-model:thinFlaws="thinFlaws"
        v-model:xp="this.xp"
        v-model:specialties="this.specialties"
        :discDone="this.disciplinesDone"
        :fullSkills="this.trueSkills"
        :specialtiesFromPred="this.specialtiesFromPred"
        :age="this.age"
        :clan="this.clan"
        :debug="this.debug"
        :edit="this.edit"
      />
    </div>
  </div>
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
.hover-zoom:hover {
  transform: scale(1.5);
  cursor: pointer;
}
.zoomed {
  transform: scale(1.5);
  z-index: 10;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}
</style>

<script>
import { ref } from "vue";
import clanSelect from "./5eClanSelect.vue";
import tabs from "./tabs.vue";
import spendXp from "./spendXp.vue";
import attributes from "./5eAttributes.vue";
import skills from "./5eSkills.vue";
import attributeInfo from "../vtm/5eAttributes.json";
import skillInfo from "../vtm/5eSkills.json";
import { useMeta } from "quasar";
import nosImage from "../../../assets/images/Nosfer_logo.png";

import notFound from "../../../pages/ErrorNotFound.vue";

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
    notFound,
  },
  async setup() {
    const axios = require("axios");
    useMeta(metaData);

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    let pageFound = ref(false);

    const kindredId = ref(window.location.href.split("/")[6]);

    const kindred = await axios
      .get(baseUrl + "/vampires/vampire/" + kindredId.value, {
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
      kindred: ref(kindred),
      currentUser: ref(currentUser),
      edit: ref(true),
    };
  },
  data() {
    return {
      zoomed: false,
      debug: false,
      saving: false,
      imgLink: this.kindred.image_link,
      advantagesObj: this.kindred.advantages,
      attributesDone: true,
      attributeInfo,
      altBane: this.kindred.alt_bane,
      skillInfo,
      nosImage,
      humanityOptions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      age: { label: this.kindred.age, bonusXp: 0 },
      archtypeModel: this.kindred.archetype,
      altAncilla: this.kindred.alt_ancilla,
      ambition: this.kindred.ambition,
      attributePoints: 0,
      skillPoints: 0,
      charName: this.kindred.charName,
      cult: this.kindred.cult,
      disableBlurb: "",
      baseCharisma: this.kindred.attributes.charisma,
      baseComposure: this.kindred.attributes.composure,
      baseDexterity: this.kindred.attributes.dexterity,
      baseIntelligence: this.kindred.attributes.intelligence,
      baseManipulation: this.kindred.attributes.manipulation,
      baseResolve: this.kindred.attributes.resolve,
      baseStamina: this.kindred.attributes.stamina,
      baseStrength: this.kindred.attributes.strength,
      baseWits: this.kindred.attributes.wits,
      gainedPoints: 0,
      baseSpecialties: 1,
      gainedSpecialties: 0,
      totalSpecialty: this.kindred.remaining_specialties,
      disciplinesDone: true,
      charisma: this.kindred.attributes.charisma,
      composure: this.kindred.attributes.composure,
      dexterity: this.kindred.attributes.dexterity,
      intelligence: this.kindred.attributes.intelligence,
      manipulation: this.kindred.attributes.manipulation,
      resolve: this.kindred.attributes.resolve,
      stamina: this.kindred.attributes.stamina,
      strength: this.kindred.attributes.strength,
      wits: this.kindred.attributes.wits,
      baseFlaws: 2,
      baseAdvantages: 7,
      flaws: this.kindred.flaws_remaining,
      advantages: this.kindred.advantages_remaining,
      thinAdvantages: 0,
      thinFlaws: 0,
      chronicle: this.kindred.chronicle,
      convictions: this.kindred.convictions,
      disciplineSkills: this.kindred.discipline_skills,
      baseSkills: {
        athletics: this.kindred.skills.athletics,
        brawl: this.kindred.skills.brawl,
        craft: this.kindred.skills.craft,
        drive: this.kindred.skills.drive,
        firearms: this.kindred.skills.firearms,
        melee: this.kindred.skills.melee,
        larceny: this.kindred.skills.larceny,
        stealth: this.kindred.skills.stealth,
        survival: this.kindred.skills.survival,
        animalken: this.kindred.skills.animalken,
        etiquette: this.kindred.skills.etiquette,
        insight: this.kindred.skills.insight,
        intimidation: this.kindred.skills.intimidation,
        leadership: this.kindred.skills.leadership,
        performance: this.kindred.skills.performance,
        persuasion: this.kindred.skills.persuasion,
        streetwise: this.kindred.skills.streetwise,
        subterfuge: this.kindred.skills.subterfuge,
        academics: this.kindred.skills.academics,
        awareness: this.kindred.skills.awareness,
        finance: this.kindred.skills.finance,
        investigation: this.kindred.skills.investigation,
        medicine: this.kindred.skills.medicine,
        occult: this.kindred.skills.occult,
        politics: this.kindred.skills.politics,
        science: this.kindred.skills.science,
        technology: this.kindred.skills.technology,
      },
      trueSkills: {
        athletics: this.kindred.skills.athletics,
        brawl: this.kindred.skills.brawl,
        craft: this.kindred.skills.craft,
        drive: this.kindred.skills.drive,
        firearms: this.kindred.skills.firearms,
        melee: this.kindred.skills.melee,
        larceny: this.kindred.skills.larceny,
        stealth: this.kindred.skills.stealth,
        survival: this.kindred.skills.survival,
        animalken: this.kindred.skills.animalken,
        etiquette: this.kindred.skills.etiquette,
        insight: this.kindred.skills.insight,
        intimidation: this.kindred.skills.intimidation,
        leadership: this.kindred.skills.leadership,
        performance: this.kindred.skills.performance,
        persuasion: this.kindred.skills.persuasion,
        streetwise: this.kindred.skills.streetwise,
        subterfuge: this.kindred.skills.subterfuge,
        academics: this.kindred.skills.academics,
        awareness: this.kindred.skills.awareness,
        finance: this.kindred.skills.finance,
        investigation: this.kindred.skills.investigation,
        medicine: this.kindred.skills.medicine,
        occult: this.kindred.skills.occult,
        politics: this.kindred.skills.politics,
        science: this.kindred.skills.science,
        technology: this.kindred.skills.technology,
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
      predatorType: this.kindred.predator_type,
      specialties: this.kindred.specialties,
      specialtiesFromPred: [],
      specialtiesFromXp: [],
      clan: this.kindred.clan,
      clanBane: ref(
        "Violent Temper: Subtract dice equal to the Bane Severity of the Brujah from any roll to resist fury frenzy. This cannot take the pool below one die (V5 Corebook p.67)"
      ),
      clanDesc: ref(
        "The 'Rabble' rebel against power and rage against tyranny."
      ),
      clanCompulsion: ref(
        "Rebellion: the vampire takes a stand against whatever or whomever they see as the status quo in the situation, whether that is their leader, a viewpoint expressed by a potential vessel, or just the task they were supposed to do at the moment. Until they have gone against their orders or expectations, perceived or real, the vampire receives a two dice penalty to all rolls. This Compulsion ends once they have managed to either make someone change their minds (by force if necessary) or done the opposite of what was expected of them. (V5 Corebook p.210)"
      ),
      desire: this.kindred.desire,
      disciplines: this.kindred.disciplines,
      humanity: this.kindred.humanity,
      sect: this.kindred.sect,
      sire: this.kindred.sireName,
      concept: this.kindred.concept,
      generation: {
        label: this.kindred.generation,
        potency: this.kindred.potency,
        maxPotency: this.kindred.max_potency,
      },
      touchstones: this.kindred.touchstones,
      xp: this.kindred.xp,
      skillsDone: true,
      tooltips: ref([
        "Supernatural quickness and reflexes",
        "The Discipline of physical vigor and strength",
        "The ability to attract, sway, and control emotions",
      ]),
    };
  },
  methods: {
    isValidImageUrl(url) {
      try {
        const parsed = new URL(url);
        const allowedHosts = [
          "i.imgur.com",
          "imgur.com",
          "images.unsplash.com",
          "cdn.discordapp.com",
          "media.tenor.com",
        ];
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

      let character = {
        name: this.charName,
        altBane: this.altBane,
        clan: this.clan,
        imgLink: this.imgLink,
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
      this.$api
        .put("/vampires/vampire/edit/" + this.kindred.id, character, {
          withCredentials: true,
        })
        .then((res) => {
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Kindred updated!",
          });
          this.$router.push({
            name: "vampire5eView",
            params: { id: this.kindred.id },
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

    confirmClanSelect() {
      this.$q
        .dialog({
          title: "Warning",
          dark: true,
          color: "red",
          message:
            "Opening this menu will reset your clan and discipline selections!",
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          try {
            this.clanSelected();
          } catch (err) {
            this.$q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: "Failed to open! Try again later!",
            });
            console.log(err);
            return;
          }

          return;
        })
        .onCancel(() => {
          return;
        });
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
              altBane: this.altBane,
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
          this.altBane = data.altBane;
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
              edit: this.edit,
              flaws_remaining: this.flaws,
            },
          },
        })
        .onOk((data) => {
          this.xp = data.xp;
          this.flaws = this.flaws + data.flaws_remaining.value;
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
      return this.kindred.specialties;
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
