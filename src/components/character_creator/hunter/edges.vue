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
          <q-toolbar-title>Edges & Perks</q-toolbar-title>
          <q-btn color="primary" label="OK" @click="onOKClick" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding class="bg-dark"> </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<style>
.q-stepper__dot {
  color: #e31c25;
}
.q-stepper__line {
  color: #e31c25;
}

.stepper {
  background-color: #222831;

  font-size: larger;
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
import edgesList from "../hunter/edgesAndPerks.json";

export default defineComponent({
  name: "5eClanSelect",
  props: ["info"],
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const disableRating = ref(false);

    const edgeArr = ref(props.info.edgeArr);

    return {
      step: ref(1),
      dialogRef,
      edgeArr,
      edgesList,
      onDialogHide,

      onOKClick() {
        onDialogOK({
          edgeArr: edgeArr,
        });
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
  data() {
    return {};
  },
  methods: {},
});
</script>
