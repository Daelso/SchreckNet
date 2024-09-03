<template>
  <div class="q-pa-md row justify-center text-center">
    <q-card class="bg-primary">
      <q-tabs
        v-model="tab"
        class="bg-primary tabs"
        active-color="white"
        indicator-color="secondary"
        align="justify"
        narrow-indicator
        mobile-arrows
      >
        <q-tab style="color: white" name="coreConcept" label="Core Concept" />
        <q-tab style="color: white" name="touchstones" label="Touchstones" />
        <q-tab
          :disable="sortSkills().length < 1 && this.debug !== true"
          name="specialties"
          label="Specialties"
          style="color: white"
          id="specTab"
        >
          <q-tooltip
            v-if="sortSkills().length < 1 && this.debug !== true"
            class="bg-dark text-body2"
            >Must have any skill over 1 to set specialties.</q-tooltip
          >
        </q-tab>
        <q-tab
          style="color: white"
          name="advantages"
          label="Advantages & Flaws"
          id="advantageTab"
        >
        </q-tab>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated class="bg-primary">
        <q-tab-panel name="coreConcept" class="q-m-b-xl">
          <q-input
            filled
            class="select"
            bg-color="grey-3"
            v-model="tabCharName"
            label="Your character's name *"
            lazy-rules
            label-color="primary"
            @update:model-value="$emit('update:charName', this.tabCharName)"
            :rules="[
              (val) =>
                (typeof val === 'string' &&
                  val.length > 3 &&
                  val.length <= 128) ||
                'Please enter a valid name, between 3-128 characters',
            ]"
          />

          <q-input
            filled
            bg-color="grey-3"
            class="select"
            v-model="tabConcept"
            label="Character Concept *"
            autogrow
            hint="Example: Monster-hunting soldier-of-fortune"
            hide-hint
            lazy-rules
            label-color="primary"
            @update:model-value="$emit('update:concept', this.tabConcept)"
            :rules="[
              (val) =>
                (typeof val === 'string' &&
                  val.length <= 164 &&
                  val.length >= 1) ||
                'Please keep this field between 1 and 164 characters',
            ]"
          />

          <q-input
            filled
            bg-color="grey-3"
            v-model="tabChronicle"
            label="Chronicle *"
            class="select"
            label-color="primary"
            lazy-rules
            @update:model-value="
              this.$emit('update:chronicle', this.tabChronicle)
            "
            :rules="[
              (val) =>
                (typeof val === 'string' &&
                  val.length <= 128 &&
                  val.length >= 3) ||
                'Please keep this field between 3 and 128 characters',
            ]"
          />

          <q-input
            filled
            class="select"
            bg-color="grey-3"
            v-model="xpInput"
            type="number"
            label="Your Starting XP *"
            lazy-rules
            label-color="primary"
            hint="There are no written rules for amount of starting XP, discuss with your ST."
            hide-hint
            @update:model-value="$emit('update:xp', this.xpInput)"
          />
        </q-tab-panel>

        <q-tab-panel name="touchstones">
          <div class="q-mb-sm">Must have 1-3 touchtones.</div>
          <div class="q-mb-sm" style="color: white">
            {{ this.tabTouchStones.length }} touchstones
          </div>
          <q-input
            filled
            bg-color="grey-3"
            v-model="touchStoneInput"
            label="Touchstone *"
            hint="A specific living human who binds you to reality. Who are you fighting for? (Press Enter to confirm)"
            hide-hint
            autogrow
            class="select"
            label-color="primary"
            lazy-rules
            v-on:keydown.enter.prevent="
              () => {
                if (!this.touchStoneInput) {
                  return;
                }
                if (this.tabTouchStones.length <= 2) {
                  this.tabTouchStones.push(this.touchStoneInput);
                  this.touchStoneInput = '';
                  this.$emit('update:touchstones', this.tabTouchStones);
                } else {
                  this.$q.notify({
                    message: 'You may have a max of 3 touchstones',
                    color: 'red-5',
                    icon: 'warning',
                  });
                }
              }
            "
            :rules="[
              (val) =>
                (typeof val === 'string' && val.length <= 2000) ||
                'Please keep this field under 2000 characters',
            ]"
          />

          <q-separator />
          <div class="text-h6" style="font-family: monospace">Touchstones</div>
          <q-list bordered separator>
            <q-item
              v-for="(touchstone, key) in touchstones"
              :key="key"
              clickable
              v-ripple
              @click="removeTouchstone($event.target.id)"
            >
              <q-item-section :id="key"
                >{{ touchstone }}
                <q-tooltip class="bg-dark text-body2"
                  >Click to delete</q-tooltip
                ></q-item-section
              >
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="specialties">
          <div class="q-mb-sm">
            Specialties remaining: {{ specialtiePoints }}
          </div>
          <q-select
            v-model="skillSelect"
            :options="sortSkills()"
            label="Which skill *"
            class="select q-mb-md"
            label-color="primary"
            color="secondary"
            bg-color="grey-3"
            popup-content-style="background-color:#222831; color:white"
            filled
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="specialtyInput"
            label="Specialty *"
            hint="Write your specialty (Press enter to confirm)"
            hide-hint
            autogrow
            class="select"
            label-color="primary"
            lazy-rules
            v-on:keydown.enter.prevent="
              () => {
                if (this.specialtyInput) {
                  this.addSpecialty();
                  this.$emit('specialties', this.specialties);
                }
              }
            "
            :rules="[
              (val) =>
                (val && val.length > 1 && val.length <= 100) ||
                'Please stay between 1-100 characters',
              (val) =>
                (val && this.skillSelect.length > 0) ||
                'Please select which skill this specialty is for first!',
            ]"
          />
          <q-separator />
          <div class="text-h6" style="font-family: monospace">Specialties</div>

          <q-list bordered separator>
            <q-item
              v-for="(specialty, key) in specialties"
              :key="key"
              clickable
              v-ripple
              @click="removeSpecialty($event.target.id)"
            >
              <q-item-section :id="key"
                >Skill:
                {{
                  specialty.skill[0].toUpperCase() + specialty.skill.slice(1)
                }}
                - {{ specialty.specialty }}
                <q-tooltip class="bg-dark text-body2"
                  >Click to delete</q-tooltip
                >
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="advantages" class="q-m-b-xl" style="color: white">
          <div>
            These are not mandatory to be filled out now and can be withheld for
            later use.
          </div>
          <div class="q-my-sm">
            Remaining dots of advantages: {{ advantagePoints }}
          </div>
          <div class="q-my-sm">Remaining dots of flaws: {{ flawPoints }}</div>
          <div
            v-if="this.advantageCategory == 'Loresheets'"
            class="q-my-sm"
            style="color: red; font-weight: bold"
          >
            Loresheets are too varied and too numerous to handle automatically,
            the sheet will track the dots you take, but please assign any
            additional bonuses on your sheet manually after.
          </div>

          <q-separator />

          <q-select
            v-model="advantageCategory"
            :options="advantageCategories"
            label="Select merits and backgrounds"
            label-color="primary"
            bg-color="grey-3"
            color="secondary"
            popup-content-style="background-color:#222831; color:white"
            filled
            @update:model-value="changeAdvCat()"
          />
          <q-separator />
          <div
            v-if="
              this.advantageCategory === 'Merits' ||
              this.advantageCategory == 'Backgrounds' ||
              this.advantageCategory == 'Talismans' ||
              this.advantageCategory == 'Loresheets'
            "
          >
            <q-select
              v-model="meritCategory"
              :options="filteredOptions"
              class="q-my-sm"
              :label="this.advantageCategory + ' Category'"
              label-color="primary"
              bg-color="grey-3"
              filled
              color="secondary"
              popup-content-style="background-color:#222831; color:white"
              @filter="filterFn"
              use-input
              input-debounce="0"
              @update:model-value="changeMeritCat()"
            />
          </div>
          <q-separator />
          <div
            v-if="this.meritCategory && this.advantageCategory !== 'Loresheets'"
          >
            <q-select
              v-model="advOrFlaw"
              :options="advorFlawOptions()"
              label="Select advantages or flaws"
              label-color="primary"
              class="q-mb-sm"
              bg-color="grey-3"
              popup-content-style="background-color:#222831; color:white"
              filled
              color="secondary"
            />
          </div>
          <q-separator />
          <div v-if="this.advOrFlaw">
            <q-select
              v-model="advFlawChoice"
              :options="meritOptions()"
              label="Choose your merit"
              label-color="primary"
              bg-color="grey-3"
              filled
              color="secondary"
              option-label="name"
              popup-content-style="background-color:#222831; color:white"
              @update:model-value="clearDotField()"
            />
          </div>
          <div
            v-if="
              this.advFlawChoice.maxCost ||
              (this.advantageCategory === 'Loresheets' && this.meritCategory)
            "
          >
            <q-select
              v-model="howManyDots"
              :options="dotOptions()"
              label="Choose how many dots"
              label-color="primary"
              bg-color="grey-3"
              class="q-mt-sm"
              filled
              color="secondary"
              popup-content-style="background-color:#222831; color:white"
              @update:model-value="costAdjustment()"
            />
          </div>

          <div v-if="this.advFlawChoice.specNeeded === true">
            <q-input
              autogrow
              hint="Briefly elaborate on what this merit is"
              hide-hint
              v-model="specificationInput"
              label="Specify this merit"
              label-color="primary"
              bg-color="grey-3"
              v-on:keydown.enter.prevent="
                () => {
                  this.meritPicked();
                }
              "
              class="q-mt-sm"
              filled
              lazy-rules
              :rules="[
                (val) =>
                  (typeof val === 'string' &&
                    val.length > 3 &&
                    val.length <= 50) ||
                  'Please enter a brief description between 3-50 characters.',
              ]"
            />
          </div>
          <div v-if="this.advFlawChoice">
            Description: {{ this.advFlawChoice.desc }}
            <br />
            Dot Cost: {{ this.advFlawChoice.cost }} <br />
            <div v-if="this.advantageCategory === 'Talismans'">
              Single Use: {{ this.advFlawChoice.single_use ? "Yes" : "No" }}
            </div>
          </div>
          <div
            class="q-pa-lg"
            v-if="
              (this.advFlawChoice && !this.advFlawChoice.maxCost) ||
              (this.howManyDots && !this.advFlawChoice.specNeeded) ||
              (this.howManyDots &&
                this.advFlawChoice.specNeeded === true &&
                this.specificationInput.length >= 3)
            "
          >
            <q-btn
              label="Select Merit"
              @click="meritPicked()"
              color="primary"
            />
          </div>

          <div
            v-if="
              this.advantagesObj.merits.advantages.length > 0 ||
              this.advantagesObj.merits.flaws.length > 0
            "
          >
            <!-- Merits -->
            <span class="text-h6">Merits</span>
            <q-separator />
            <div class="q-my-sm" style="font-family: monospace">Advantages</div>

            <q-list bordered separator>
              <q-item
                v-for="(advantage, key) in advantagesObj.merits.advantages"
                :key="key"
                clickable
                v-ripple
                @click="
                  removeAdvantage(
                    $event.target.id,
                    advantage.cost,
                    advantage.name,
                    'merits'
                  )
                "
              >
                <q-item-section :id="key">
                  {{ advantage.name }}
                  - {{ advantage.cost }} dots
                  <q-tooltip class="bg-dark text-body2"
                    >Click to delete</q-tooltip
                  >
                </q-item-section>
              </q-item>
            </q-list>

            <div class="q-my-sm" style="font-family: monospace">Flaws</div>

            <q-list bordered separator>
              <q-item
                v-for="(flaw, key) in advantagesObj.merits.flaws"
                :key="key"
                clickable
                v-ripple
                @click="
                  removeFlaw($event.target.id, flaw.cost, flaw.name, 'merits')
                "
              >
                <q-item-section :id="key">
                  {{ flaw.name }}
                  - {{ flaw.cost }} dots
                  <q-tooltip class="bg-dark text-body2"
                    >Click to delete</q-tooltip
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <br />
          <!-- Backgrounds -->
          <div
            v-if="
              this.advantagesObj.backgrounds.advantages.length > 0 ||
              this.advantagesObj.backgrounds.flaws.length > 0
            "
          >
            <span class="text-h6">Backgrounds</span>
            <q-separator />
            <div class="q-my-sm" style="font-family: monospace">Advantages</div>

            <q-list bordered>
              <q-item
                v-for="(advantage, key) in advantagesObj.backgrounds.advantages"
                :key="key"
                clickable
                v-ripple
                @click="
                  removeAdvantage(
                    $event.target.id,
                    advantage.cost,
                    advantage.name,
                    'backgrounds'
                  )
                "
              >
                <q-item-section :id="key"
                  >Advantage:
                  {{ advantage.name }}
                  - {{ advantage.cost }} dots
                  <q-tooltip class="bg-dark text-body2"
                    >Click to delete</q-tooltip
                  >
                </q-item-section>
              </q-item>
            </q-list>

            <div class="q-my-sm" style="font-family: monospace">Flaws</div>

            <q-list bordered>
              <q-item
                v-for="(flaw, key) in advantagesObj.backgrounds.flaws"
                :key="key"
                clickable
                v-ripple
                @click="
                  removeFlaw(
                    $event.target.id,
                    flaw.cost,
                    flaw.name,
                    'backgrounds'
                  )
                "
              >
                <q-item-section :id="key">
                  {{ flaw.name }}
                  - {{ flaw.cost }} dots
                  <q-tooltip class="bg-dark text-body2"
                    >Click to delete</q-tooltip
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <br />
          <!-- Talismans -->
          <div v-if="this.advantagesObj.talismans.advantages.length > 0">
            <span class="text-h6">Talismans</span>
            <q-separator />
            <div class="q-my-sm" style="font-family: monospace">Advantages</div>

            <q-list bordered>
              <q-item
                v-for="(advantage, key) in advantagesObj.talismans.advantages"
                :key="key"
                clickable
                v-ripple
                @click="
                  removeAdvantage(
                    $event.target.id,
                    advantage.cost,
                    advantage.name,
                    'talismans'
                  )
                "
              >
                <q-item-section :id="key"
                  >Advantage:
                  {{ advantage.name }}
                  - {{ advantage.cost }} dots
                  <q-tooltip class="bg-dark text-body2"
                    >Click to delete</q-tooltip
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <br />
          <!-- Loresheets -->
          <div v-if="this.advantagesObj.loresheets.advantages.length > 0">
            <span class="text-h6">Loresheets</span>
            <q-separator />
            <div class="q-my-sm" style="font-family: monospace">Advantages</div>

            <q-list bordered>
              <q-item
                v-for="(advantage, key) in advantagesObj.loresheets.advantages"
                :key="key"
                clickable
                v-ripple
                @click="
                  removeAdvantage(
                    $event.target.id,
                    advantage.cost,
                    advantage.name,
                    'loresheets'
                  )
                "
              >
                <q-item-section :id="key"
                  >Advantage:
                  {{ advantage.name }}
                  - {{ advantage.cost }} dots
                  <q-tooltip class="bg-dark text-body2"
                    >Click to delete</q-tooltip
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <br />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
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
@media only screen and (max-width: 600px) {
  .select {
    width: 300px;
  }
  .tabs {
    width: 300px;
  }
}
</style>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";
import allMerits from "../werewolf/5eMerits.json";
import allBackgrounds from "../werewolf/5eBackgrounds.json";
import talismans from "../werewolf/5eTalismans.json";
import loresheets from "../werewolf/loresheets.json";

