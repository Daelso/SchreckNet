<template>
  <div v-if="!this.pageFound">
    <notfound />
  </div>

  <div
    v-if="this.pageFound"
    class="q-pa-md column justify-center text-center"
    style="max-width: 900px"
  >
    {{ updateMetaTags(this.garou) }}
    {{ chunkArrays() }}
    <div class="q-pa-md column text-center">
      <q-banner class="bg-primary text-white" rounded dark>
        <div class="container">
          Werewolf: The Apocalypse
          <div class="info q-my-sm">
            <div>Name: {{ garou.charName ? garou.charName : "Unknown" }}</div>
            <div>
              Chronicle: {{ garou.chronicle ? garou.chronicle : "Unknown" }}
            </div>
            <div>Concept: {{ !garou.concept ? "None" : garou.concept }}</div>
          </div>
          <div class="concept q-mt-md">
            <div>
              Tribe: {{ !garou.tribe ? "None" : garou.tribe.tribe_name }}
            </div>
            <div>
              Auspice:
              {{ !garou.auspice ? "None" : garou.auspice.auspice_name }}
            </div>
            <div>Patron: {{ !garou.tribe ? "None" : garou.tribe.patron }}</div>
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
            <div>Health: {{ garou.attributes.stamina + 3 }}</div>
            <div>
              Willpower:
              {{ garou.attributes.composure + garou.attributes.resolve }}
            </div>
            <div>
              Advantage Dots Remaining: {{ garou.advantages_remaining }}
            </div>
            <div>Flaw Dots Remaining: {{ garou.flaws_remaining }}</div>
          </div>
          <div style="margin: auto">Remaining XP: {{ garou.xp }}</div>

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
                    {{ garou.attributes[attribute.toLowerCase()] }}/5
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
                      {{ skill }}: {{ garou.skills[skill.toLowerCase()] }}/5
                    </div>
                  </div>
                  <q-separator />
                  <br />
                  Specialties:
                  <div v-if="garou.specialties.length < 1">None yet</div>
                  <div v-for="(specialty, key) in garou.specialties" :key="key">
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
                      v-if="garou.advantages.merits.advantages.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="advantage in garou.advantages.merits.advantages"
                      :key="advantage.name"
                    >
                      <div>{{ advantage.name }} - {{ advantage.cost }}</div>
                    </div>
                    Flaws:
                    <div
                      class="q-my-sm"
                      v-if="garou.advantages.merits.flaws.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="flaw in garou.advantages.merits.flaws"
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
                      v-if="
                        garou.advantages.backgrounds.advantages.length === 0
                      "
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="advantage in garou.advantages.backgrounds
                        .advantages"
                      :key="advantage.name"
                    >
                      <div>{{ advantage.name }} - {{ advantage.cost }}</div>
                    </div>
                    Flaws:
                    <div
                      class="q-my-sm"
                      v-if="garou.advantages.backgrounds.flaws.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="flaw in garou.advantages.backgrounds.flaws"
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
                      v-if="garou.advantages.talismans.advantages.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="advantage in garou.advantages.talismans.advantages"
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
                      v-if="garou.advantages.loresheets.advantages.length === 0"
                    >
                      Not yet selected
                    </div>
                    <div
                      v-for="advantage in garou.advantages.loresheets
                        .advantages"
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
                  <div v-if="garou.touchstones.length < 1">None</div>
                  <div
                    v-for="(touchstone, key) in this.garou.touchstones"
                    :key="key"
                  >
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
              this.currentUser.username === this.creator
            "
            flat
            label="Edit Character"
            @click="goToEdit()"
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
            @click="this.favoriteChar(this.hunterId, this.garou.charName)"
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
  </div>
</template>

<style scoped>
.merits_container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  justify-items: center;
}

