<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout view="Lhh lpR fff" container>
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>Attribute Selection</q-toolbar-title>
          <q-btn color="primary" label="OK" @click="onOKClick" />
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page padding class="bg-dark">
          <div class="q-pa-md doc-container">
            <q-badge>Current XP: {{ this.xp }}</q-badge>
            <br />
            <q-badge
              >Attribute Points Remaining: {{ this.attributePoints }}</q-badge
            >
            <div class="row items-center">
              <div class="col">One of three cols</div>
              <q-separator vertical />
              <div class="col">One of three cols</div>
              <q-separator vertical />
              <div class="col">One of three cols</div>
            </div>
            <div class="row items-center">
              <div class="col">One of three cols</div>
              <q-separator vertical />

              <div class="col">One of three cols</div>
              <q-separator vertical />

              <div class="col">One of three cols</div>
            </div>
            <div class="row items-center">
              <div class="col">One of three cols</div>
              <q-separator vertical />

              <div class="col">One of three cols</div>
              <q-separator vertical />

              <div class="col">One of three cols</div>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<style scoped>
.row {
  height: 5rem;
  background: #222831;
}
.row > div {
  padding: 10px 15px;
  background: #222831;
  border: 1px solid #222831;
}
.doc-container > div + div {
  margin-top: 1rem;
}
</style>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";
import { useDialogPluginComponent } from "quasar";
import attributeInfo from "../vtm/5eAttributes.json";

export default defineComponent({
  name: "5e-Attributes",
  props: ["info"],
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    const attributePoints = ref(props.info.attributePoints);
    const charisma = ref(props.info.charisma);
    const composure = ref(props.info.composure);
    const dexterity = ref(props.info.dexterity);
    const intelligence = ref(props.info.intelligence);
    const manipulation = ref(props.info.manipulation);
    const resolve = ref(props.info.resolve);
    const stamina = ref(props.info.stamina);
    const strength = ref(props.info.strength);
    const wits = ref(props.info.wits);
    const xp = ref(props.info.xp);
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    return {
      attributePoints,
      charisma,
      composure,
      dexterity,
      intelligence,
      manipulation,
      resolve,
      stamina,
      strength,
      wits,
      dialogRef,
      onDialogHide,
      xp,
      onOKClick() {
        onDialogOK({
          attributePoints: attributePoints,
          charisma: charisma,
          composure: composure,
          dexterity: dexterity,
          intelligence: intelligence,
          manipulation: manipulation,
          resolve: resolve,
          stamina: stamina,
          strength: strength,
          wits: wits,
          xp: xp,
        });
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
  data() {
    return {
      attributeList: attributeInfo,
    };
  },
});
</script>
