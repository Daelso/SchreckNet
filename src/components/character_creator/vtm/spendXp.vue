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
            />
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
            <q-select
              v-if="this.categoryInput && this.categoryInput !== 'Attributes'"
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
    return {
      dialogRef,
      onDialogHide,
      onOKClick() {
        onDialogOK({
          advantages: advantagePoints,
          attributes: localAttributes,
          xp: localXP,
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
      attributeInput: ref(""),
      categoryInput: ref(""),
      dotsInput: ref(0),
      localAttributes,
      attributeOptions: ref(props.info.attributes),
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
          // code block
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

      return this.cost;
    },
    clearFields() {
      this.dotsInput = 0;
      this.categoryInput = "";
      this.attributeInput = "";
      this.canBuy = true;
      this.cost = 1;
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
          message: "Unable to coomplete this purchase.",
        });
        return;
      }
      switch (this.categoryInput) {
        case "Advantage":
          this.advantagePoints = this.advantagePoints + this.dotsInput;
          console.log(this.advantagePoints);
          break;
        case "Attributes":
          let index = this.localAttributes.findIndex(
            (x) => x.name == this.attributeInput.name
          );
          this.attributeInput.points++;
          this.localAttributes[index] = { ...{}, ...this.attributeInput };
          break;
        case "Blood Potency":
          // code block
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
        "Clan Discipline",
        "Out of Clan Discipline",
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
        case "Blood Potency":
          // code block
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
  },
});
</script>
