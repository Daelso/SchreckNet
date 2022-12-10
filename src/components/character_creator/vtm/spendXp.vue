<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout view="Lhh lpR fff" container>
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>Spend XP - {{ localXP }} Remaining</q-toolbar-title>
          <q-btn color="primary" label="Save" @click="onOKClick"> </q-btn>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page padding class="bg-dark">
          <div class="q-pa-md doc-container">
            <q-select
              v-model="categoryInput"
              :options="categoryOptions"
              label="Which category would you like to spend xp in?"
              label-color="primary"
              bg-color="grey-3"
              filled
              @update:model-value="clearBelowCat()"
            />
            <!-- Attributes -->
            <q-select
              v-if="this.categoryInput === 'Attributes'"
              v-model="attributeInput"
              :options="attributeOptions"
              label="Which attribute would you like to upgrade?"
              label-color="primary"
              bg-color="grey-3"
              filled
              class="q-my-sm"
              option-label="name"
            />
            <!-- Clan Disciplines and Caitiff Disciplines -->
            <q-select
              v-if="
                this.categoryInput === 'Clan Discipline' ||
                this.categoryInput === 'Caitiff Discipline' ||
                this.categoryInput === 'Out of Clan Discipline'
              "
              v-model="clanDiscInput"
              :options="clanDiscOptions"
              :label="
                this.categoryInput === 'Clan Discipline'
                  ? 'Which clan discipline would you like to upgrade?'
                  : this.categoryInput === 'Caitiff Discipline'
                  ? 'Which Caitiff Discipline would you like to upgrade?'
                  : 'Which out of clan discipline would you like to upgrade?'
              "
              label-color="primary"
              bg-color="grey-3"
              filled
              class="q-my-sm"
            />
            <q-select
              v-if="this.clanDiscInput"
              v-model="disciplinePower"
              :label="this.clanDiscInput + ' Skills Available'"
              :options="disciplineOptions"
              bg-color="grey-3"
              filled
              label-color="primary"
              option-label="label"
            />
            <!-- Specialty -->
            <q-select
              v-if="this.categoryInput === 'Specialty'"
              v-model="specialtyInput"
              :options="sortSkills"
              label="Which skill is this specialty for?"
              label-color="primary"
              bg-color="grey-3"
              filled
              class="q-my-sm"
            />
            <q-input
              v-if="this.specialtyInput && this.categoryInput !== 'Skills'"
              v-model="specialtyDefinition"
              label="Define your specialty"
              label-color="primary"
              bg-color="grey-3"
              filled
              class="q-my-sm"
            />
            <!-- Skills -->
            <q-select
              v-if="this.categoryInput === 'Skills'"
              v-model="skillCategory"
              :options="purchaseSkillsOpts"
              label="Which skill would you like to purchase?"
              label-color="primary"
              bg-color="grey-3"
              filled
              class="q-my-sm"
            />
            <!-- Purchase multiple dots -->
            <q-select
              v-if="
                this.categoryInput &&
                this.categoryInput !== 'Attributes' &&
                this.categoryInput !== 'Clan Discipline' &&
                this.categoryInput !== 'Specialty' &&
                this.categoryInput !== 'Caitiff Discipline' &&
                this.categoryInput !== 'Out of Clan Discipline' &&
                this.categoryInput !== 'Skills'
              "
              v-model="dotsInput"
              :options="dotOptions"
              label="How many dots would you like to purchase??"
              label-color="primary"
              bg-color="grey-3"
              filled
              class="q-my-sm"
            />
            <div class="upgradeCost" v-if="this.categoryInput">
              <q-badge v-if="this.attributeInput"
                >Current {{ this.attributeInput.name }} Level:
                {{ this.attributeInput.points }}</q-badge
              >

              <q-badge v-if="this.clanDiscInput"
                >Current {{ this.clanDiscInput }} Level:
                {{ this.disciplines[this.clanDiscInput] }}</q-badge
              >

              <q-badge v-if="this.skillCategory"
                >Current {{ this.skillCategory }} Level:
                {{ this.skills[this.skillCategory.toLowerCase()] }}</q-badge
              >

              <q-badge>Cost to Purchase: {{ this.calculateUpgrade() }}</q-badge>
              <div class="q-mt-sm" v-if="this.cost > 0">
                <q-btn
                  flat
                  label="Purchase"
                  @click="purchaseMade()"
                  color="white"
                  class="bg-primary"
                />
              </div>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
import { ref, defineComponent } from "vue";
import { useDialogPluginComponent } from "quasar";
import clanDisciplines from "../vtm/5eClanDiscs.json";
import disciplineSkills from "../vtm/5eDisciplines.json";

