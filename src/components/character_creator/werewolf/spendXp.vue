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
              color="secondary"
              @update:model-value="clearBelowCat()"
              popup-content-style="background-color:#222831; color:white"
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
              color="secondary"
              class="q-my-sm"
              option-label="name"
              popup-content-style="background-color:#222831; color:white"
            />

            <q-separator class="q-my-sm" />

            <!-- Renown -->
            <q-select
              v-if="this.categoryInput === 'Renown'"
              v-model="renownCategory"
              :options="renownOpts"
              label="Which renown would you like to purchase?"
              label-color="primary"
              bg-color="grey-3"
              filled
              map-options
              option-label="renown_name"
              option-value="renown_id"
              color="secondary"
              class="q-my-sm"
              popup-content-style="background-color:#222831; color:white"
            />

            <!-- Specialty -->
            <q-select
              v-if="this.categoryInput === 'Specialty'"
              v-model="specialtyInput"
              :options="sortSkills"
              label="Which skill is this specialty for?"
              label-color="primary"
              bg-color="grey-3"
              color="secondary"
              filled
              class="q-my-sm"
              popup-content-style="background-color:#222831; color:white"
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
              color="secondary"
              class="q-my-sm"
              popup-content-style="background-color:#222831; color:white"
            />
            <!-- Purchase multiple dots -->
            <q-select
              v-if="
                this.categoryInput &&
                this.categoryInput !== 'Attributes' &&
                this.categoryInput !== 'Specialty' &&
                this.categoryInput !== 'Skills' &&
                this.categoryInput !== 'Renown'
              "
              v-model="dotsInput"
              :options="dotOptions"
              label="How many dots would you like to purchase??"
              label-color="primary"
              bg-color="grey-3"
              filled
              color="secondary"
              class="q-my-sm"
              popup-content-style="background-color:#222831; color:white"
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

              <q-badge v-if="this.renownCategory"
                >Current {{ this.renownCategory.renown_name }} Level:
                {{
                  this.renownTotal[
                    this.renownCategory.renown_name.toLowerCase()
                  ]
                }}</q-badge
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
    let baseUrl = "";
    let purchased_renown = ref(props.info.purchased_renown);
    let tribe_renown = ref(props.info.tribe_renown);

    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    return {
      dialogRef,
      onDialogHide,
      baseUrl: ref(baseUrl),
      purchased_renown,
      tribe_renown,

      onOKClick() {
        onDialogOK({
          advantages: advantagePoints,
          attributes: localAttributes,
          xp: localXP,
          specialtiesFromXp: specialtiesFromXp,
          skills: skills,
          spentXp: localSpentXp,

          purchased_renown: purchased_renown,
          tribe_renown: tribe_renown,
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
      canBuy: ref(true),
      attributeInput: ref(""),
      categoryInput: ref(""),

      specialtyInput: ref(""),
      specialtyDefinition: ref(""),
      dotsInput: ref(1),
      localAttributes,
      specialtiesFromXp,
      attributeOptions: ref(props.info.attributes),
      renownOpts: ref([]),
      renownCategory: ref(""),
      skills,
      skillCategory: ref(""),
    };
  },
  methods: {
    async generateRenownOpts() {
      try {
        const renownResponse = await this.$axios.get(
          this.baseUrl + "/garou/renown_types"
        );
        this.renownOpts = renownResponse.data;
      } catch (err) {
        console.log(err);
      }
    },

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

        case "Renown":
          if (!this.renownCategory) return;

          this.cost =
            (this.renownTotal[this.renownCategory.renown_name.toLowerCase()] +
              1) *
            5;
          if (
            this.renownTotal[this.renownCategory.renown_name.toLowerCase()] +
              1 >
            5
          ) {
            this.cost = "Renown is maxxed!";
            this.canBuy = false;
          }
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
      this.renownCategory = "";
    },
    clearBelowCat() {
      this.attributeInput = "";
      this.canBuy = true;
      this.cost = 1;
      this.dotsInput = 0;
      this.specialtyInput = "";
      this.specialtyDefinition = "";
      this.skillCategory = "";
      this.renownCategory = "";
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

        case "Renown":
          this.purchased_renown[
            this.renownCategory.renown_name.toLowerCase()
          ]++;
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

  async mounted() {
    await this.generateRenownOpts();
  },

  computed: {
    categoryOptions() {
      let arr = ["Advantage", "Attributes", "Renown", "Skills", "Specialty"];

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
    renownTotal() {
      let trueRenown = { glory: 0, honor: 0, wisdom: 0 };
      console.log(this.tribe_renown);
      trueRenown.glory = this.tribe_renown.glory + this.purchased_renown.glory;
      trueRenown.honor = this.tribe_renown.honor + this.purchased_renown.honor;
      trueRenown.wisdom =
        this.tribe_renown.wisdom + this.purchased_renown.wisdom;

      return trueRenown;
    },
  },
});
</script>
