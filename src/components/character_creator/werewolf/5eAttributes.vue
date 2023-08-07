<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout view="Lhh lpR fff" container>
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title class="attHeader"
            >Attribute Selection</q-toolbar-title
          >
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
              <br />{{ citation(1, 85) }}
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
                  :size="this.isMobile() ? 6.5 + 'px' : 12 + 'px'"
                  @click="subtractSkill($event.currentTarget.id)"
                />
                {{ this[attribute.toLowerCase()] }}/5
                <q-btn
                  :id="attribute.toLowerCase()"
                  round
                  color="primary"
                  icon="add_circle"
                  text-color="white"
                  :size="this.isMobile() ? 6.5 + 'px' : 12 + 'px'"
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

@media only screen and (max-width: 600px) {
  .attName {
    color: white;
    font-weight: bold;
    margin: auto;
    font-size: 12px;
  }
  .attHeader {
    font-size: 15px;
  }
  .row {
    height: 6rem;
    background: #222831;
    width: 100%;
  }
  .row > div {
    padding: 3px 5px;
    background: #222831;
    border: 1px solid #222831;
  }
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
    const attributesDone = ref(props.info.attributesDone);
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
      attributesDone,
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
          attributesDone: attributesDone,
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

        default:
          bookName = "Core Rulebook";
      }

      return `(WtA 5 ${bookName}, p.${pageNum})`;
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

    isMobile() {
      var check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
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
        this.attributesDone = true;
        return false;
      }
      this.attributesDone = false;
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
