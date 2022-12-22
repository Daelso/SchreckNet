<template>
  <div v-if="!this.pageFound">
    <notfound />
  </div>
  {{ updateMetaTags() }}
  {{ chunkArrays() }}
  <div
    v-if="this.pageFound"
    class="q-pa-md row justify-center text-center"
    style="max-width: 900px"
  >
    <q-banner class="bg-primary text-white" rounded dark>
      <div class="container">
        Hunter: The Reckoning
        <div class="info q-my-sm">
          <div>Name: {{ hunter.charName ? hunter.charName : "Unknown" }}</div>
          <div>
            Creed: {{ hunter.creed.name ? hunter.creed.name : "Unknown" }}
          </div>
          <div>Cell: {{ hunter.cell ? hunter.cell : "Unknown" }}</div>
        </div>
        <div class="concept q-mt-md">
          <div>Concept: {{ !hunter.concept ? "None" : hunter.concept }}</div>
          <div>Ambition: {{ !hunter.ambition ? "None" : hunter.ambition }}</div>
          <div>Desire: {{ !hunter.desire ? "None" : hunter.desire }}</div>
        </div>
        <div class="q-mt-md">
          <div>Drive: {{ !hunter.drive ? "None" : hunter.drive.name }}</div>
          <div>
            Redemption: {{ !hunter.redemption ? "None" : hunter.redemption }}
          </div>
        </div>
        <q-separator class="q-my-md" />
        <div class="stats q-my-sm">
          <div>Health: {{ hunter.attributes.stamina + 3 }}</div>
          <div>
            Willpower:
            {{ hunter.attributes.composure + hunter.attributes.resolve }}
          </div>
          <div>Advantage Dots Remaining: {{ hunter.advantages_remaining }}</div>
          <div>Flaw Dots Remaining: {{ hunter.flaws_remaining }}</div>
        </div>
        <div style="margin: auto">Remaining XP: {{ hunter.xp }}</div>

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
                  {{ attribute }}:
                  {{ hunter.attributes[attribute.toLowerCase()] }}/5
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
                  <div v-for="(skill, key) in skillInfo.skills" :key="key">
                    {{ skill }}: {{ hunter.skills[skill.toLowerCase()] }}/5
                  </div>
                </div>
                <q-separator />
                <br />
                Specialties:
                <div v-if="hunter.specialties.length < 1">None yet</div>
                <div v-for="(specialty, key) in hunter.specialties" :key="key">
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
            icon="app:whiteHunter"
            label="Edges & Perks"
            caption="View edges and perks"
            dark
          >
            <q-card>
              <q-card-section class="backgroundDefault">
                Edges:
                <div v-if="hunter.edges.edges.length === 0">
                  Not yet selected
                </div>
                <div v-for="(edge, key) in hunter.edges.edges" :key="key">
                  <div>{{ edge.category }} - {{ edge.edge }}</div>
                </div>
                <br />
                Perks:
                <div v-if="hunter.edges.perks.length === 0">
                  Not yet selected
                </div>

                <div v-for="(perk, key) in hunter.edges.perks" :key="key">
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
                    v-if="hunter.advantages.merits.advantages.length === 0"
                  >
                    Not yet selected
                  </div>
                  <div
                    v-for="advantage in hunter.advantages.merits.advantages"
                    :key="advantage.name"
                  >
                    <div>{{ advantage.name }} - {{ advantage.cost }}</div>
                  </div>
                  Flaws:
                  <div
                    class="q-my-sm"
                    v-if="hunter.advantages.merits.flaws.length === 0"
                  >
                    Not yet selected
                  </div>
                  <div
                    v-for="flaw in hunter.advantages.merits.flaws"
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
                      v-if="
                        hunter.advantages.backgrounds.advantages.length === 0
                      "
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="advantage in hunter.advantages.backgrounds
                        .advantages"
                      :key="advantage.name"
                    >
                      <div>{{ advantage.name }} - {{ advantage.cost }}</div>
                    </div>
                    Flaws:
                    <div
                      class="q-my-sm"
                      v-if="hunter.advantages.backgrounds.flaws.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="flaw in hunter.advantages.backgrounds.flaws"
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
                    v-if="hunter.advantages.haven.advantages.length === 0"
                  >
                    Not yet selected
                  </div>
                  <div
                    v-for="advantage in hunter.advantages.haven.advantages"
                    :key="advantage.name"
                  >
                    <div>{{ advantage.name }} - {{ advantage.cost }}</div>
                  </div>
                  Flaws:
                  <div
                    class="q-my-sm"
                    v-if="hunter.advantages.haven.flaws.length === 0"
                  >
                    Not yet selected
                  </div>
                  <div
                    v-for="flaw in hunter.advantages.haven.flaws"
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
                <div v-if="hunter.touchstones.length < 1">None</div>
                <div v-for="(touchstone, key) in hunter.touchstones" :key="key">
                  {{ touchstone }}
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>

      <template v-slot:action>
        <div class="q-mr-lg">
          Created by: {{ creator }}, Favorited:
          {{ this.favCount.count }} time(s)
        </div>
        <q-btn
          flat
          label="Export to PDF"
          @click="this.modifyPdf()"
          type="submit"
          color="white"
        />
        <q-btn
          v-if="
            this.currentUser !== false &&
            this.currentUser.username !== this.creator
          "
          flat
          label="Favorite Character"
          @click="this.favoriteChar(this.hunterId, this.hunter.charName)"
          type="submit"
          color="white"
        />
      </template>
    </q-banner>
    <a
      href="https://renegadegamestudios.com/hunter-the-reckoning-5th-edition-roleplaying-game-fillable-pdf-character-sheet/"
      target="_blank"
      rel="noopener noreferrer"
      class="charSheetBlurb"
      >Sheets Provided by Renegade Game Studios
    </a>
  </div>
