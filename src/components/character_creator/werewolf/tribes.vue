<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    persistent
    style="color: white"
  >
    <q-layout view="Lhh lpR fff" container>
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>Tribes, Auspice and Gifts</q-toolbar-title>
          <q-btn color="primary" label="OK" @click="this.onOKClick()" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding class="bg-dark">
          <div class="q-pa-md">
            <q-stepper
              v-model="step"
              color="red"
              vertical
              class="stepper"
              animated
            >
              <q-step
                :name="1"
                title="Select a Tribe"
                caption="Find your wolves"
                icon="group"
                :done="step > 1"
              >
                <div>
                  A Garou's tribe is a community of werewolves sharing a similar
                  purpose, mindset, goal, or outlook on the world.
                </div>

                <q-select
                  filled
                  v-model="tribe"
                  color="secondary"
                  bg-color="grey-3"
                  class="inputs"
                  :options="this.tribeOptions"
                  label="Select a Tribe"
                  popup-content-style="background-color:#222831; color:white"
                  map-options
                  option-label="tribe_name"
                  option-value="tribe_id"
                  @update:model-value="
                    async () => {
                      applyTribeRenown();
                      await generateTribeGifts();
                    }
                  "
                />
                <div class="tribe-info" v-if="tribe">
                  <div class="tribe">
                    Tribe Description:
                    {{ tribe.description }}
                  </div>
                  <div class="tribe">Patron: {{ tribe.patron }}</div>

                  <div class="tribe">
                    Renown Type: {{ tribe.renownTypeId.renown_name }}
                  </div>

                  <div class="tribe">
                    Favor:
                    {{ tribe.favor }}
                  </div>
                  <div class="tribe">
                    Ban:
                    {{ tribe.ban }}
                  </div>

                  <div class="tribe">
                    <q-select
                      filled
                      v-model="bonus_renown"
                      color="secondary"
                      bg-color="grey-3"
                      class="inputs"
                      :options="this.filterRenownOptions"
                      label="Select Bonus Renown"
                      map-options
                      option-label="renown_name"
                      option-value="renown_id"
                      popup-content-style="background-color:#222831; color:white"
                      @update:model-value="applyBonusRenown()"
                    />
                  </div>
                </div>
                <q-stepper-navigation>
                  <q-btn
                    :disable="!tribe || !bonus_renown"
                    @click="step = 2"
                    color="primary"
                    label="Continue"
                  >
                    <q-tooltip v-if="!tribe"
                      >Please select a tribe first!</q-tooltip
                    >
                  </q-btn>
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="2"
                title="Choose an Auspice"
                caption="What is your purpose?"
                icon="brightness_3"
                :done="step > 2"
              >
                <q-select
                  filled
                  v-model="auspice"
                  color="secondary"
                  bg-color="grey-3"
                  class="inputs"
                  :options="this.auspiceOptions"
                  label="Select an Auspice"
                  map-options
                  popup-content-style="background-color:#222831; color:white"
                  option-label="auspice_name"
                  option-value="auspice_id"
                  @update:model-value="generateAuspiceGifts()"
                />
                <div class="tribe-info" v-if="auspice">
                  <div class="tribe">
                    Auspice Description:
                    {{ auspice.description }}
                  </div>
                </div>

                <q-stepper-navigation>
                  <q-btn
                    :disable="!auspice"
                    @click="step = 3"
                    color="primary"
                    label="Continue"
                  >
                    <q-tooltip v-if="!auspice"
                      >Please select an auspice first!</q-tooltip
                    >
                  </q-btn>
                  <q-btn
                    flat
                    @click="step = 1"
                    color="secondary"
                    label="Back"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </q-step>

              <q-step :name="3" title="Select your Gifts" icon="app:whiteClaws">
                <!-- Native Gift -->
                <div class="native_gift">
                  <q-select
                    filled
                    v-model="this.tribe_gifts.native"
                    color="secondary"
                    bg-color="grey-3"
                    class="inputs"
                    :options="this.nativeOptions"
                    label="Select a Native Gift"
                    map-options
                    popup-content-style="background-color:#222831; color:white"
                    option-label="gift_name"
                    option-value="gift_id"
                  />
                  <div class="tribe-info" v-if="this.tribe_gifts.native">
                    <div class="tribe">
                      Gift Description:
                      {{ this.tribe_gifts.native.gift_description }}
                    </div>
                    <div class="tribe">
                      Cost:
                      {{ this.tribe_gifts.native.cost }}
                    </div>
                    <div class="tribe">
                      Pool:
                      {{ this.tribe_gifts.native.pool }}
                    </div>
                  </div>
                </div>
                <q-separator />

                <!-- Tribe Gift -->
                <div class="native_gift">
                  <q-select
                    filled
                    v-model="this.tribe_gifts.tribe"
                    color="secondary"
                    bg-color="grey-3"
                    class="inputs"
                    :options="this.tribeGiftOptions"
                    label="Select a Tribe Gift"
                    map-options
                    popup-content-style="background-color:#222831; color:white"
                    option-label="gift_name"
                    option-value="gift_id"
                  />
                  <div class="tribe-info" v-if="this.tribe_gifts.tribe">
                    <div class="tribe">
                      Gift Description:
                      {{ this.tribe_gifts.tribe.gift_description }}
                    </div>
                    <div class="tribe">
                      Cost:
                      {{ this.tribe_gifts.tribe.cost }}
                    </div>
                    <div class="tribe">
                      Pool:
                      {{ this.tribe_gifts.tribe.pool }}
                    </div>
                  </div>
                </div>
                <q-separator />

                <!-- Auspice Gift -->
                <div class="native_gift">
                  <q-select
                    filled
                    v-model="this.tribe_gifts.auspice"
                    color="secondary"
                    bg-color="grey-3"
                    class="inputs"
                    :options="this.auspiceGiftOptions"
                    label="Select an Auspice Gift"
                    map-options
                    popup-content-style="background-color:#222831; color:white"
                    option-label="gift_name"
                    option-value="gift_id"
                  />
                  <div class="tribe-info" v-if="this.tribe_gifts.auspice">
                    <div class="tribe">
                      Gift Description:
                      {{ this.tribe_gifts.auspice.gift_description }}
                    </div>
                    <div class="tribe">
                      Cost:
                      {{ this.tribe_gifts.auspice.cost }}
                    </div>
                    <div class="tribe">
                      Pool:
                      {{ this.tribe_gifts.auspice.pool }}
                    </div>
                  </div>
                </div>
                <q-separator />
                <!-- Rites -->
                <div class="native_gift">
                  <q-select
                    filled
                    v-model="this.tribe_gifts.rite"
                    color="secondary"
                    bg-color="grey-3"
                    class="inputs"
                    :options="this.riteOptions"
                    label="Select a Rite"
                    map-options
                    use-input
                    input-debounce="0"
                    @filter="ritesFilter"
                    popup-content-style="background-color:#222831; color:white"
                    option-label="rite_name"
                    option-value="rite_id"
                  />
                  <div class="tribe-info" v-if="this.tribe_gifts.rite">
                    <div class="tribe">
                      Gift Description:
                      {{ this.tribe_gifts.rite.rite_description }}
                    </div>
                    <div class="tribe">
                      Pool:
                      {{ this.tribe_gifts.rite.pool }}
                    </div>
                    <div class="tribe">
                      Social Rite:
                      {{ this.tribe_gifts.rite.social === 0 ? "Yes" : "No" }}
                    </div>
                  </div>
                </div>

                <q-stepper-navigation>
                  <q-btn
                    color="primary"
                    label="Finish"
                    @click="this.onOKClick()"
                  />
                  <q-btn
                    flat
                    @click="step = 2"
                    color="secondary"
                    label="Back"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </q-step>
            </q-stepper>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<style>