.charSheetBlurb {
  color: white;
  font-style: italic;
  padding: 10px;
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
import { defineComponent } from "vue";
import attributeInfo from "../vtm/5eAttributes.json";
import skillInfo from "../vtm/5eSkills.json";
import { degrees, PDFDocument, PDFFont, rgb, StandardFonts } from "pdf-lib";
import notfound from "../../../pages/ErrorNotFound.vue";
import download from "downloadjs";
import charSheet from "raw-loader!./sheetbase64.txt";

import ubuntuFont from "../../../css/fonts/Ubuntu-R.ttf";
import fontkit from "@pdf-lib/fontkit";

import { ref } from "vue";

import { useMeta } from "quasar";

export default defineComponent({
  name: "garou-view",
  components: { notfound },

  async setup() {
    const siteTitle = ref("SchreckNet");
    const meta = {
      description: {
        name: "description",
        content: "Werewolf: The Apocalypse 5th Edition Character Generator",
      },
      keywords: {
        name: "keywords",
        content:
          "werewolf, character creator, wta, wta5, werewolf the apocalypse, w5e, schrecknet, WoD, world of darkness",
      },
    };

    useMeta(() => {
      return {
        title: siteTitle.value,
        meta,
      };
    });

    function updateMetaTags(garou) {
      siteTitle.value = "SchreckNet - " + garou.charName; // will automatically trigger a Meta update due to the binding
      meta.description.content =
        this.garou.tribe.tribe_name +
        `(${garou.auspice.auspice_name})` +
        "Created using SchreckNet, a Werewolf: The Apocalypse character creator.";
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
    let garouId = ref(window.location.href.split("/")[5]);

    const garou = await axios
      .get(baseUrl + "/garou/garou/" + garouId.value, {
        withCredentials: true,
      })
      .then((resp) => {
        if (resp.data === null) {
          pageFound.value = false;
        } else {
          pageFound.value = true;
        }
        return resp.data;
      })
      .catch((err) => {
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

            await this.$axios.delete(baseUrl + "/garou/delete/" + garou.id, {
              withCredentials: true,
            });
          } catch (err) {
            this.$q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: "Failed to delete! Try again later!",
            });
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
      baseUrl,
      currentUser,
      garouId,
      garou,
      attributeInfo,

      skillInfo,
      created_by: garou !== null ? garou.created_by : "Anonymous",
      creator,
      pageFound,
      deleteConfirm,
      charSheet,
      spentXp: 0,
      mendAmt: 0,

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
      .catch((err) => {});

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
      .get(baseUrl + "/favorites/favCount/" + this.garouId)
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

      // const fields = form.getFields();

      // fields.forEach((field) => {
      //   const type = field.constructor.name;
      //   const name = field.getName();
      //   // console.log(`${type}: ${name}`);
      // });

      const nameField = form.getTextField("Name");
      const tribeField = form.getTextField("Tribe");
      const patronField = form.getTextField("Patron");
      const auspiceField = form.getTextField("Auspice");

      const conceptField = form.getTextField("pcConcept");
      const chronicleField = form.getTextField("Chronicle");

      const touchstoneField = form.getTextField("Convictions");
      const favorAndBans = form.getTextField("touchstoneNotes");

      const totalXpField = form.getTextField("tEXP");
      const spentXpField = form.getTextField("cEXP");

      nameField.setText(this.garou.charName);
      conceptField.setText(this.garou.concept);
      chronicleField.setText(this.garou.chronicle);

      totalXpField.setText(`${this.garou.xp}`);
      spentXpField.setText(`${this.garou.spent_xp}`);
      auspiceField.setText(this.garou.auspice.auspice_name);
      tribeField.setText(this.garou.tribe.tribe_name);
      patronField.setText(this.garou.tribe.patron);

      nameField.updateAppearances(supportFont);
      chronicleField.updateAppearances(supportFont);
      conceptField.updateAppearances(supportFont);
      touchstoneField.updateAppearances(supportFont);

      conceptField.setFontSize(10);

      // text fields above, dots and loops required go below
      // touchstones
      let touchstones = "";

      for (let i = 0; i < this.garou.touchstones.length; i++) {
        let mergedString = this.garou.touchstones[i] + "\n";
        touchstones += mergedString;
      }
      touchstoneField.setText(touchstones);

      let mergedFavorString = "Favor: " + this.garou.tribe.favor + "\n\n";
      mergedFavorString += "Ban: " + this.garou.tribe.ban;
      favorAndBans.setText(mergedFavorString);

      // health boxes
      for (let i = 1; i < this.garou.attributes.stamina + 3 + 1; i++) {
        let healthBox = form.getCheckBox(`Health-${i}`);
        healthBox.check();
      }

      //wp boxes
      for (
        let i = 1;
        i < this.garou.attributes.composure + this.garou.attributes.resolve + 1;
        i++
      ) {
        let wpBox = form.getCheckBox(`WP-${i}`);
        wpBox.check();
      }

      // rage boxes
      for (let i = 1; i < 3; i++) {
        let rageBox = form.getCheckBox(`Rage-${i}`);
        rageBox.check();
      }

      // glory boxes
      for (let i = 1; i < this.renownTotal.glory + 1; i++) {
        let gloryBox = form.getCheckBox(`Glory-${i}`);
        gloryBox.check();
      }

      // honor boxes
      for (let i = 1; i < this.renownTotal.honor + 1; i++) {
        let honorBox = form.getCheckBox(`Honor-${i}`);
        honorBox.check();
      }

      // wisdom
      for (let i = 1; i < this.renownTotal.wisdom + 1; i++) {
        let wisdomBox = form.getCheckBox(`Wisdom-${i}`);
        wisdomBox.check();
      }

      const checkAtts = (attribute) => {
        let attributeBox = form.getCheckBox(attribute);
        attributeBox.check();
      };
      // attribute checkbox
      for (const attribute in this.garou.attributes) {
        for (let i = 1; i < this.garou.attributes[attribute] + 1; i++) {
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
      for (const skill in this.garou.skills) {
        for (let i = 1; i < this.garou.skills[skill] + 1; i++) {
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

      this.garou.specialties.forEach((spec) => {
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

      const gifts = this.justGifts;
      console.log(gifts);

      // Gifts/Rites
      for (let i = 0; i < gifts.length; i++) {
        let giftName = form.getTextField(`Gift_Name-1.${i}.0`);
        let giftPool = form.getTextField(`Gift_Name-1.${i}.1`);
        let giftCost = form.getTextField(`Gift_Name-1.${i}.2`);
        let giftNotes = form.getTextField(`Gift_Name-1.${i}.3`);
        let giftPage = form.getTextField(`Gift_Name-1.${i}.4`);

        giftName.setText(
          gifts[i].gift_name ? gifts[i].gift_name : gifts[i].rite_name
        );
        giftPool.setText(gifts[i].pool);
        giftCost.setText(gifts[i].cost ? gifts[i].cost : "Free");
        if (gifts[i].short_desc) {
          giftNotes.setText(gifts[i].short_desc);
        } else if (!gifts[i].short_desc && gifts[i].gift_description) {
          giftNotes.setText(gifts[i].gift_description);
        } else {
          giftNotes.setText(gifts[i].rite_description);
        }

        giftPage.setText(gifts[i].page);
      }

      // Advantages/flaws
      let meritArr = [];
      for (const attribute in this.garou.advantages) {
        for (const flaw in this.garou.advantages[attribute]) {
          meritArr = meritArr.concat(this.garou.advantages[attribute][flaw]);
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
        `schrecknet_wta5_${this.garou.charName}.pdf`,
        "application/pdf"
      );
      this.$q.loading.hide();
    },

    favoriteChar(sheet_id, charName) {
      const payload = {
        game_id: 3,
        sheet_id: sheet_id,
      };
      this.$axios
        .post(this.baseUrl + "/favorites/add", payload, {
          withCredentials: true,
        })
        .then((res) => {
          this.favCount.count++;
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: `Favorited ${this.garou.charName}`,
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

    goToEdit() {
      this.$router.push({
        name: "editGarou",
        params: { id: this.garouId },
      });
    },
  },
  computed: {
    renownTotal() {
      let trueRenown = { glory: 0, honor: 0, wisdom: 0 };
      trueRenown.glory =
        this.garou.tribe_renown.glory + this.garou.purchased_renown.glory;
      trueRenown.honor =
        this.garou.tribe_renown.honor + this.garou.purchased_renown.honor;
      trueRenown.wisdom =
        this.garou.tribe_renown.wisdom + this.garou.purchased_renown.wisdom;

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

      for (let key in this.garou.tribe_gifts) {
        if (this.garou.tribe_gifts[key] !== null) {
          gifts[key].push(this.garou.tribe_gifts[key]);
        }
      }

      for (let key in this.garou.purchased_gifts) {
        if (this.garou.purchased_gifts[key].length > 0) {
          gifts[key] = [...gifts[key], ...this.garou.purchased_gifts[key]];
        }
      }

      return gifts;
    },

    justGifts() {
      let gifts = [];

      for (let key in this.garou.tribe_gifts) {
        if (this.garou.tribe_gifts[key] !== null) {
          gifts.push(this.garou.tribe_gifts[key]);
        }
      }

      for (let key in this.garou.purchased_gifts) {
        if (this.garou.purchased_gifts[key].length > 0) {
          gifts = [...gifts, ...this.garou.purchased_gifts[key]];
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
});
</script>
