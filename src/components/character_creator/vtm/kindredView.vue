<template>
  <div v-if="!this.pageFound">
    <notfound />
  </div>
  <div
    v-if="this.pageFound"
    class="q-pa-md row justify-center text-center"
    style="max-width: 900px"
  >
    <q-banner class="bg-primary text-white" rounded dark>
      <div class="container">
        Vampire: The Masquerade
        <div class="info q-my-sm">
          <div>Name: {{ charName }}</div>
          <div>Clan: {{ clan }}</div>
          <div>Sect: {{ sect }}</div>
          <div>Age: {{ age }}</div>
          <div>Generation: {{ generation }}</div>
          <div>Predator Type: {{ predatorType }}</div>
          <div>Humanity: {{ humanity }}</div>
          <div>Chronicle: {{ chronicle }}</div>
          <div>Specialties: {{ this.remaining_specialties }}</div>
          <div>Archetype: {{ !archetypeModel ? "None" : archetypeModel }}</div>

          <div>Sire: {{ sire }}</div>
          <div>Cult: {{ cult }}</div>
        </div>
        <q-separator class="q-my-md" />
        <div class="stats">
          <div>Health: {{ attributes.stamina + 3 }}</div>
          <div>Willpower: {{ attributes.composure + attributes.resolve }}</div>
          <div>Potency: {{ potency }}/{{ maxPotency }}</div>
          <div>Advantage Dots Remaining: {{ advantages }}</div>
          <div>Remaining XP: {{ xp }}</div>
          <div>Flaw Dots Remaining: {{ flaws }}</div>
        </div>
        <q-separator class="q-my-md" />

        <div class="concept">
          <div>Concept: {{ !concept ? "None" : concept }}</div>

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
                  {{ attribute }}:
                  {{ this.attributes[attribute.toLowerCase()] }}/5
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
                <div v-for="(skill, key) in skillInfo.skills.sort()" :key="key">
                  {{ skill }}: {{ this.trueSkills[skill.toLowerCase()] }}/5
                </div>
                <q-separator />
                <br />
                Specialties:
                <div v-if="specialties.length < 1">None yet</div>
                <div v-for="(specialty, key) in specialties" :key="key">
                  Skill:
                  {{
                    specialty.skill[0].toUpperCase() + specialty.skill.slice(1)
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
        <div class="q-mr-lg">Created by: {{ this.createdBy() }}</div>
        <q-btn flat label="Export to PDF" type="submit" color="white" />
      </template>
    </q-banner>
  </div>
</template>

<style scoped>
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
import { defineComponent } from "vue";
import attributeInfo from "../vtm/5eAttributes.json";
import skillInfo from "../vtm/5eSkills.json";

import notfound from "../../../pages/ErrorNotFound.vue";

import { ref } from "vue";

export default defineComponent({
  name: "kindred-view",
  components: { notfound },

  async setup() {
    const axios = require("axios");
    let pageFound = ref(false);

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }
    let kindredId = window.location.href.split("/")[5];

    let kindred = await axios
      .get(baseUrl + "/vampires/vampire/" + kindredId, {
        withCredentials: true,
      })
      .then((resp) => {
        pageFound.value = true;
        return resp.data;
      })
      .catch((err) => {
        console.log(err);
      });
    return {
      attributeInfo,
      skillInfo,
      charName: kindred.charName,
      clan: kindred.clan,
      advantagesObj: kindred.advantages,
      advantages: kindred.advantages_remaining,
      age: kindred.age,
      created_by: kindred.created_by,
      ambition: kindred.ambition,
      archetypeModel: kindred.archetype,
      attributes: kindred.attributes,
      chronicle: kindred.chronicle,
      concept: kindred.concept,
      convictions: kindred.convictions,
      cult: kindred.cult,
      desire: kindred.desire,
      disciplineSkills: kindred.discipline_skills,
      disciplines: kindred.disciplines,
      humanity: kindred.humanity,
      flaws: kindred.flaws_remaining,
      generation: kindred.generation,
      trueSkills: kindred.skills,
      specialties: kindred.specialties,
      touchstones: kindred.touchstones,
      sire: kindred.sireName,
      sect: kindred.sect,
      xp: kindred.xp,
      potency: kindred.potency,
      maxPotency: kindred.max_potency,
      predatorType: kindred.predator_type,
      remaining_specialties: kindred.remaining_specialties,
      pageFound,
    };
  },
  data() {
    return {};
  },
  methods: {
    async createdBy() {
      let creator = await this.$axios
        .get(baseUrl + "/user/getUser/" + this.created_by, {
          withCredentials: true,
        })
        .then((resp) => {
          console.log(resp.data);
          return resp.data;
        })
        .catch((err) => {
          console.log(err);
        });
      return "Jeff";
    },
  },
});
</script>
