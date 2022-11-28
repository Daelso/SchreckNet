<template>
  <div class="q-pa-md row justify-center text-center">
    <q-card class="bg-primary">
      <q-tabs
        v-model="tab"
        class="bg-primary tabs"
        active-color="secondary"
        indicator-color="secondary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="coreConcept" label="Core Concept" />
        <q-tab name="touchstones" label="Touchstones/Convictions" />
        <q-tab
          :disable="sortSkills().length < 1"
          name="specialties"
          label="Specialties"
        >
          <q-tooltip v-if="sortSkills().length < 1" class="bg-dark text-body2"
            >Must have any skill over 1 to set specialties.</q-tooltip
          >
        </q-tab>
        <q-tab name="advantages" label="Advantages & Flaws"> </q-tab>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated class="bg-primary">
        <q-tab-panel name="coreConcept" class="q-m-b-xl">
          <q-input
            filled
            class="select"
            bg-color="grey-3"
            v-model="charName"
            label="Your character's name *"
            lazy-rules
            label-color="primary"
            @update:model-value="$emit('charName', this.charName)"
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
            v-model="concept"
            label="Character Concept *"
            autogrow
            hint="Who or what is this kindred?"
            hide-hint
            lazy-rules
            label-color="primary"
            @update:model-value="$emit('concept', this.concept)"
            :rules="[
              (val) =>
                (typeof val === 'string' &&
                  val.length <= 2000 &&
                  val.length >= 1) ||
                'Please keep this field between 50 and 2000 characters',
            ]"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="ambition"
            class="select"
            label="Ambition *"
            hint="Long term goals"
            hide-hint
            autogrow
            lazy-rules
            label-color="primary"
            @update:model-value="$emit('ambition', this.ambition)"
            :rules="[
              (val) =>
                (typeof val === 'string' && val.length <= 2000) ||
                'Please keep this field under 2000 characters',
            ]"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="desire"
            class="select"
            label="Desire *"
            hint="Specific, short-term goal"
            hide-hint
            autogrow
            label-color="primary"
            lazy-rules
            @update:model-value="$emit('desire', this.desire)"
            :rules="[
              (val) =>
                (typeof val === 'string' && val.length <= 2000) ||
                'Please keep this field under 2000 characters',
            ]"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="archetype"
            label="Archetype *"
            hint="Regain willpower when you fulfill your purpose. Examples: Judge, Guru, Gambler, Masochist "
            hide-hint
            autogrow
            class="select"
            label-color="primary"
            lazy-rules
            @update:model-value="this.$emit('archetype', this.archetype)"
            :rules="[
              (val) =>
                (typeof val === 'string' && val.length <= 2000) ||
                'Please keep this field under 2000 characters',
            ]"
          />
          <q-select
            v-model="sect"
            :options="sectOptions"
            label="Sect"
            label-color="primary"
            bg-color="grey-3"
            filled
            @update:model-value="this.$emit('sect', this.sect)"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="chronicle"
            label="Chronicle *"
            class="select q-mt-md"
            label-color="primary"
            lazy-rules
            @update:model-value="this.$emit('chronicle', this.chronicle)"
            :rules="[
              (val) =>
                (typeof val === 'string' && val.length <= 100) ||
                'Please keep this field under 100 characters',
            ]"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="sireInput"
            label="Your sire's name, if you know"
            autogrow
            lazy-rules
            label-color="primary"
            @update:model-value="this.$emit('update:sire', this.sireInput)"
            :rules="[
              (val) =>
                val === null ||
                val.length <= 2000 ||
                'Please keep this field under 2000 characters',
            ]"
          />
        </q-tab-panel>

        <q-tab-panel name="touchstones">
          <div class="q-mb-sm">
            Must have 1-3 convictions and as many touchstones as convictions.
          </div>
          <div class="q-mb-sm" style="color: white">
            Convictions and touchstones are
            <span v-if="this.convictions.length != this.touchstones.length"
              >NOT</span
            >
            equal.
          </div>
          <q-input
            filled
            bg-color="grey-3"
            v-model="convictionInput"
            label="Convictions *"
            hint="Human values your coterie attempts to uphold even after death. Must have 1-3. (Press enter to confirm)"
            hide-hint
            autogrow
            class="select"
            label-color="primary"
            lazy-rules
            v-on:keydown.enter.prevent="
              () => {
                if (!this.convictionInput) {
                  return;
                }
                if (this.convictions.length === 3) {
                  this.convicWarning();
                  return;
                }
                this.convictions.push(this.convictionInput);
                this.convictionInput = '';
                this.$emit('convictions', this.convictions);
              }
            "
            :rules="[
              (val) =>
                (typeof val === 'string' && val.length <= 2000) ||
                'Please keep this field under 2000 characters',
            ]"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="touchStoneInput"
            label="Touchstone *"
            hint="A specific human who embodies one of your convictions. You must have a touchstone for each conviction."
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
                this.touchstones.push(this.touchStoneInput);
                this.touchStoneInput = '';
                this.$emit('touchstones', this.touchstones);
              }
            "
            :rules="[
              (val) =>
                (typeof val === 'string' && val.length <= 2000) ||
                'Please keep this field under 2000 characters',
            ]"
          />
          <q-separator />
          <div class="text-h6" style="font-family: monospace">Convictions</div>

          <q-list bordered separator>
            <q-item
              v-for="(conviction, key) in convictions"
              :key="key"
              clickable
              v-ripple
              @click="removeConviction($event.target.id)"
            >
              <q-item-section :id="key"
                >{{ conviction }}
                <q-tooltip class="bg-dark text-body2"
                  >Click to delete</q-tooltip
                >
              </q-item-section>
            </q-item>
          </q-list>

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
            bg-color="grey-3"
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
          <q-separator />
          <div class="text-h6" style="font-family: monospace">
            Specialties from Predator Type
          </div>

          <q-list bordered separator>
            <q-item v-for="(specialty, key) in specialtiesFromPred" :key="key">
              <q-item-section :id="key"
                >Skill:
                {{
                  specialty.skill[0].toUpperCase() + specialty.skill.slice(1)
                }}
                - {{ specialty.specialty }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="advantages" class="q-m-b-xl">
          <div>
            These are not mandatory to be filled out now and can be withheld for
            later use.
          </div>
          <div class="q-my-sm">
            Remaining dots of advantages: {{ advantagePoints }}
          </div>
          <div class="q-my-sm">Remaining dots of flaws: {{ flawPoints }}</div>
          <q-separator />
          <div v-if="this.clan === 'Thin-Blood'">
            <div>
              Thin-Blood merits and flaws do not cost normal dots, they must be
              taken in a balanced amount.
            </div>
            <div class="q-my-sm">
              Thin-Blood Advantages: {{ thinAdvantages }}
            </div>
            <div class="q-my-sm">Thin-Blood Flaws: {{ thinFlaws }}</div>
          </div>
          <q-select
            v-model="advantageCategory"
            :options="advantageCategories"
            label="Select merits, backgrounds and loresheets"
            label-color="primary"
            bg-color="grey-3"
            filled
          />
          <q-separator />
          <div v-if="this.advantageCategory === 'Merits'">
            <q-select
              v-model="meritCategory"
              :options="meritCatOptions()"
              class="q-my-sm"
              label="Merit Category"
              label-color="primary"
              bg-color="grey-3"
              filled
            />
          </div>
          <q-separator />
          <div v-if="this.meritCategory">
            <q-select
              v-model="advOrFlaw"
              :options="advorFlawOptions()"
              label="Select advantages or flaws"
              label-color="primary"
              class="q-mb-sm"
              bg-color="grey-3"
              filled
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
              option-label="name"
            />
          </div>
          <div class="q-mt-sm" v-if="this.advFlawChoice">
            Description: {{ this.advFlawChoice.desc }}
            <br />
            Dot Cost: {{ this.advFlawChoice.cost }}
            <br />
            <q-btn
              flat
              label="Select Merit"
              @click="meritPicked()"
              color="white"
            />
          </div>

          <div class="text-h6" style="font-family: monospace">Advantages</div>

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
                  advantage.name
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

          <div class="text-h6" style="font-family: monospace">Flaws</div>

          <q-list bordered separator>
            <q-item
              v-for="(flaw, key) in advantagesObj.merits.flaws"
              :key="key"
              clickable
              v-ripple
              @click="removeFlaw($event.target.id, flaw.cost, flaw.name)"
            >
              <q-item-section :id="key"
                >Flaw:
                {{ flaw.name }}
                - {{ flaw.cost }} dots
                <q-tooltip class="bg-dark text-body2"
                  >Click to delete</q-tooltip
                >
              </q-item-section>
            </q-item>
          </q-list>
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
import allMerits from "../vtm/5eMerits.json";

export default defineComponent({
  name: "v5-tabs",
  props: [
    "specialtiePoints",
    "specials",
    "fullSkills",
    "specialtiesFromPred",
    "advantagePoints",
    "flawPoints",
    "sire",
    "age",
    "advantagesObj",
    "clan",
  ],
  emits: [
    "update:specialtiePoints",
    "update:advantagePoints",
    "update:flawPoints",
    "update:sire",
    "update:advantagesObj",
    "specialties",
    "convictions",
    "touchstones",
  ],
  setup() {
    return {
      tab: ref("coreConcept"),
    };
  },
  data(props) {
    return {
      advantagesArr: [],
      allMerits: allMerits.Merits,
      advOrFlaw: "",
      advFlawChoice: "",
      advantageCategory: "",
      ambition: "",
      archetype: "",
      charName: "",
      convictionInput: "",
      touchStoneInput: "",
      convictions: [],
      touchstones: [],
      chronicle: "",
      desire: "",
      concept: "",
      meritCategory: "",
      sect: "Camarilla",
      sectOptions: ["Anarch", "Camarilla", "Independent", "Sabbat", "Clanless"],
      advantageCategories: ["Merits", "Backgrounds"],
      specialtyInput: "",
      skillSelect: "",
      specialties: props.specials,
      sireInput: props.sire,
      thinFlaws: 0,
      thinAdvantages: 0,
    };
  },
  methods: {
    removeConviction(event) {
      this.convictions.splice(event, 1);
    },
    removeTouchstone(event) {
      this.touchstones.splice(event, 1);
    },
    removeSpecialty(event) {
      this.specialties.splice(event, 1);
      this.handlePoints(false);
    },
    removeAdvantage(event, cost, name) {
      if (name.includes("Thin-Blood")) {
        let modifiedObj = { ...{}, ...this.advantagesObj };
        modifiedObj.merits.advantages.splice(event, 1);
        this.thinAdvantages--;
        return;
      }
      let modifiedObj = { ...{}, ...this.advantagesObj };
      modifiedObj.merits.advantages.splice(event, 1);
      this.$emit("update:advantagesObj", { ...{}, ...modifiedObj });
      this.$emit("update:advantagePoints", this.advantagePoints + cost);
    },
    removeFlaw(event, cost, name) {
      if (name.includes("Thin-Blood")) {
        let modifiedObj = { ...{}, ...this.advantagesObj };
        modifiedObj.merits.flaws.splice(event, 1);
        this.thinFlaws--;
        return;
      }
      let modifiedObj = { ...{}, ...this.advantagesObj };
      modifiedObj.merits.flaws.splice(event, 1);
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
    convicWarning() {
      this.$q.notify({
        type: "negative",
        textColor: "white",
        message: "Maximum convictions reached!",
      });
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

      if (this.clan === "Thin-Blood" && this.meritCategory === "Thin-Blood") {
        if (this.thinAdvantages > this.thinFlaws) {
          arr = ["Flaws"];
        } else if (this.thinFlaws > this.thinAdvantages) {
          arr = ["Advantages"];
        }
      }

      return arr;
    },
    meritCatOptions() {
      let arr = Object.keys(allMerits.Merits);
      if (this.age.label !== "Ancillae") {
        arr = arr.filter((x) => x !== "Archaic");
      }
      if (this.clan !== "Thin-Blood") {
        arr = arr.filter((x) => x !== "Thin-Blood");
      }

      return arr;
    },
    meritOptions() {
      let arr = [];
      if (this.advOrFlaw.toLowerCase() === "advantages") {
        arr = allMerits.Merits[this.meritCategory].advantages;
      }
      if (this.advOrFlaw.toLowerCase() === "flaws") {
        arr = allMerits.Merits[this.meritCategory].flaws;
      }

      return arr;
    },
    meritPicked() {
      let modifiedObj = { ...{}, ...this.advantagesObj };
      if (this.advOrFlaw.toLowerCase() === "advantages") {
        if (this.clan === "Thin-Blood" && this.meritCategory === "Thin-Blood") {
          modifiedObj.merits.advantages.push(this.advFlawChoice);
          this.thinAdvantages++;
          this.advFlawChoice = "";
          this.advOrFlaw = "";
          this.meritCategory = "";
          this.advantageCategory = "";
          return;
        }

        if (this.advantagePoints < this.advFlawChoice.cost) {
          this.$q.notify({
            type: "negative",
            textColor: "white",
            message: "Not enough advantage dots remaining!",
          });
          return;
        }
        modifiedObj.merits.advantages.push(this.advFlawChoice);
        this.$emit("update:advantagesObj", { ...{}, ...modifiedObj });
        this.$emit(
          "update:advantagePoints",
          this.advantagePoints - this.advFlawChoice.cost
        );
      }

      if (this.advOrFlaw.toLowerCase() === "flaws") {
        if (this.clan === "Thin-Blood" && this.meritCategory === "Thin-Blood") {
          modifiedObj.merits.flaws.push(this.advFlawChoice);
          this.thinFlaws++;
          this.advFlawChoice = "";
          this.advOrFlaw = "";
          this.meritCategory = "";
          this.advantageCategory = "";
          return;
        }
        if (this.flawPoints < this.advFlawChoice.cost) {
          this.$q.notify({
            type: "negative",
            textColor: "white",
            message: "Not enough flaw dots remaining!",
          });
          return;
        }
        modifiedObj.merits.flaws.push(this.advFlawChoice);
        this.$emit("update:advantagesObj", { ...{}, ...modifiedObj });
        this.$emit(
          "update:flawPoints",
          this.flawPoints - this.advFlawChoice.cost
        );
      }
      this.advFlawChoice = "";
      this.advOrFlaw = "";
      this.meritCategory = "";
      this.advantageCategory = "";
    },
  },
});
</script>