export default defineComponent({
  name: "v5-tabs",
  props: [
    "specialtiePoints",
    "specials",
    "fullSkills",
    "specialtiesFromPred",
    "advantagePoints",
    "flawPoints",
    "advantagesObj",
    "debug",
    "xp",
    "charName",
    "concept",
    "chronicle",
    "touchstones",
  ],
  emits: [
    "update:specialtiePoints",
    "update:advantagePoints",
    "update:flawPoints",
    "update:advantagesObj",
    "update:xp",
    "specialties",
    "update:touchstones",
    "update:charName",
    "update:concept",
    "update:chronicle",
    "update:touchstones",
  ],

  setup(props) {
    function range(size, startAt = 0) {
      return [...Array(size).keys()].map((i) => i + startAt);
    }

    return {
      range,
      tab: ref("coreConcept"),
    };
  },
  data(props) {
    return {
      xpRules: [
        (val) => (val !== null && val !== "") || "Please type your xp amount",
        (val) =>
          (val > 0 && val < 100 && !isNaN(val)) ||
          "Please type a valid number between 0 & 100",
      ],
      advantagesArr: [],
      allMerits: allMerits.Merits,
      allBackgrounds: allBackgrounds.Backgrounds,
      advOrFlaw: "",
      advFlawChoice: "",

      howManyDots: "",
      specificationInput: "",
      advantageCategory: "",
      tabCharName: props.charName,
      filteredOptions: [],
      redemptionChoice: props.redemption,
      cellInput: props.cell,
      xpInput: props.xp,
      touchStoneInput: "",
      tabTouchStones: props.touchstones,
      tabChronicle: props.chronicle,
      talismans,
      tabConcept: props.concept,
      meritCategory: "",
      cultCategory: "",
      advantageCategories: ["Merits", "Backgrounds", "Talismans", "Loresheets"],
      specialtyInput: "",
      skillSelect: "",
      specialties: props.specials,
      loresheets,
    };
  },
  methods: {
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.filteredOptions = this.meritCatOptions();
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();

        this.filteredOptions = this.meritCatOptions().filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    removeTouchstone(event) {
      this.tabTouchStones.splice(event, 1);
    },
    removeSpecialty(event) {
      this.specialties.splice(event, 1);
      this.handlePoints(false);
    },
    removeAdvantage(event, cost, name, category) {
      let modifiedObj = { ...{}, ...this.advantagesObj };
      modifiedObj[category].advantages.splice(event, 1);
      this.$emit("update:advantagesObj", { ...{}, ...modifiedObj });
      this.$emit("update:advantagePoints", this.advantagePoints + cost);
    },
    removeFlaw(event, cost, name, category) {
      let modifiedObj = { ...{}, ...this.advantagesObj };
      modifiedObj[category].flaws.splice(event, 1);
      this.$emit("update:advantagesObj", { ...{}, ...modifiedObj });
      this.$emit("update:flawPoints", this.flawPoints + cost);
    },
    sortSkills() {
      let optionsArr = [];
      for (const skill in this.fullSkills) {
        if (this.fullSkills[skill] > 0) {
          optionsArr.push(skill[0].toUpperCase() + skill.slice(1));
        }
      }
      return optionsArr;
    },
    addSpecialty() {
      if (this.handlePoints(true) === false) {
        return;
      }
      this.specialties.push({
        skill: this.skillSelect.toLowerCase(),
        specialty: this.specialtyInput,
      });
      this.specialtyInput = "";
      this.skillSelect = "";
    },
    handlePoints(data) {
      let points = this.specialtiePoints;
      if (points === 0 && data === true) {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: "Out of specialties",
        });
        return false;
      }
      if (data === true) {
        points--;
      } else {
        points++;
      }
      this.$emit("update:specialtiePoints", points);
    },
    advorFlawOptions() {
      let arr = ["Advantages", "Flaws"];
      let meritCat = "Merits";
      switch (this.advantageCategory) {
        case "Merits":
          meritCat = allMerits.Merits[this.meritCategory];
          break;

        case "Backgrounds":
          meritCat = allBackgrounds.Backgrounds[this.meritCategory];
          break;
        case "Talismans":
          meritCat = talismans["Talismans"][this.meritCategory];

          break;
      }

      if (
        this.advantageCategory === "Loresheets" ||
        meritCat.flaws.length === 0
      ) {
        arr = ["Advantages"];
        this.advOrFlaw = "Advantages";
      }

      return arr;
    },
    meritCatOptions() {
      let arr = [];
      switch (this.advantageCategory) {
        case "Merits":
          arr = Object.keys(allMerits.Merits);
          break;

        case "Backgrounds":
          arr = Object.keys(allBackgrounds.Backgrounds);
          break;
        case "Talismans":
          arr = Object.keys(talismans["Talismans"]);
          break;

        case "Loresheets":
          for (const [key, value] of Object.entries(
            this.loresheets.loresheets
          )) {
            if (
              value.Prerequisite !== null &&
              !value.Prerequisite.includes(this.clan)
            ) {
              continue;
            }
            arr.push(value.Name);
          }

          break;
      }

      return arr;
    },
    meritOptions() {
      let arr = [];
      if (this.advOrFlaw.toLowerCase() === "advantages") {
        switch (this.advantageCategory) {
          case "Merits":
            arr = allMerits.Merits[this.meritCategory].advantages;
            break;

          case "Backgrounds":
            arr = allBackgrounds.Backgrounds[this.meritCategory].advantages;
            break;
          case "Talismans":
            arr = talismans["Talismans"][this.meritCategory].advantages;
            break;
        }
      }
      if (this.advOrFlaw.toLowerCase() === "flaws") {
        switch (this.advantageCategory) {
          case "Merits":
            arr = allMerits.Merits[this.meritCategory].flaws;
            break;

          case "Backgrounds":
            arr = allBackgrounds.Backgrounds[this.meritCategory].flaws;
            break;

          case "Talismans":
            arr = talismans["Talismans"][this.meritCategory].flaws;
            break;
        }
      }

      return arr;
    },
    dotOptions() {
      let arr = [];

      if (this.advantageCategory === "Loresheets") {
        return this.range(5, 1);
      }

      arr = this.range(this.advFlawChoice.maxCost, 1);

      return arr;
    },
    costAdjustment() {
      if (this.howManyDots && this.advantageCategory === "Loresheets") {
        let loresheet = this.loresheets.loresheets.find(
          (x) => x.Name === this.meritCategory
        );
        this.advFlawChoice = {
          name: loresheet.Name,
          desc: loresheet.Description,
          cost: this.howManyDots,
        };
      }

      if (this.howManyDots && this.advantageCategory !== "Loresheets") {
        this.advFlawChoice.cost = this.howManyDots;
      }
    },
    clearDotField() {
      this.howManyDots = "";
    },

    changeAdvCat() {
      this.advFlawChoice = "";
      this.advOrFlaw = "";
      this.meritCategory = "";
      this.howManyDots = "";
      this.specificationInput = "";
    },

    changeMeritCat() {
      this.advFlawChoice = "";
      this.advOrFlaw = "";
      this.howManyDots = "";
      this.specificationInput = "";
    },

    clearFields() {
      this.advFlawChoice = "";
      this.advOrFlaw = "";
      this.meritCategory = "";
      this.advantageCategory = "";
      this.howManyDots = "";
      this.specificationInput = "";
    },

    sortAdvantageChoice(choiceObj, advOrFlaw) {
      let modifiedObj = { ...{}, ...this.advantagesObj };

      switch (this.advantageCategory) {
        case "Merits":
          if (advOrFlaw === true) {
            modifiedObj.merits.advantages.push(choiceObj);
          } else {
            modifiedObj.merits.flaws.push(choiceObj);
          }
          break;

        case "Backgrounds":
          let bg_choice = { ...choiceObj };

          if (this.specificationInput) {
            bg_choice.name = choiceObj.name + this.specificationInput;
          }
          if (advOrFlaw === true) {
            modifiedObj.backgrounds.advantages.push(bg_choice);
          } else {
            modifiedObj.backgrounds.flaws.push(bg_choice);
          }
          break;

        case "Talismans":
          if (advOrFlaw === true) {
            modifiedObj.talismans.advantages.push(choiceObj);
          } else {
            modifiedObj.talismans.flaws.push(choiceObj);
          }
          break;
        case "Loresheets":
          if (advOrFlaw === true) {
            modifiedObj.loresheets.advantages.push(choiceObj);
          } else {
            modifiedObj.loresheets.flaws.push(choiceObj);
          }
          break;
      }

      if (advOrFlaw === true) {
        this.$emit(
          "update:advantagePoints",
          this.advantagePoints - choiceObj.cost
        );
      } else {
        this.$emit("update:flawPoints", this.flawPoints - choiceObj.cost);
      }

      this.$emit("update:advantagesObj", { ...{}, ...modifiedObj });
    },

    canPurchase(advOrFlaw) {
      //true = advantage, false = flaw
      if (advOrFlaw === true) {
        if (
          this.advantagePoints < this.advFlawChoice.cost ||
          this.howManyDots > this.advantagePoints
        ) {
          this.$q.notify({
            type: "negative",
            textColor: "white",
            message: "Not enough advantage dots remaining!",
          });
          return false;
        }
      } else {
        if (
          this.flawPoints < this.advFlawChoice.cost ||
          this.howManyDots > this.flawPoints
        ) {
          this.$q.notify({
            type: "negative",
            textColor: "white",
            message: "Not enough flaw dots remaining!",
          });
          return false;
        }
      }

      if (
        this.advFlawChoice.name === "Zeroed" ||
        this.advFlawChoice.name === "Cobbler"
      ) {
        let mask = this.advantagesObj.backgrounds.advantages.find(
          (x) => x.name === "Mask"
        );
        if (typeof mask == "undefined" || mask.cost < 2) {
          this.$q.notify({
            type: "negative",
            textColor: "white",
            message: "You must have 2 dots in mask to take this background!",
          });
          return false;
        }
      }

      return true;
    },

    meritPicked() {
      let modifiedObj = { ...{}, ...this.advantagesObj };

      if (this.advantageCategory === "Loresheets") {
        if (this.canPurchase(true) === true) {
          this.sortAdvantageChoice(this.advFlawChoice, true);
          this.clearFields();
        }
      }

      if (this.advOrFlaw.toLowerCase() === "advantages") {
        //true represents an advantage, false a flaw
        if (this.canPurchase(true) === true) {
          this.sortAdvantageChoice(this.advFlawChoice, true);
          this.clearFields();
        }
      }

      if (this.advOrFlaw.toLowerCase() === "flaws") {
        if (this.canPurchase(false) === true) {
          this.sortAdvantageChoice(this.advFlawChoice, false);
          this.clearFields();
        }
      }
    },
  },
  computed: {},
});
</script>
