<template>
  <div v-if="!this.pageFound">
    <notfound />
  </div>
  <div v-if="this.pageFound" class="q-pa-md row justify-center text-center">
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
                <div v-for="(skill, key) in skillInfo.skills.sort()" :key="key">
                  {{ skill }}: {{ this.trueSkills[skill.toLowerCase()] }}/5
                </div>
                <q-separator />
                <br />
                Specialties:
                <div v-if="finalSpecialties().length < 1">None yet</div>
                <div v-for="(specialty, key) in finalSpecialties()" :key="key">
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
        <q-btn flat label="Export to PDF" type="submit" color="white" />
      </template>
    </q-banner>
  </div>
</template>

<style scoped></style>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import notfound from "../../../pages/ErrorNotFound.vue";

import { ref } from "vue";

export default defineComponent({
  name: "kindred-view",
  components: { notfound },

  async setup() {
    const axios = require("axios");
    const router = useRouter();
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

    console.log(kindred);
    return {
      pageFound,
    };
  },
  data() {
    return {};
  },
  methods: {},
});
</script>