</template>

<style scoped>
.q-field__counter {
  color: white;
}

.charSheetBlurb {
  color: white;
  font-style: italic;
  margin-top: 5px;
}
.q-field__bottom {
  color: white;
  margin-bottom: 3px;
}
.backgroundDefault {
  background-color: #171a1e;
}

.info {
  display: grid;
  gap: 8px;
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

.attributes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
  grid-row-gap: 5px;
}

@media only screen and (max-width: 650px) {
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
  .info {
    display: grid;
    gap: 15px;
    grid-template-columns: repeat(3, 1fr);
    font-size: 12px;
  }
  .stats {
    display: grid;
    gap: 15px;
    grid-template-columns: repeat(2, 1fr);
    font-size: 13px;
  }
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
import { degrees, PDFDocument, PDFFont, rgb, StandardFonts } from "pdf-lib";
import notfound from "../../../pages/ErrorNotFound.vue";
import download from "downloadjs";
import charSheet from "raw-loader!./sheetbase64.txt";

import ubuntuFont from "../../../css/fonts/Ubuntu-R.ttf";
import clanBanes from "../vtm/5eClanBanes.json";
import fontkit from "@pdf-lib/fontkit";

import { ref } from "vue";

import { useMeta } from "quasar";

export default defineComponent({
  name: "hunter-view",
  components: { notfound },

  async setup() {
    const siteTitle = ref("SchreckNet");
    const meta = {
      description: {
        name: "description",
        content: "Hunter: The Reckoning 5th Edition Character Generator",
      },
      keywords: {
        name: "keywords",
        content:
          "htr, character creator, htr5e, hunter the reckoning, schrecknet, WoD, world of darkness, w5, werewolf the apocalypse, vtm, vampire the masquerade",
      },
    };

    useMeta(() => {
      return {
        title: siteTitle.value,
        meta,
      };
    });

    function updateMetaTags() {
      siteTitle.value = "SchreckNet - " + this.hunter.charName; // will automatically trigger a Meta update due to the binding
      meta.description.content =
        this.hunter.creed.name +
        `(${hunter.drive})` +
        "Created using SchreckNet, a Hunter: Reckoning character creator.";
    }

    const axios = require("axios");
    let currentUser = ref(false);
    let pageFound = ref(false);

    let creator = ref("Anonymous");

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }
    let hunterId = ref(window.location.href.split("/")[5]);

    let hunter = await axios
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

    console.log(hunter);

    return {
      currentUser,
      hunterId,
      hunter,
      attributeInfo,
      clanBanes,
      skillInfo,
      created_by: hunter.created_by,
      creator,
      pageFound,
      charSheet,
      spentXp: 0,
      baneseverity: 0,
      powerBonus: 0,
      bloodSurge: 0,
      mendAmt: 0,
      rouseAmt: 0,
      feedPenalty: "",
      clanBane: "",
      updateMetaTags,
    };
  },
  async created() {
    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }
    await this.$axios
      .get(baseUrl + "/user/getUser/" + this.created_by, {
        withCredentials: true,
      })
      .then((resp) => {
        this.creator = resp.data.username;
        return resp.data;
      })
      .catch((err) => {
        console.log(err);
      });

    return {};
  },
  data() {
    return {
      capitalize(s) {
        return s[0].toUpperCase() + s.slice(1);
      },
      favCount: 0,
    };
  },
  async mounted() {
    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    this.favCount = await this.$axios
      .get(baseUrl + "/favorites/favCount/" + this.hunterId)
      .then((resp) => {
        return resp.data;
      });
    this.currentUser = await this.$axios
      .get(baseUrl + "/user/currentUser", {
        withCredentials: true,
      })
      .then((resp) => {
        return resp.data;
      });
  },
  methods: {
    async modifyPdf() {
      this.$q.loading.show({
        delay: 400, // ms
      });

      const pdfDoc = await PDFDocument.load(this.charSheet);

      const form = pdfDoc.getForm();

      const ubuntuFontBytes = await fetch(ubuntuFont).then((res) =>
        res.arrayBuffer()
      );

      pdfDoc.registerFontkit(fontkit);
      const supportFont = await pdfDoc.embedFont(ubuntuFontBytes);

      const fields = form.getFields();
      console.log(fields);

      fields.forEach((field) => {
        const type = field.constructor.name;
        const name = field.getName();
        console.log(`${type}: ${name}`);
      });

      // const pdfBytes = await pdfDoc.save();
      // download(
      //   pdfBytes,
      //   `schrecknet_htr5e_${this.hunter.charName}.pdf`,
      //   "application/pdf"
      // );
      this.$q.loading.hide();
    },

    favoriteChar(sheet_id, charName) {
      let baseUrl = "";
      if (window.location.href.includes("localhost")) {
        baseUrl = "http://localhost:5000";
      } else {
        baseUrl = window.location.origin;
      }
      const payload = {
        game_id: 1,
        sheet_id: sheet_id,
      };
      this.$axios
        .post(baseUrl + "/favorites/add", payload, {
          withCredentials: true,
        })
        .then((res) => {
          this.favCount.count++;
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: `Favorited ${this.hunter.charName}`,
          });
        })
        .catch((err) => {
          if (err.response.status === 409) {
            return this.$q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: "You have already favorited this character!",
            });
          }
          this.$q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: err.message,
          });
        });
    },

    chunkArrays() {
      const chunkSize = 3;
      for (
        let i = 0;
        i < this.attributeInfo.Attributes.length;
        i += chunkSize
      ) {
        const chunk = this.attributeInfo.Attributes.slice(i, i + chunkSize);
      }
    },
  },
});
</script>