export default defineComponent({
  name: "spendXP",
  props: ["info"],
  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    function range(size, startAt = 0) {
      return [...Array(size).keys()].map((i) => i + startAt);
    }
    let localXP = ref(props.info.xp);
    let advantagePoints = ref(0);
    let localAttributes = ref(props.info.attributes);
    let potency = ref(props.info.potency);
    let disciplines = ref(props.info.disciplines);
    let disciplineSkillsObj = ref(props.info.disciplineSkills);
    let skills = ref(props.info.skills);
    let specialtiesFromXp = ref(props.info.specialtiesFromXp);
    return {
      dialogRef,
      onDialogHide,
      onOKClick() {
        onDialogOK({
          advantages: advantagePoints,
          attributes: localAttributes,
          disciplines: disciplines,
          disciplineSkillsObj: disciplineSkillsObj,
          potency: potency,
          xp: localXP,
          specialtiesFromXp: specialtiesFromXp,
          skills: skills,
        });
      },
      range,

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,

      //Begin actual vars below
      advantagePoints,
      cost: ref(0),
      localXP,
      canBuy: ref(true),
      clanDisciplines,
      disciplineSkills,
      disciplineSkillsObj,
      attributeInput: ref(""),
      categoryInput: ref(""),
      clanDiscInput: ref(""),
      disciplinePower: ref(""),
      specialtyInput: ref(""),
      specialtyDefinition: ref(""),
      dotsInput: ref(1),
      localAttributes,
      specialtiesFromXp,
      attributeOptions: ref(props.info.attributes),
      clan: ref(props.info.clan),
      potency,
      disciplines,
      skills,
      skillCategory: ref(""),
    };
  },
  methods: {
    calculateUpgrade() {
      switch (this.categoryInput) {
        case "Advantage":
          this.cost = this.dotsInput * 3;
          break;
        case "Attributes":
          this.cost = (this.attributeInput.points + 1) * 5;
          if (this.attributeInput.points + 1 > 5) {
            this.cost = "Attribute is maxxed!";
            this.canBuy = false;
          }
          break;
        case "Blood Potency":
          this.cost = (this.potency + 1) * 10;
          break;
        case "Blood Sorcery Ritual":
          // code block
          break;
        case "Caitiff Discipline":
          if (this.disciplines[this.clanDiscInput] === 0) {
            this.cost = 6;
            break;
          }
          this.cost = this.disciplines[this.clanDiscInput] * 6;
          break;
        case "Clan Discipline":
          if (this.disciplines[this.clanDiscInput] === 0) {
            this.cost = 5;
            break;
          }
          this.cost = this.disciplines[this.clanDiscInput] * 5;
          break;
        case "Out of Clan Discipline":
          if (this.disciplines[this.clanDiscInput] === 0) {
            this.cost = 7;
            break;
          }
          this.cost = this.disciplines[this.clanDiscInput] * 7;
          break;
        case "Skills":
          if (this.skills[this.skillCategory.toLowerCase()] === 0) {
            this.cost = 3;
            break;
          }
          if (this.skills[this.skillCategory.toLowerCase()] + 1 > 5) {
            this.cost = "Skill is maxxed!";
            this.canBuy = false;
          }
          this.cost = this.skills[this.skillCategory.toLowerCase()] * 3;
          break;
        case "Specialty":
          this.cost = 3;
          break;
        case "Thin-Blood Alchemy":
          // code block
          break;
      }

      return this.cost;
    },
    clearFields() {
      this.dotsInput = 0;
      this.categoryInput = "";
      this.attributeInput = "";
      this.canBuy = true;
      this.cost = 1;
      this.clanDiscInput = "";
      this.disciplinePower = "";
      this.specialtyInput = "";
      this.specialtyDefinition = "";
      this.skillCategory = "";
    },
    clearBelowCat() {
      this.attributeInput = "";
      this.canBuy = true;
      this.cost = 1;
      this.dotsInput = 0;
      this.clanDiscInput = "";
      this.disciplinePower = "";
      this.specialtyInput = "";
      this.specialtyDefinition = "";
      this.skillCategory = "";
    },

    purchaseMade() {
      if (this.cost > this.localXP) {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: "Not enough xp to complete this purchase!",
        });
        return;
      }
      if (this.canBuy === false) {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: "Unable to complete this purchase.",
        });
        return;
      }
      switch (this.categoryInput) {
        case "Advantage":
          this.advantagePoints = this.advantagePoints + this.dotsInput;
          break;
        case "Attributes":
          let index = this.localAttributes.findIndex(
            (x) => x.name == this.attributeInput.name
          );
          this.attributeInput.points++;
          this.localAttributes[index] = { ...{}, ...this.attributeInput };
          break;
        case "Blood Potency":
          this.potency = this.potency + this.dotsInput;
          break;
        case "Blood Sorcery Ritual":
          // code block
          break;
        case "Caitiff Discipline":
          if (
            this.disciplineSkillsObj.filter(
              (e) => e.skill === this.disciplinePower
            ).length > 0
          ) {
            this.disciplinePower = "";
            this.$q.notify({
              type: "negative",
              textColor: "white",
              message: "You have already selected this skill!",
            });
            return;
          }

          this.disciplines[this.clanDiscInput]++;
          this.disciplineSkillsObj.push({
            discipline: this.clanDiscInput,
            skill: this.disciplinePower,
          });
          break;
        case "Clan Discipline":
          if (
            this.disciplineSkillsObj.filter(
              (e) => e.skill === this.disciplinePower
            ).length > 0
          ) {
            this.disciplinePower = "";
            this.$q.notify({
              type: "negative",
              textColor: "white",
              message: "You have already selected this skill!",
            });
            return;
          }

          this.disciplines[this.clanDiscInput]++;
          this.disciplineSkillsObj.push({
            discipline: this.clanDiscInput,
            skill: this.disciplinePower,
          });
          break;
        case "Out of Clan Discipline":
          if (
            this.disciplineSkillsObj.filter(
              (e) => e.skill === this.disciplinePower
            ).length > 0
          ) {
            this.disciplinePower = "";
            this.$q.notify({
              type: "negative",
              textColor: "white",
              message: "You have already selected this skill!",
            });
            return;
          }

          this.disciplines[this.clanDiscInput]++;
          this.disciplineSkillsObj.push({
            discipline: this.clanDiscInput,
            skill: this.disciplinePower,
          });
          break;
        case "Skills":
          this.skills[this.skillCategory.toLowerCase()]++;
          break;
        case "Specialty":
          this.specialtiesFromXp.push({
            skill: this.specialtyInput,
            specialty: this.specialtyDefinition,
          });
          break;
        case "Thin-Blood Alchemy":
          // code block
          break;
      }
      this.localXP = this.localXP - this.cost;
      // this.clearFields();
    },
  },

  computed: {
    categoryOptions() {
      let arr = [
        "Advantage",
        "Attributes",
        "Blood Potency",
        "Caitiff Discipline",
        "Clan Discipline",
        "Out of Clan Discipline",
        "Skills",
        "Specialty",
      ];
      if (this.clan !== "Caitiff") {
        arr = arr.filter((x) => x !== "Caitiff Discipline");
      }

      if (this.clan === "Caitiff") {
        arr = arr.filter(
          (x) => x !== "Clan Discipline" && x !== "Out of Clan Discipline"
        );
      }

      if (!("Thin-blood Alchemy" in this.disciplines)) {
        arr = arr.filter((x) => x !== "Thin-Blood Alchemy");
      }

      if (!("Blood Sorcery" in this.disciplines)) {
        arr = arr.filter((x) => x !== "Blood Sorcery Ritual");
      }

      return arr;
    },
    dotOptions() {
      let costRange = 0;
      switch (this.categoryInput) {
        case "Advantage":
          costRange = Math.floor(this.localXP / 3);
          break;
        case "Attributes":
          costRange = Math.floor(this.localXP / this.cost);
          break;
        case "Blood Potency":
          costRange = Math.floor(this.localXP / this.cost > 0);
          break;
        case "Blood Sorcery Ritual":
          // code block
          break;
        case "Caitiff Discipline":
          // code block
          break;
        case "Clan Discipline":
          // code block
          break;
        case "Out of Clan Discipline":
          // code block
          break;
        case "Skill":
          // code block
          break;
        case "Specialty":
          // code block
          break;
        case "Thin-Blood Alchemy":
          // code block
          break;
      }
      let arr = [];
      if (!isNaN(costRange)) {
        arr = this.range(costRange, 1);
      }

      return arr;
    },
    clanDiscOptions() {
      let arr = [];
      if (this.categoryInput === "Out of Clan Discipline") {
        arr = Object.keys(this.disciplines).filter(
          (discipline) =>
            !this.clanDisciplines.clans[this.clan].disciplines.includes(
              discipline
            )
        );
        return arr;
      }
      if (this.clan !== "Caitiff") {
        arr = this.clanDisciplines.clans[this.clan].disciplines;
        return arr;
      } else {
        let keyValueArr = Object.entries(this.disciplines);
        keyValueArr = keyValueArr.filter((x) => x[1] > 0);
        keyValueArr.forEach((x) => {
          arr.push(x[0]);
        });
      }
      return arr;
    },
    disciplineOptions() {
      let mergedOptions = [];
      for (let i = 0; i < this.disciplines[this.clanDiscInput] + 1; i++) {
        this.disciplineSkills.Disciplines[this.clanDiscInput].skills[i].forEach(
          (x) => {
            mergedOptions.push(x);
          }
        );
      }
      return mergedOptions;
    },
    sortSkills() {
      let optionsArr = [];
      for (const skill in this.skills) {
        if (this.skills[skill] > 0) {
          optionsArr.push(skill[0].toUpperCase() + skill.slice(1));
        }
      }
      return optionsArr;
    },
    purchaseSkillsOpts() {
      let optionsArr = [];
      for (const skill in this.skills) {
        if (this.skills[skill] < 5) {
          optionsArr.push(skill[0].toUpperCase() + skill.slice(1));
        }
      }
      return optionsArr.sort();
    },
  },
});
</script>
