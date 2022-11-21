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
            <br />
            <q-badge>Cost to Level: New Level * 5</q-badge>
            <div
              class="row items-center"
              v-for="i in Math.ceil(attributeList.length / 3)"
              :key="i"
            >
              <div
                class="col"
                v-for="attribute in attributeList.slice((i - 1) * 3, i * 3)"
                :key="attribute"
              >
                <q-separator vertical />
                <div class="attName">{{ attribute }}</div>
                <q-btn
                  :id="attribute.toLowerCase()"
                  round
                  color="primary"
                  icon="remove_circle"
                  text-color="secondary"
                  size="12px"
                  @click="subtractSkill($event.currentTarget.id)"
                />
                {{ this[attribute.toLowerCase()] }}
                <q-btn
                  :id="attribute.toLowerCase()"
                  round
                  color="primary"
                  icon="add_circle"
                  text-color="white"
                  size="12px"
                  @click="addSkill($event.currentTarget.id)"
                />
              </div>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<style scoped>
.row {
  height: 7rem;
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

.attName {
  color: white;
  font-weight: bold;
  margin-bottom: 12px;
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
      attributeList: attributeInfo.Attributes,
    };
  },
  methods: {
    addSkill(data) {
      console.log(data);
    },
    subtractSkill(data) {
      console.log(data);
    },
  },
});
</script>
