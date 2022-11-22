<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout view="Lhh lpR fff" container>
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>Attribute Selection</q-toolbar-title>
          <q-btn
            class="q-mx-md"
            color="primary"
            label="Cancel"
            @click="onCancelClick"
          >
            <q-tooltip class="bg-dark text-body2"
              >This will undo any changes</q-tooltip
            >
          </q-btn>
          <q-btn
            color="primary"
            :disable="checkIfGood()"
            label="Save"
            @click="onOKClick"
          >
            <q-tooltip v-if="checkIfGood()" class="bg-dark text-body2"
              >You can only save once you select a valid distribution of
              attributes.</q-tooltip
            >
          </q-btn>

          <br />
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page padding class="bg-dark">
          <div class="q-pa-md doc-container">
            <q-badge
              >Attribute Points Remaining: {{ this.attributePoints }}</q-badge
            >
            <div
              class="q-ma-sm q-pa-sm"
              style="
                background-color: #222831;
                border-radius: 4px;
                color: white;
              "
            >
              <span
                :style="
                  colorCheck()[0] === 1
                    ? { color: 'green' }
                    : { color: 'white' }
                "
                >Take one Attribute at 4;
              </span>
              <span
                :style="
                  colorCheck()[1] === 3
                    ? { color: 'green' }
                    : { color: 'white' }
                "
                >three Attributes at 3;
              </span>
              <span
                :style="
                  colorCheck()[2] === 4
                    ? { color: 'green' }
                    : { color: 'white' }
                "
                >four Attributes at 2;
              </span>
              <span
                :style="
                  colorCheck()[3] === 1
                    ? { color: 'green' }
                    : { color: 'white' }
                "
                >one Attribute at 1.</span
              >
              <br />{{ citation(1, 144) }}
            </div>
            <q-btn
              class="q-mb-sm"
              color="primary"
              label="Reset All"
              @click="resetAllAttributes"
            />
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
                {{ this[attribute.toLowerCase()] }}/5
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
  height: 8rem;
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
    const checkArray = [4, 3, 3, 3, 2, 2, 2, 2, 1]; // This is what the final (before purchase), array should look like
    const colorArray = ref([]);
    const sortedArray = ref([]);
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
      checkArray,
      colorArray,
      sortedArray,
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
      if (this[data] === 5) {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: `You have reached the maximum level for ${data}`,
        });
        return;
      }
      if (this.attributePoints === 0) {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: "Out of attribute points!",
        });
        return;
      }

      this[data]++;
      this.attributePoints--;
    },
    subtractSkill(data) {
      if (this[data] === 0) {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: `You cannot go below 0 for ${data}`,
        });
        return;
      }
      this[data]--;
      this.attributePoints++;
    },
    citation(book, pageNum) {
      let bookName;
      switch (book) {
        case 1:
          bookName = "Core Rulebook";
          break;
        case 2:
          bookName = "Camarilla";
          break;
        case 3:
          bookName = "Anarch";
          break;
        case 4:
          bookName = "Sabbat";
          break;
        case 5:
          bookName = "Cults of the Blood Gods";
          break;
        case 6:
          bookName = "Chicago by Night";
          break;
        case 7:
          bookName = "Vampire: The Masquerade Companion";
          break;
        default:
          bookName = "Core Rulebook";
      }

      return `(V5 ${bookName}, p.${pageNum})`;
    },

    resetAllAttributes() {
      this.attributePoints = 22;
      this.charisma = 0;
      this.composure = 0;
      this.dexterity = 0;
      this.intelligence = 0;
      this.manipulation = 0;
      this.resolve = 0;
      this.stamina = 0;
      this.strength = 0;
      this.wits = 0;
    },
    checkIfGood() {
      let attributes = [
        this.charisma,
        this.composure,
        this.dexterity,
        this.intelligence,
        this.manipulation,
        this.resolve,
        this.stamina,
        this.strength,
        this.wits,
      ];

      this.sortedArr = attributes.sort(function (a, b) {
        return b - a;
      });
      if (JSON.stringify(this.sortedArr) === JSON.stringify(this.checkArray)) {
        return false;
      }
      return true;
    },
    colorCheck() {
      let fourCount = 0;
      let threeCount = 0;
      let twoCount = 0;
      let oneCount = 0;
      this.sortedArr.filter((x) => {
        switch (x) {
          case 4:
            fourCount++;
            break;
          case 3:
            threeCount++;
            break;
          case 2:
            twoCount++;
            break;
          case 1:
            oneCount++;
            break;
          default:
            break;
        }
      });

      let arr = [fourCount, threeCount, twoCount, oneCount];
      return arr;
    },
  },
});
</script>
