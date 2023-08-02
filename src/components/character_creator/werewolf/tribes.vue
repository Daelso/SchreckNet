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
            <q-stepper v-model="step" vertical class="stepper" animated>
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
                  :options="tribeOptions"
                  label="Select a Tribe"
                />

                <q-stepper-navigation>
                  <q-btn @click="step = 2" color="primary" label="Continue" />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="2"
                title="Choose an Auspice"
                caption="What is your purpose?"
                icon="brightness_3"
                :done="step > 2"
              >
                An ad group contains one or more ads which target a shared set
                of keywords.

                <q-stepper-navigation>
                  <q-btn @click="step = 3" color="primary" label="Continue" />
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
                Try out different ad text to see what brings in the most
                customers, and learn how to enhance your ads using features like
                ad extensions. If you run into any problems with your ads, find
                out how to tell if they're running and how to resolve approval
                issues.

                <q-stepper-navigation>
                  <q-btn color="primary" label="Finish" />
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

@media only screen and (max-width: 600px) {
  .stepper {
    font-size: medium;
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

    return {
      step: ref(1),
      dialogRef,

      nosImage,
      onDialogHide,
      onDialogOK,

      tribesDoneLocal,

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
  data(props) {
    return {
      tribe: props.info.tribe,
      patron: props.info.patron,
      auspice: props.info.auspice,
    };
  },
  methods: {
    onOKClick() {
      this.onDialogOK({
        patron: this.patron,
        tribe: this.tribe,
        auspice: this.auspice,
        // tribesDone: this.edgesDone(),
      });
    },
    changeDist() {
      if (this.edgeArr.edges.length > 0 || this.edgeArr.perks.length > 0) {
        this.$q.notify({
          color: "primary",
          textColor: "white",
          avatar: nosImage,
          timeout: 14000,
          message: "Distribution changed, edges and perks cleared.",
        });
      }
    },
  },

  computed: {},
});
</script>
