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

            <!-- Edges -->
            <q-separator class="q-my-sm" />
            <q-select
              v-if="this.categoryInput === 'Edge'"
              bg-color="grey-3"
              filled
              label-color="primary"
              v-model="edgeCat"
              :options="Object.keys(edgesList)"
              label="Edge Category"
              option-label="dist"
            />
            <q-separator class="q-my-sm" />
            <q-select
              v-if="this.edgeCat"
              bg-color="grey-3"
              filled
              label-color="primary"
              v-model="edge"
              :options="Object.keys(edgesList[this.edgeCat].edges)"
              :label="this.edgeCat + ': ' + 'Edges'"
              option-label="dist"
            />
            <div v-if="this.edge" class="edgeDesc q-my-sm">
              {{ this.edgesList[edgeCat].edges[this.edge].desc }}
            </div>
            <!-- Perks -->
            <q-select
              v-if="this.categoryInput === 'Perk'"
              bg-color="grey-3"
              filled
              :options="perkOptions"
              label-color="primary"
              v-model="perk"
              label="Select your perks"
              option-label="name"
            />
            <div v-if="this.perk" class="edgeDesc q-my-sm">
              {{ this.perk.parent }} - {{ this.perk.desc }}
            </div>
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
                this.categoryInput !== 'Specialty' &&
                this.categoryInput !== 'Skills' &&
                this.categoryInput !== 'Edge' &&
                this.categoryInput !== 'Perk'
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
import edgesList from "../hunter/edgesAndPerks.json";

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

    let skills = ref(props.info.skills);
    let specialtiesFromXp = ref(props.info.specialtiesFromXp);
    let localSpentXp = ref(props.info.spentXp);
    let localEdgeArr = ref(props.info.edgeArr);
    return {
      dialogRef,
      onDialogHide,
      onOKClick() {
        onDialogOK({
          advantages: advantagePoints,
          attributes: localAttributes,
          xp: localXP,
          specialtiesFromXp: specialtiesFromXp,
          skills: skills,
          spentXp: localSpentXp,
          edgeArr: localEdgeArr,
        });
      },
      range,

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,

      //Begin actual vars below
      advantagePoints,
      cost: ref(0),
      localXP,
      localSpentXp,
      edgeCat: ref(""),
      edge: ref(""),
      perk: ref(""),
      edgesList,
      localEdgeArr,
      canBuy: ref(true),
      attributeInput: ref(""),
      categoryInput: ref(""),

      specialtyInput: ref(""),
      specialtyDefinition: ref(""),
      dotsInput: ref(1),
      localAttributes,
      specialtiesFromXp,
      attributeOptions: ref(props.info.attributes),

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
        case "Edge":
          this.cost = 7;
          break;
        case "Perk":
          this.cost = 3;
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
      }

      return this.cost;
    },
    clearFields() {
      this.dotsInput = 0;
      this.categoryInput = "";
      this.attributeInput = "";
      this.canBuy = true;
      this.cost = 1;
      this.specialtyInput = "";
      this.specialtyDefinition = "";
      this.skillCategory = "";
      this.edgeCat = "";
      this.edge = "";
      this.perk = "";
    },
    clearBelowCat() {
      this.attributeInput = "";
      this.canBuy = true;
      this.cost = 1;
      this.dotsInput = 0;
      this.specialtyInput = "";
      this.specialtyDefinition = "";
      this.skillCategory = "";
      this.edgeCat = "";
      this.edge = "";
      this.perk = "";
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
        case "Edge":
          this.localEdgeArr.edges.push({
            category: this.edgeCat,
            edge: this.edge,
          });
          break;
        case "Perk":
          this.localEdgeArr.perks.push({
            category: this.perk.parent,
            perk: this.perk.name,
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
      }
      this.localXP = this.localXP - this.cost;
      this.localSpentXp = this.localSpentXp + this.cost;
      this.clearFields();
    },
  },

  computed: {
    categoryOptions() {
      let arr = [
        "Advantage",
        "Attributes",
        "Edge",
        "Perk",
        "Skills",
        "Specialty",
      ];

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
      }
      let arr = [];
      if (!isNaN(costRange)) {
        arr = this.range(costRange, 1);
      }

      return arr;
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

    perkOptions() {
      let arr = [];
      this.localEdgeArr.edges.forEach((edge) => {
        arr = arr.concat(this.edgesList[edge.category].edges[edge.edge].perks);
      });

      return arr;
    },
  },
});
</script>
