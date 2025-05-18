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
        <p>Vampire: The Masquerade</p>
        <div v-if="imgLink">
          <q-img
            :src="imgLink"
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
            Clan:
            {{
              ["Giovanni", "Lamiae", "Nagaraja", "Samedi"].includes(this.clan)
                ? this.clan + " (Hecata)"
                : this.clan
            }}
            {{ this.altBane ? "(Alternate Bane)" : "" }}
          </div>
          <div>Sect: {{ sect }}</div>
          <div>
            Age: {{ age }} {{ this.altAncilla ? "(Alternate Rules)" : "" }}
          </div>
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
                    {{ skill }}: {{ this.trueSkills[skill.toLowerCase()] }}/5
                  </div>
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
          @click="this.favoriteChar(this.kindredId, this.charName)"
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
import { defineComponent } from "vue";
import attributeInfo from "../vtm/5eAttributes.json";
import skillInfo from "../vtm/5eSkills.json";
import { degrees, PDFDocument, PDFFont, rgb, StandardFonts } from "pdf-lib";
import notfound from "../../../pages/ErrorNotFound.vue";
import download from "downloadjs";
import charSheet from "raw-loader!./sheetbase64.txt";
import smallX from "../../../assets/images/small_x.png";

import ubuntuFont from "../../../css/fonts/Ubuntu-R.ttf";
import clanBanes from "../vtm/5eClanBanes.json";
import clanCompulsions from "../vtm/5eClanCompulsions.json";

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

            await this.$axios.delete(
              baseUrl + "/vampires/delete/" + kindred.id,
              {
                withCredentials: true,
              }
            );
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
      kindredId,
      attributeInfo,
      clanBanes,
      clanCompulsions,
      skillInfo,
      deleteConfirm,
      altAncilla: kindred.alt_ancilla,
      altBane: kindred.alt_bane,
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
      imgLink: kindred.image_link,
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
    await this.$api
      .get("/user/getUser/" + this.created_by, {
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
      clanCompulsion: "",
      smallX,
      zoomed: false,
    };
  },
  async mounted() {
    this.favCount = await this.$api
      .get("/favorites/favCount/" + this.kindredId)
      .then((resp) => {
        return resp.data;
      });
    this.currentUser = await this.$api
      .get("/user/currentUser", {
        withCredentials: true,
      })
      .then((resp) => {
        return resp.data;
      });
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
    async modifyPdf() {
      try {
        this.$q.loading.show({
          delay: 400, // ms
        });

        this.calculateSpentXp();
        this.bloodPotencyModifiers();
        this.setClanBane();
        this.setClanCompulsion();
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
        const conceptField = form.getTextField("pcConcept");
        const predatorField = form.getTextField("Predator type");
        const chronicleField = form.getTextField("Chronicle");
        const ambitionField = form.getTextField("Ambition");
        const clanField = form.getTextField("Clan");
        const sectField = form.getTextField("Sect");
        const sireField = form.getTextField("Sire");
        const desireField = form.getTextField("Desire");
        const generationField = form.getTextField("Title");
        const convictionField = form.getTextField("Convictions");
        const touchstoneField = form.getTextField("touchstoneNotes");
        const rankField = form.getTextField("Rank");
        const totalXpField = form.getTextField("tEXP");
        const spentXpField = form.getTextField("cEXP");
        const baneField = form.getTextField("ClanBane");
        const compName = form.getTextField("NameCompulsion");
        const compDesc = form.getTextField("ClanCompulsion");

        const baneSeverityField = form.getTextField("BaneSev");
        const surgeField = form.getTextField("BloodSurge");
        const mendField = form.getTextField("Mend");
        const powerField = form.getTextField("PowBonus");
        const rouseField = form.getTextField("ReRouse");
        const feedPenField = form.getTextField("FeedPen");
        const notesField = form.getTextField("PC_Notes");

        nameField.setText(this.charName);
        conceptField.setText(this.concept);
        predatorField.setText(this.predatorType);
        chronicleField.setText(this.chronicle);
        ambitionField.setText(this.ambition);
        clanField.setText(
          ["Giovanni", "Lamiae", "Nagaraja", "Samedi"].includes(this.clan)
            ? this.clan + " (Hecata)"
            : this.clan
        );
        sectField.setText(this.sect);
        sireField.setText(this.sire === null ? "Unknown" : this.sire);
        desireField.setText(this.desire);
        generationField.setText(this.generation);
        rankField.setText(this.age);
        totalXpField.setText(`${this.xp}`);
        spentXpField.setText(`${this.spentXp}`);
        baneSeverityField.setText(`${this.baneseverity}`);
        surgeField.setText(`${this.bloodSurge}`);
        mendField.setText(`${this.mendAmt}`);
        powerField.setText(`${this.powerBonus}`);
        rouseField.setText(`${this.rouseAmt}`);
        feedPenField.setText(`${this.feedPenalty}`);
        baneField.setText(this.clanBane);
        compName.setText(this.clanCompulsion.name);
        compDesc.setText(this.clanCompulsion.desc);
        sireField.updateAppearances(supportFont);
        nameField.updateAppearances(supportFont);
        chronicleField.updateAppearances(supportFont);

        conceptField.setFontSize(10);

        // text fields above, dots and loops required go below
        // touchstones/convictions are a weird concat string situation so we'll do it up top near the text boxes
        let convicStoneString = "";
        for (let i = 0; i < this.convictions.length; i++) {
          let mergedString = this.convictions[i] + "\n";
          convicStoneString += mergedString;
        }
        convictionField.setText(convicStoneString);
        convictionField.updateAppearances(supportFont);

        let touchStoneString = "";

        for (let i = 0; i < this.touchstones.length; i++) {
          let mergedString = this.touchstones[i] + "\n";
          touchStoneString += mergedString;
        }

        touchstoneField.setText(touchStoneString);
        touchstoneField.updateAppearances(supportFont);

        // health boxes
        for (let i = 1; i < this.attributes.stamina + 3 + 1; i++) {
          let healthBox = form.getCheckBox(`Health-${i}`);
          healthBox.check();
        }

        //wp boxes
        for (
          let i = 1;
          i < this.attributes.composure + this.attributes.resolve + 1;
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
        for (const attribute in this.attributes) {
          for (let i = 1; i < this.attributes[attribute] + 1; i++) {
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
        for (const skill in this.trueSkills) {
          for (let i = 1; i < this.trueSkills[skill] + 1; i++) {
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
        // humanity checkbox
        const pngImageBytes = await fetch(smallX).then((res) =>
          res.arrayBuffer()
        );

        const pngImage = await pdfDoc.embedPng(pngImageBytes);
        for (let i = 1; i < this.humanity + 1; i++) {
          let humanityBox = form.getButton(`Humanity-${i}`);
          humanityBox.setImage(pngImage);
        }

        // potency
        for (let i = 1; i < this.potency + 1; i++) {
          let potencyBox = form.getCheckBox(`BloodPotency-${i}`);
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
          if (this.clan === "Caitiff") {
            if (mergedDisciplines[discipline].dots === 0) {
              continue;
            }
          }
          ++curIndex;
          let mainBox = form.getTextField(`Disc${curIndex}`);
          mainBox.setText(discipline);

          let emergencyString = "";
          mergedDisciplines[discipline].skills.forEach((x, index) => {
            if (index + 1 >= 6) {
              emergencyString += x.discipline + ": " + x.skill + "\n";
              notesField.setText(emergencyString);
            } else {
              let rowField = form.getTextField(
                `Disc${curIndex}_Ability${index + 1}`
              );
              rowField.updateAppearances(supportFont);
              rowField.setText(`${x.skill}`);
            }
          });

          for (let j = 1; j < mergedDisciplines[discipline].dots + 1; j++) {
            let mainCheckBox = form.getCheckBox(`Disc${curIndex}-${j}`);
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
          if (i + 1 === 12) {
            let mergedString =
              `${meritArr[i].name} - (${meritArr[i].cost})` + "\n";
            notesField.setText(mergedString);
            continue;
          }
          let advTextBox = form.getTextField(`Merit${i + 1}`);
          advTextBox.updateAppearances(supportFont);
          advTextBox.setText(`${meritArr[i].name}`);

          for (let j = 1; j < meritArr[i].cost + 1; j++) {
            let advCheckBox = form.getCheckBox(`Merit${i + 1}-${j}`);
            advCheckBox.check();
          }
        }

        //Specs
        const fillSpecs = (skill, spec) => {
          let specField = form.getTextField(skill);
          specField.setText(spec);
        };

        this.specialties.forEach((spec) => {
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

        const pdfBytes = await pdfDoc.save();
        download(
          pdfBytes,
          `schrecknet_vtm5e_${this.charName}.pdf`,
          "application/pdf"
        );
      } catch (err) {
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          timeout: 25000,
          message:
            "Error converting to PDF, there are likely unsupported characters somewhere in the sheet. Please remove them and replace them with an English alphabet equivalent.",
        });
        console.log(err);
      } finally {
        this.$q.loading.hide();
      }
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
      this.clanBane = this.altBane
        ? this.clanBanes.altClans[this.clan]
        : this.clanBanes.clans[this.clan];
      if (this.clan === "Thin-Blood") {
        let meme = this.advantagesObj.merits.flaws.find((o) =>
          o.name.includes("Clan Curse")
        );
        if (meme !== undefined) {
          let splitStr = meme.name.split(/[()]+/).filter(function (e) {
            return e;
          });

          this.clanBane = this.clanBanes.clans[splitStr[1]];
        } else {
          this.clanBane = "None";
        }
      }
    },

    setClanCompulsion() {
      this.clanCompulsion = this.clanCompulsions.clans[this.clan];
    },

    favoriteChar(sheet_id, charName) {
      const payload = {
        game_id: 1,
        sheet_id: sheet_id,
      };
      this.$api
        .post("/favorites/add", payload, {
          withCredentials: true,
        })
        .then((res) => {
          this.favCount.count++;
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
        name: "editVampire",
        params: { id: this.kindredId },
      });
    },
  },
});
</script>
