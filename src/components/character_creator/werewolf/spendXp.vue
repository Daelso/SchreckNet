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

            <!-- Gift Purchasing -->
            <q-select
              v-if="
                this.categoryInput === 'Native Gift' ||
                this.categoryInput === 'Tribe Gift' ||
                this.categoryInput === 'Auspice Gift'
              "
              v-model="giftSelection"
              :options="giftOptions()"
              label="Which gift would you like to purchase?"
              label-color="primary"
              bg-color="grey-3"
              filled
              color="secondary"
              class="q-my-sm"
              option-label="gift_name"
              map-options
              option-value="gift_id"
              popup-content-style="background-color:#222831; color:white"
            />

            <q-separator class="q-my-sm" />

            <div class="tribe-info" v-if="this.giftSelection">
              <div class="tribe">
                Gift Description:
                {{ this.giftSelection.gift_description }}
              </div>
              <div class="tribe">
                Cost:
                {{ this.giftSelection.cost }}
              </div>
              <div class="tribe">
                Pool:
                {{ this.giftSelection.pool }}
              </div>
            </div>

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

            <!-- Rite Purchasing -->
            <q-select
              v-if="this.categoryInput === 'Rite'"
              v-model="riteSelection"
              :options="this.riteOptions"
              label="Which Rite Would you like to Purchase?"
              label-color="primary"
              bg-color="grey-3"
              filled
              color="secondary"
              class="q-my-sm"
              option-label="rite_name"
              map-options
              use-input
              @filter="ritesFilter"
              input-debounce="0"
              option-value="rite_id"
              popup-content-style="background-color:#222831; color:white"
            />

            <q-separator class="q-my-sm" />

            <div class="tribe-info" v-if="this.riteSelection">
              <div class="tribe">
                Gift Description:
                {{ this.riteSelection.rite_description }}
              </div>
              <div class="tribe">
                Social:
                {{ this.riteSelection.social === 1 ? "Yes" : "No" }}
              </div>
              <div class="tribe">
                Pool:
                {{ this.riteSelection.pool }}
              </div>
            </div>

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
                this.categoryInput !== 'Renown' &&
                this.categoryInput !== 'Native Gift' &&
                this.categoryInput !== 'Tribe Gift' &&
                this.categoryInput !== 'Auspice Gift' &&
                this.categoryInput !== 'Rite'
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

<style>
.tribe_info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tribe {
  font-size: 1em;
  padding: 0.5em;
  color: white;
}
</style>

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

    const tribe = ref(props.info.tribe);
    const auspice = ref(props.info.auspice);
    let purchased_gifts = ref(props.info.purchased_gifts);

    let gift_total = ref(props.info.gift_count);

    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    return {
      dialogRef,
      tribe,
      auspice,
      gift_total: ref(gift_total.value),
      onDialogHide,
      baseUrl: ref(baseUrl),
      purchased_renown,
      tribe_renown,
      purchased_gifts,
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
          purchased_gifts: purchased_gifts,
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
      giftSelection: ref(""),
      riteSelection: ref(""),

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
      nativeGiftOptions: ref([]),
      tribeGiftOptions: ref([]),
      auspiceGiftOptions: ref([]),
      riteOptions: ref([]),
      clonedRiteOptions: ref([]),
    };
  },
  methods: {
    ritesFilter(val, update) {
      if (val === "") {
        update(() => {
          this.riteOptions = this.clonedRiteOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.riteOptions = this.clonedRiteOptions.filter(
          (v) => v.rite_name.toLowerCase().indexOf(needle) > -1
        );
      });
    },

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

    giftOptions() {
      switch (this.categoryInput) {
        case "Native Gift":
          return this.nativeGiftOptions;
        case "Tribe Gift":
          return this.tribeGiftOptions;
        case "Auspice Gift":
          return this.auspiceGiftOptions;
        default:
          return this.nativeGiftOptions;
      }
    },

    async generateGifts() {
      try {
        const max_renown = this.renownSum;

        const [nativeGiftResponse, auspiceGiftResponse, tribeGiftResponse] =
          await Promise.all([
            this.$axios.get(this.baseUrl + `/garou/native_gifts/${max_renown}`),
            this.$axios.get(
              this.baseUrl +
                `/garou/auspice_gifts/${max_renown}/${this.auspice.auspice_id}`
            ),
            this.$axios.get(
              this.baseUrl +
                `/garou/tribe_gifts/${max_renown}/${this.tribe.tribe_id}`
            ),
          ]);

        this.nativeGiftOptions = nativeGiftResponse.data;
        this.auspiceGiftOptions = auspiceGiftResponse.data;
        this.tribeGiftOptions = tribeGiftResponse.data;
      } catch (err) {
        console.log(err);
      }
    },

    async generateRites() {
      try {
        const ritesResponse = await this.$axios.get(
          this.baseUrl + "/garou/rites"
        );

        this.riteOptions = ritesResponse.data;
        this.clonedRiteOptions = structuredClone(ritesResponse.data);
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
        case "Auspice Gift":
          this.cost = (this.gift_total + 1) * 2;

          break;
        case "Native Gift":
          this.cost = (this.gift_total + 1) * 2;

          break;

        case "Rite":
          this.cost = 5;

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
          this.cost = (this.skills[this.skillCategory.toLowerCase()] + 1) * 3;
          break;
        case "Specialty":
          this.cost = 3;
          break;
        case "Tribe Gift":
          this.cost = (this.gift_total + 1) * 2;

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
      this.giftSelection = "";
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
      this.giftSelection = "";
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
        case "Auspice Gift":
          this.purchased_gifts.auspice.push(this.giftSelection);
          this.gift_total++;
          break;

        case "Native Gift":
          this.purchased_gifts.native.push(this.giftSelection);
          this.gift_total++;
          break;

        case "Renown":
          this.purchased_renown[
            this.renownCategory.renown_name.toLowerCase()
          ]++;
          this.generateGifts();
          break;

        case "Rite":
          this.purchased_gifts.rite.push(this.riteSelection);
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
        case "Tribe Gift":
          this.purchased_gifts.tribe.push(this.giftSelection);
          this.gift_total++;
          break;
      }
      this.localXP = this.localXP - this.cost;
      this.localSpentXp = this.localSpentXp + this.cost;
      this.clearFields();
    },
  },

  async mounted() {
    await this.generateRenownOpts();
    await this.generateGifts();
    await this.generateRites();
  },

  computed: {
    categoryOptions() {
      const arr = [
        "Advantage",
        "Attributes",
        "Auspice Gift",
        "Native Gift",
        "Renown",
        "Rite",
        "Skills",
        "Specialty",
        "Tribe Gift",
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
    renownTotal() {
      let trueRenown = { glory: 0, honor: 0, wisdom: 0 };
      trueRenown.glory = this.tribe_renown.glory + this.purchased_renown.glory;
      trueRenown.honor = this.tribe_renown.honor + this.purchased_renown.honor;
      trueRenown.wisdom =
        this.tribe_renown.wisdom + this.purchased_renown.wisdom;

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
  },
});
</script>
