<template>
  <div v-if="!this.pageFound">
    <notfound />
  </div>
  {{ updateMetaTags() }}
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
          <div>Specialties Remaining: {{ this.remaining_specialties }}</div>
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
          @click="this.favoriteChar(this.kindredId, this.charName)"
          type="submit"
          color="white"
        />
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
  name: "kindred-view",
  components: { notfound },

  async setup() {
    const siteTitle = ref("SchreckNet");
    const meta = {
      description: {
        name: "description",
        content: "Vampire: The Masquerade 5th Edition Character Generator",
      },
      keywords: {
        name: "keywords",
        content:
          "vtm, character creator, vtm5e, vampire the masquerade, schrecknet, WoD, world of darkness, w5, werewolf the apocalypse",
      },
    };

    useMeta(() => {
      return {
        title: siteTitle.value,
        meta,
      };
    });

    function updateMetaTags() {
      siteTitle.value = "SchreckNet - " + this.charName; // will automatically trigger a Meta update due to the binding
      meta.description.content =
        this.generation +
        " Gen " +
        this.clan +
        "Created using SchreckNet, a Vampire: The Masquerade character creator.";
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
    let kindredId = ref(window.location.href.split("/")[5]);

    let kindred = await axios
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

    return {
      currentUser,
      kindredId,
      attributeInfo,
      clanBanes,
      skillInfo,
      charName: kindred.charName,
      clan: kindred.clan,
      advantagesObj: kindred.advantages,
      advantages: kindred.advantages_remaining,
      age: kindred.age,
      created_by: kindred.created_by,
      creator,
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
    let creator = await this.$axios
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
    this.currentUser = await this.$axios
      .get(baseUrl + "/user/currentUser", {
        withCredentials: true,
      })
      .then((resp) => {
        return resp.data;
      });

    this.favCount = await this.$axios
      .get(baseUrl + "/favorites/favCount/" + this.kindredId, {
        withCredentials: true,
      })
      .then((resp) => {
        return resp.data;
      });

    console.log(this.favCount.count);
  },
  methods: {
    async modifyPdf() {
      this.$q.loading.show({
        delay: 400, // ms
      });
      this.calculateSpentXp();
      this.bloodPotencyModifiers();
      this.setClanBane();
      const pdfDoc = await PDFDocument.load(this.charSheet);
      const form = pdfDoc.getForm();
      const ubuntuFontBytes = await fetch(ubuntuFont).then((res) =>
        res.arrayBuffer()
      );
      pdfDoc.registerFontkit(fontkit);
      const supportFont = await pdfDoc.embedFont(ubuntuFontBytes);

      // const fields = form.getFields();
      // fields.forEach((field) => {
      //   const type = field.constructor.name;
      //   const name = field.getName();
      //   console.log(`${type}: ${name}`);
      // });

      const nameField = form.getTextField("Name");
      const conceptField = form.getTextField("Concept");
      const predatorField = form.getTextField("Predator");
      const chronicleField = form.getTextField("Chronicle");
      const ambitionField = form.getTextField("Ambition");
      const clanField = form.getTextField("Clan");
      const sireField = form.getTextField("Sire");
      const desireField = form.getTextField("Desire");
      const generationField = form.getTextField("Generation");
      const convictionField = form.getTextField("Touchstones Convictions");
      const totalXpField = form.getTextField("totalxp");
      const spentXpField = form.getTextField("spentxp");
      const baneField = form.getTextField("Clan Banes");
      const baneSeverityField = form.getTextField("Bane Severity");
      const surgeField = form.getTextField("Blood Surge");
      const mendField = form.getTextField("Mend Amount");
      const powerField = form.getTextField("Power Bonus");
      const rouseField = form.getTextField("Rouse ReRoll");
      const feedPenField = form.getTextField("Feeding Penalty");
      const notesField = form.getTextField("Notes");

      nameField.setText(this.charName);
      conceptField.setText(this.concept);
      predatorField.setText(this.predatorType);
      chronicleField.setText(this.chronicle);
      ambitionField.setText(this.ambition);
      clanField.setText(this.clan);
      sireField.setText(this.sire === null ? "Unknown" : this.sire);
      desireField.setText(this.desire);
      generationField.setText(this.generation);
      totalXpField.setText(`${this.xp}`);
      spentXpField.setText(`${this.spentXp}`);
      baneSeverityField.setText(`${this.baneseverity}`);
      surgeField.setText(`${this.bloodSurge}`);
      mendField.setText(`${this.mendAmt}`);
      powerField.setText(`${this.powerBonus}`);
      rouseField.setText(`${this.rouseAmt}`);
      feedPenField.setText(`${this.feedPenalty}`);
      baneField.setText(this.clanBane);
      sireField.updateAppearances(supportFont);
      nameField.updateAppearances(supportFont);
      chronicleField.updateAppearances(supportFont);

      conceptField.setFontSize(10);

      // text fields above, dots and loops required go below
      // touchstones/convictions are a weird concat string situation so we'll do it up top near the text boxes
      let convicStoneString = "";
      for (let i = 0; i < this.convictions.length; i++) {
        let convicString = "Conviction: ";
        let mergedString = convicString + this.convictions[i] + "\n";
        convicStoneString += mergedString;
      }

      for (let i = 0; i < this.touchstones.length; i++) {
        let touchString = "Touchstone: ";
        let mergedString = touchString + this.touchstones[i] + "\n";
        convicStoneString += mergedString;
      }
      convictionField.setText(convicStoneString);

      // health boxes
      for (let i = 1; i < this.attributes.stamina + 3 + 1; i++) {
        let healthBox = form.getTextField(`health${i}`);
        healthBox.setText("X");
      }

      //wp boxes
      for (
        let i = 1;
        i < this.attributes.composure + this.attributes.resolve + 1;
        i++
      ) {
        let wpBox = form.getTextField(`will${i}`);
        wpBox.setText("X");
      }

      // attribute checkbox
      for (const attribute in this.attributes) {
        for (let i = 1; i < this.attributes[attribute] + 1; i++) {
          let attributeBox = form.getCheckBox(`${attribute}${i}`);
          attributeBox.check();
        }
      }

      // skill checkbox
      for (const skill in this.trueSkills) {
        for (let i = 1; i < this.trueSkills[skill] + 1; i++) {
          let skillBox = form.getCheckBox(`${skill}${i}`);
          skillBox.check();
        }
      }
      // humanity checkbox
      for (let i = 1; i < this.humanity + 1; i++) {
        let humanityBox = form.getCheckBox(`humanity-${i}`);
        humanityBox.check();
      }

      // potency
      for (let i = 1; i < this.potency + 1; i++) {
        let potencyBox = form.getCheckBox(`potency${i}`);
        potencyBox.check();
      }

      // disciplines
      let mergedDisciplines = {};
      for (const discipline in this.disciplines) {
        mergedDisciplines[discipline] = {
          dots: this.disciplines[discipline],
          skills: [],
        };
      }
      for (let i = 0; i < this.disciplineSkills.length; i++) {
        mergedDisciplines[this.disciplineSkills[i].discipline].skills.push(
          this.disciplineSkills[i]
        );
      }

      let curIndex = 0;
      for (const discipline in mergedDisciplines) {
        curIndex++;
        let mainBox = form.getTextField(`Main${curIndex}`);
        mainBox.setText(discipline);
        switch (curIndex) {
          case 1:
            mergedDisciplines[discipline].skills.forEach((x, index) => {
              let rowField = form.getTextField(`Row${index + 1}`);
              rowField.setText(`${x.skill}`);
            });
            break;
          case 2:
            mergedDisciplines[discipline].skills.forEach((x, index) => {
              let rowField = form.getTextField(`Row${index + 1}_2`);
              rowField.setText(`${x.skill}`);
            });
            break;
          case 3:
            mergedDisciplines[discipline].skills.forEach((x, index) => {
              let rowField = form.getTextField(`Row${index + 1}_3`);
              rowField.setText(`${x.skill}`);
            });
            break;
          case 4:
            mergedDisciplines[discipline].skills.forEach((x, index) => {
              let rowField = form.getTextField(`Row${index + 1}_4`);
              rowField.setText(`${x.skill}`);
            });
            break;
          case 5:
            mergedDisciplines[discipline].skills.forEach((x, index) => {
              let rowField = form.getTextField(`Row${index + 1}_5`);
              rowField.setText(`${x.skill}`);
            });
            break;
          case 6:
            mergedDisciplines[discipline].skills.forEach((x, index) => {
              let rowField = form.getTextField(`Row${index + 1}_6`);
              rowField.setText(`${x.skill}`);
            });
            break;
        }

        for (let j = 1; j < mergedDisciplines[discipline].dots + 1; j++) {
          let mainCheckBox = form.getCheckBox(`main${curIndex}-${j}`);
          mainCheckBox.check();
        }
      }

      // Advantages/flaws

      let meritArr = [];
      for (const attribute in this.advantagesObj) {
        for (const flaw in this.advantagesObj[attribute]) {
          meritArr = meritArr.concat(this.advantagesObj[attribute][flaw]);
        }
      }

      for (let i = 0; i < meritArr.length; i++) {
        let advTextBox = form.getTextField(`adflaw${i + 1}`);
        advTextBox.setText(`${meritArr[i].name}`);

        for (let j = 1; j < meritArr[i].cost + 1; j++) {
          let advCheckBox = form.getCheckBox(`adflaw${i + 1}-${j}`);
          advCheckBox.check();
        }
      }

      // Specialties
      let fullSpecString = "";
      for (let i = 0; i < this.specialties.length; i++) {
        let specialString = "Specialty: ";
        let mergedString =
          specialString +
          this.capitalize(this.specialties[i].skill) +
          " - " +
          this.specialties[i].specialty +
          "\n";
        fullSpecString += mergedString;
      }
      notesField.setText(fullSpecString);

      const pdfBytes = await pdfDoc.save();
      download(
        pdfBytes,
        `schrecknet_vtm5e_${this.charName}.pdf`,
        "application/pdf"
      );
      this.$q.loading.hide();
    },

    calculateSpentXp() {
      switch (this.age) {
        case "Fledgling":
          this.spentXp = 0;
          break;
        case "Childer":
          this.spentXp = 0;

          break;
        case "Neonate":
          this.spentXp = 15 - this.xp;
          break;
        case "Ancillae":
          this.spentXp = 35 - this.xp;
          break;
      }
    },

    bloodPotencyModifiers() {
      switch (this.potency) {
        case 0:
          this.baneseverity = 0;
          this.powerBonus = 0;
          this.bloodSurge = 1;
          this.mendAmt = 1;
          this.rouseAmt = "None";
          this.feedPenalty = "None";
          break;
        case 1:
          this.baneseverity = 2;
          this.powerBonus = 0;
          this.bloodSurge = 2;
          this.mendAmt = 1;
          this.rouseAmt = "Level 1";
          this.feedPenalty = "None";
          break;
        case 2:
          this.baneseverity = 2;
          this.powerBonus = 1;
          this.bloodSurge = 2;
          this.mendAmt = 2;
          this.rouseAmt = "Level 1";
          this.feedPenalty = "Animal and bagged blood slake half Hunger";
          break;
        case 3:
          this.baneseverity = 3;
          this.powerBonus = 1;
          this.bloodSurge = 3;
          this.mendAmt = 2;
          this.rouseAmt = "Level 2 and below";
          this.feedPenalty = "Animal and bagged blood slake no Hunger";
          break;
        case 4:
          this.baneseverity = 3;
          this.powerBonus = 2;
          this.bloodSurge = 3;
          this.mendAmt = 3;
          this.rouseAmt = "Level 2 and below";
          this.feedPenalty =
            "Animal and bagged blood slake no Hunger, 1 less hunger from humans";
          break;
        case 5:
          this.baneseverity = 4;
          this.powerBonus = 2;
          this.bloodSurge = 4;
          this.mendAmt = 3;
          this.rouseAmt = "Level 3 and below";
          this.feedPenalty =
            "Animal and bagged blood slake no Hunger, 1 less hunger from humans, must full drain to get below 2 hunger";
          break;
        case 6:
          this.baneseverity = 4;
          this.powerBonus = 3;
          this.bloodSurge = 4;
          this.mendAmt = 3;
          this.rouseAmt = "Level 3 and below";
          this.feedPenalty =
            "Animal and bagged blood slake no Hunger, 2 less hunger from humans, must full drain to get below 2 hunger";
          break;
      }
    },
    setClanBane() {
      this.clanBane = this.clanBanes.clans[this.clan];
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
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: `Favorited ${charName}`,
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
  },
});
</script>
