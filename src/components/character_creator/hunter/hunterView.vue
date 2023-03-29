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
    <div class="charSheetBlurb">
      <a
        href="https://linktr.ee/nerdbert"
        target="_blank"
        rel="noopener noreferrer"
        >Sheets provided by Nerdbert, support him here.
      </a>
      <q-btn
        v-if="
          this.currentUser !== false &&
          this.currentUser.username === this.creator
        "
        flat
        label="Delete Character"
        @click="deleteConfirm()"
        type="submit"
        color="red"
      />
    </div>
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
  display: flex;
  flex-direction: column;
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

    function deleteConfirm() {
      this.$q
        .dialog({
          title: "Confirm Deletion",
          dark: true,
          color: "red",
          message:
            "Are you sure you wish to delete this character? This cannot be undone!",
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          try {
            let baseUrl = "";
            if (window.location.href.includes("localhost")) {
              baseUrl = "http://localhost:5000";
            } else {
              baseUrl = window.location.origin;
            }

            await this.$axios.delete(baseUrl + "/hunters/delete/" + hunter.id, {
              withCredentials: true,
            });
          } catch (err) {
            this.$q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: "Failed to delete! Try again later!",
            });
            console.log(err);
            return;
          }
          this.$q.notify({
            color: "green-5",
            textColor: "white",
            icon: "check",
            message: "Character deleted!",
          });
          return;
        })
        .onCancel(() => {
          return;
        });
    }

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
      deleteConfirm,
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

      const form = await pdfDoc.getForm();

      const ubuntuFontBytes = await fetch(ubuntuFont).then((res) =>
        res.arrayBuffer()
      );

      pdfDoc.registerFontkit(fontkit);
      const supportFont = await pdfDoc.embedFont(ubuntuFontBytes);

      const fields = form.getFields();

      let edgeArr = [];
      fields.forEach((field) => {
        const type = field.constructor.name;
        const name = field.getName();
        // console.log(`${type}: ${name}`);
        if (name.includes("Edge")) {
          edgeArr.push(name);
        }
      });

      const nameField = form.getTextField("Name");
      const conceptField = form.getTextField("pcConcept");
      const chronicleField = form.getTextField("Chronicle");
      const ambitionField = form.getTextField("Ambition");
      const creedField = form.getTextField("Creed");
      const creedDescField = form.getTextField("Convictions");
      const desireField = form.getTextField("Desire");
      const driveField = form.getTextField("Drive");
      const cellField = form.getTextField("Cell");
      const redemptionField = form.getTextField("Redemption");
      const touchstoneField = form.getTextField("touchstoneNotes");
      const totalXpField = form.getTextField("tEXP");
      const spentXpField = form.getTextField("cEXP");

      nameField.setText(this.hunter.charName);
      conceptField.setText(this.hunter.concept);
      chronicleField.setText(this.hunter.chronicle);
      ambitionField.setText(this.hunter.ambition);
      creedField.setText(this.hunter.creed.name);
      creedDescField.setText(this.hunter.creed.desc);

      desireField.setText(this.hunter.desire);
      driveField.setText(this.hunter.drive.name);
      totalXpField.setText(`${this.hunter.xp}`);
      spentXpField.setText(`${this.hunter.spentXp}`);
      cellField.setText(this.hunter.cell);
      redemptionField.setText(this.hunter.redemption);

      nameField.updateAppearances(supportFont);
      chronicleField.updateAppearances(supportFont);

      conceptField.setFontSize(10);

      // text fields above, dots and loops required go below
      // touchstones
      let touchstones = "";

      for (let i = 0; i < this.hunter.touchstones.length; i++) {
        let mergedString = this.hunter.touchstones[i] + "\n";
        touchstones += mergedString;
      }
      touchstoneField.setText(touchstones);

      // health boxes
      for (let i = 1; i < this.hunter.attributes.stamina + 3 + 1; i++) {
        let healthBox = form.getCheckBox(`Health-${i}`);
        healthBox.check();
      }

      //wp boxes
      for (
        let i = 1;
        i <
        this.hunter.attributes.composure + this.hunter.attributes.resolve + 1;
        i++
      ) {
        let wpBox = form.getCheckBox(`WP-${i}`);
        wpBox.check();
      }

      const checkAtts = (attribute) => {
        let attributeBox = form.getCheckBox(attribute);
        attributeBox.check();
      };
      // attribute checkbox
      for (const attribute in this.hunter.attributes) {
        for (let i = 1; i < this.hunter.attributes[attribute] + 1; i++) {
          switch (attribute) {
            case "strength":
              checkAtts(`Str-${i}`);
              break;
            case "dexterity":
              checkAtts(`Dex-${i}`);
              break;
            case "stamina":
              checkAtts(`Sta-${i}`);
              break;
            case "charisma":
              checkAtts(`Cha-${i}`);
              break;
            case "manipulation":
              checkAtts(`Man-${i}`);
              break;
            case "composure":
              checkAtts(`Com-${i}`);
              break;
            case "intelligence":
              checkAtts(`Int-${i}`);
              break;
            case "wits":
              checkAtts(`Wit-${i}`);
              break;
            case "resolve":
              checkAtts(`Res-${i}`);
              break;
          }
        }
      }

      const checkSkills = (skill) => {
        let skillBox = form.getCheckBox(skill);
        skillBox.check();
      };

      // skill checkbox
      for (const skill in this.hunter.skills) {
        for (let i = 1; i < this.hunter.skills[skill] + 1; i++) {
          switch (skill) {
            case "athletics":
              checkSkills(`Ath-${i}`);
              break;
            case "animalken":
              checkSkills(`AniKen-${i}`);
              break;
            case "academics":
              checkSkills(`Acad-${i}`);
              break;
            case "brawl":
              checkSkills(`Bra-${i}`);
              break;
            case "etiquette":
              checkSkills(`Etiq-${i}`);
              break;
            case "awareness":
              checkSkills(`Awar-${i}`);
              break;
            case "craft":
              checkSkills(`Cra-${i}`);
              break;
            case "insight":
              checkSkills(`Insi-${i}`);
              break;
            case "finance":
              checkSkills(`Fina-${i}`);
              break;
            case "drive":
              checkSkills(`Dri-${i}`);
              break;
            case "intimidation":
              checkSkills(`Inti-${i}`);
              break;
            case "investigation":
              checkSkills(`Inve-${i}`);
              break;
            case "firearms":
              checkSkills(`Fri-${i}`);
              break;
            case "leadership":
              checkSkills(`Lead-${i}`);
              break;
            case "medicine":
              checkSkills(`Medi-${i}`);
              break;
            case "larceny":
              checkSkills(`Lar-${i}`);
              break;
            case "performance":
              checkSkills(`Perf-${i}`);
              break;
            case "occult":
              checkSkills(`Occu-${i}`);
              break;
            case "melee":
              checkSkills(`Mel-${i}`);
              break;
            case "persuasion":
              checkSkills(`Pers-${i}`);
              break;
            case "politics":
              checkSkills(`Poli-${i}`);
              break;
            case "stealth":
              checkSkills(`Ste-${i}`);
              break;
            case "streetwise":
              checkSkills(`Stre-${i}`);
              break;
            case "science":
              checkSkills(`Scie-${i}`);
              break;
            case "survival":
              checkSkills(`Sur-${i}`);
              break;
            case "subterfuge":
              checkSkills(`Subt-${i}`);
              break;
            case "technology":
              checkSkills(`Tech-${i}`);
              break;
          }
        }
      }

      //Specs
      const fillSpecs = (skill, spec) => {
        let specField = form.getTextField(skill);
        specField.setText(spec);
      };

      this.hunter.specialties.forEach((spec) => {
        switch (spec.skill.toLowerCase()) {
          case "athletics":
            fillSpecs("specAth", spec.specialty);
            break;
          case "animalken":
            fillSpecs("specAniKen", spec.specialty);
            break;
          case "academics":
            fillSpecs("specAcad", spec.specialty);
            break;
          case "brawl":
            fillSpecs("specBra", spec.specialty);
            break;
          case "etiquette":
            fillSpecs("specEtiq", spec.specialty);
            break;
          case "awareness":
            fillSpecs("specAwar", spec.specialty);
            break;
          case "craft":
            fillSpecs("specCra", spec.specialty);
            break;
          case "insight":
            fillSpecs("specInsi", spec.specialty);
            break;
          case "finance":
            fillSpecs("specFina", spec.specialty);
            break;
          case "drive":
            fillSpecs("specDri", spec.specialty);
            break;
          case "intimidation":
            fillSpecs("specInti", spec.specialty);
            break;
          case "investigation":
            fillSpecs("specInve", spec.specialty);
            break;
          case "firearms":
            fillSpecs("specFir", spec.specialty);
            break;
          case "leadership":
            fillSpecs("specLea", spec.specialty);
            break;
          case "medicine":
            fillSpecs("specMedi", spec.specialty);
            break;
          case "larceny":
            fillSpecs("specLar", spec.specialty);
            break;
          case "performance":
            fillSpecs("specPerf", spec.specialty);
            break;
          case "occult":
            fillSpecs("specOccu", spec.specialty);
            break;
          case "melee":
            fillSpecs("specMel", spec.specialty);
            break;
          case "persuasion":
            fillSpecs("specPers", spec.specialty);
            break;
          case "politics":
            fillSpecs("specPoli", spec.specialty);
            break;
          case "stealth":
            fillSpecs("specStea", spec.specialty);
            break;
          case "streetwise":
            fillSpecs("specStree", spec.specialty);
            break;
          case "science":
            fillSpecs("specScie", spec.specialty);
            break;
          case "survival":
            fillSpecs("specSur", spec.specialty);
            break;
          case "subterfuge":
            fillSpecs("specSubt", spec.specialty);
            break;
          case "technology":
            fillSpecs("specTech", spec.specialty);
            break;
        }
      });

      let edgeLength =
        this.hunter.edges.edges.length + this.hunter.edges.perks.length;

      let combinedEdges = [];

      this.hunter.edges.edges.forEach((edge) => {
        combinedEdges.push("Edge: " + edge.edge);
      });

      this.hunter.edges.perks.forEach((perk) => {
        combinedEdges.push("Perk: " + perk.perk);
      });

      for (let i = 0; i < edgeLength; i++) {
        let edgeField = form.getTextField(edgeArr[i]);
        edgeField.setText(combinedEdges[i]);
      }

      // Advantages/flaws
      let meritArr = [];
      for (const attribute in this.hunter.advantages) {
        for (const flaw in this.hunter.advantages[attribute]) {
          meritArr = meritArr.concat(this.hunter.advantages[attribute][flaw]);
        }
      }

      for (let i = 0; i < meritArr.length; i++) {
        let advTextBox = form.getTextField(`Merit${i + 1}`);
        advTextBox.setText(`${meritArr[i].name}`);

        for (let j = 1; j < meritArr[i].cost + 1; j++) {
          let advCheckBox = form.getCheckBox(`Merit${i + 1}-${j}`);
          advCheckBox.check();
        }
      }

      const pdfBytes = await pdfDoc.save();
      download(
        pdfBytes,
        `schrecknet_htr5e_${this.hunter.charName}.pdf`,
        "application/pdf"
      );
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