.q-stepper__dot {
  background-color: #1d1d1d;
  color: white;
}

.stepper {
  background-color: #222831;

  font-size: larger;
}

.inputs {
  padding: 15px;
}

.tribe_info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tribe {
  font-size: 1em;
  padding: 0.5em;
}

.q-stepper__title {
  color: white;
}

.q-stepper__caption {
  color: white;
}

@media only screen and (max-width: 600px) {
  .stepper {
    font-size: medium;
  }
  .inputs {
    max-width: 80%;
  }
}
</style>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";
import { useDialogPluginComponent } from "quasar";
import nosImage from "../../../assets/images/Nosfer_logo.png";

export default defineComponent({
  name: "5eTribeSelect",
  props: ["info"],
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const tribesDoneLocal = ref(props.info.tribesDone);

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    return {
      step: ref(1),
      dialogRef,
      baseUrl: ref(baseUrl),

      nosImage,
      onDialogHide,
      onDialogOK,

      tribesDoneLocal,

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },

  async created() {
    try {
      const [
        tribesResponse,
        auspicesResponse,
        nativeResponse,
        renown_types_response,
        rites_response,
      ] = await Promise.all([
        this.$axios.get(this.baseUrl + "/garou/tribes"),
        this.$axios.get(this.baseUrl + "/garou/auspices"),
        this.$axios.get(this.baseUrl + `/garou/native_gifts/${2}`),
        this.$axios.get(this.baseUrl + "/garou/renown_types"),
        this.$axios.get(this.baseUrl + "/garou/rites"),
      ]);

      this.tribeOptions = tribesResponse.data;
      this.auspiceOptions = auspicesResponse.data;
      this.nativeOptions = nativeResponse.data;
      this.renownTypeOptions = renown_types_response.data;
      this.riteOptions = rites_response.data;
      this.clonedRiteOptions = structuredClone(rites_response.data);
      console.log(this.riteOptions);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  },

  data(props) {
    return {
      tribe: props.info.tribe,
      auspice: props.info.auspice,
      renown: props.info.renown,
      tribe_gifts: props.info.tribe_gifts,
      bonus_renown: props.info.bonus_renown,
      tribeOptions: [],
      auspiceOptions: [],
      nativeOptions: [],
      renownTypeOptions: [],
      riteOptions: [],
      clonedRiteOptions: [],
      auspiceGiftOptions: [],
      tribeGiftOptions: [],
    };
  },
  methods: {
    onOKClick() {
      this.onDialogOK({
        tribe: this.tribe,
        auspice: this.auspice,
        renown: this.renown,
        tribe_gifts: this.tribe_gifts,
        bonus_renown: this.bonus_renown,
        tribesDone: this.tribesDone,
      });
    },

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

    applyTribeRenown() {
      this.clearRenown();

      this.renown[this.tribe.renownTypeId.renown_name.toLowerCase()] = 2;
      this.bonus_renown = "";
      this.$q.notify({
        color: "primary",
        textColor: "white",
        avatar: nosImage,
        timeout: 14000,
        message: "Please select a new Bonus Renown!",
      });
    },

    applyBonusRenown() {
      if (this.bonus_renown) {
        this.renown[this.bonus_renown.renown_name.toLowerCase()] = 1;
      }
    },

    clearRenown() {
      this.renown = { glory: 0, honor: 0, wisdom: 0 };
    },

    async generateAuspiceGifts() {
      try {
        const ausGiftResponse = await this.$axios.get(
          this.baseUrl + `/garou/auspice_gifts/${2}/${this.auspice.auspice_id}`
        );
        this.auspiceGiftOptions = ausGiftResponse.data;
      } catch (err) {
        console.log(err);
      }
    },

    async generateTribeGifts() {
      try {
        const tribeGiftResponse = await this.$axios.get(
          this.baseUrl + `/garou/tribe_gifts/${3}/${this.tribe.tribe_id}`
        );
        this.tribeGiftOptions = tribeGiftResponse.data;
      } catch (err) {
        console.log(err);
      }
    },
  },

  computed: {
    filterRenownOptions() {
      const options = this.renownTypeOptions.filter(
        (renown) => renown.renown_id !== this.tribe.renownTypeId.renown_id
      );

      return options;
    },
    tribesDone() {
      if (
        !this.tribe ||
        !this.auspice ||
        !this.bonus_renown ||
        !this.tribe_gifts.native ||
        !this.tribe_gifts.tribe ||
        !this.tribe_gifts.auspice
      ) {
        return false;
      }

      return true;
    },
  },
});
</script>
