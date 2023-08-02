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
          <q-btn color="primary" label="OK" @click="this.onOKClick()" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding class="bg-dark">
          <div class="q-my-md">
            Hunters can select an initial distribution of two edges and a perk,
            or one edge and two perks.
          </div>
          <q-select
            color="secondary"
            bg-color="grey-3"
            filled
            label-color="primary"
            v-model="edgeDist"
            :options="edgeDistOptions"
            label="Edge Distribution"
            popup-content-style="background-color:#222831; color:white"
            option-label="dist"
            @update:model-value="changeDist()"
          />
          <q-separator class="q-my-sm" />
          <q-select
            v-if="this.distCheck === false"
            bg-color="grey-3"
            filled
            color="secondary"
            label-color="primary"
            v-model="edgeCat"
            popup-content-style="background-color:#222831; color:white"
            :options="Object.keys(edgesList)"
            label="Edge Category"
            option-label="dist"
            @update:model-value="clearBelowCat()"
          />
          <q-separator class="q-my-sm" />
          <q-select
            v-if="this.edgeCat"
            bg-color="grey-3"
            filled
            color="secondary"
            popup-content-style="background-color:#222831; color:white"
            label-color="primary"
            v-model="edge"
            :options="Object.keys(edgesList[this.edgeCat].edges)"
            :label="this.edgeCat + ': ' + 'Edges'"
            option-label="dist"
          />
          <div v-if="this.edge" class="edgeDesc q-my-sm">
            {{ this.edgesList[edgeCat].edges[this.edge].desc }}
          </div>
          <q-btn
            v-if="this.edge"
            color="primary"
            label="Add Edge"
            class="q-my-sm"
            @click="takeEdge()"
          />
          <div v-if="this.distCheck === false" class="q-my-sm">
            Once you match your required amount of edges for your distribution,
            perk selection will unlock.
          </div>
          <q-select
            v-if="this.distCheck === true && this.perkDistCheck === false"
            bg-color="grey-3"
            filled
            color="secondary"
            :options="perkOptions"
            label-color="primary"
            v-model="perk"
            label="Select your perks"
            option-label="name"
            popup-content-style="background-color:#222831; color:white"
          />
          <div v-if="this.perk" class="edgeDesc q-my-sm">
            {{ this.perk.parent }} - {{ this.perk.desc }}
          </div>
          <q-btn
            v-if="this.perk"
            color="primary"
            label="Add Perk"
            class="q-my-sm"
            @click="takePerk()"
          />
          <div
            v-if="this.edgeArr.edges.length !== 0"
            style="justify-content: center; align-content: center"
          >
            <div
              class="text-h6 text-center q-my-sm"
              style="font-family: monospace"
            >
              Current Edges
            </div>
            <q-list bordered separator>
              <q-item
                v-for="(edge, key) in this.edgeArr.edges"
                :key="key"
                clickable
                v-ripple
                class="text-center q-my-sm"
                @click="removeEdge($event.target.id)"
                style="background-color: #222831"
              >
                <q-item-section :id="key"
                  >{{ edge.category }} - {{ edge.edge }}
                  <q-tooltip class="bg-dark text-body2"
                    >Click to delete</q-tooltip
                  ></q-item-section
                >
              </q-item>
            </q-list>
          </div>
          <div
            v-if="this.edgeArr.perks.length !== 0"
            style="justify-content: center; align-content: center"
          >
            <div class="text-h6 text-center" style="font-family: monospace">
              Current Perks
            </div>
            <q-list bordered separator>
              <q-item
                v-for="(perk, key) in this.edgeArr.perks"
                :key="key"
                clickable
                v-ripple
                class="text-center q-my-sm"
                @click="removePerk($event.target.id)"
                style="background-color: #222831"
              >
                <q-item-section :id="key"
                  >{{ perk.category }} - {{ perk.perk }}
                  <q-tooltip class="bg-dark text-body2"
                    >Click to delete</q-tooltip
                  ></q-item-section
                >
              </q-item>
            </q-list>
          </div>
        </q-page>
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
.edgeDesc {
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
import nosImage from "../../../assets/images/Nosfer_logo.png";

export default defineComponent({
  name: "5eClanSelect",
  props: ["info"],
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const disableRating = ref(false);

    const edgeArr = ref(props.info.edgeArr);

    const edgeDist = ref(props.info.edgeDist);

    const edgeDoneLocal = ref(props.info.edgeDone);

    return {
      step: ref(1),
      dialogRef,
      edgeArr,
      edgesList,
      nosImage,
      onDialogHide,
      onDialogOK,
      edge: ref(""),
      perk: ref(""),
      edgeCat: ref(""),
      edgeDoneLocal,
      edgeDist,
      edgeDistOptions: ref([
        { dist: "Two edges, one perk", distArr: [2, 1] },
        { dist: "One edge, two perks", distArr: [1, 2] },
      ]),

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
  data() {
    return {};
  },
  methods: {
    onOKClick() {
      this.onDialogOK({
        edgeArr: this.edgeArr,
        edgeDist: this.edgeDist,
        edgeDone: this.edgesDone(),
      });
    },
    changeDist() {
      this.edgeCat = "";
      this.edge = "";
      this.perk = "";
      if (this.edgeArr.edges.length > 0 || this.edgeArr.perks.length > 0) {
        this.$q.notify({
          color: "primary",
          textColor: "white",
          avatar: nosImage,
          timeout: 14000,
          message: "Distribution changed, edges and perks cleared.",
        });
        this.edgeArr.edges = [];
        this.edgeArr.perks = [];
      }
    },

    clearFields() {
      this.edgeCat = "";
      this.edge = "";
      this.perk = "";
    },
    clearBelowCat() {
      this.edge = "";
      this.perk = "";
    },
    takeEdge() {
      if (this.distCheck === true) {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: "Maximum edges reached!",
        });
        return;
      }
      this.edgeArr.edges.push({ category: this.edgeCat, edge: this.edge });
      this.clearFields();
    },
    takePerk() {
      if (this.perkDistCheck === true) {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: "Maximum perks reached!",
        });
        return;
      }
      this.edgeArr.perks.push({
        category: this.perk.parent,
        perk: this.perk.name,
      });
      this.clearFields();
    },
    removeEdge(event) {
      this.edgeArr.edges.splice(event, 1);
    },
    removePerk(event) {
      this.edgeArr.perks.splice(event, 1);
    },
    edgesDone() {
      if (this.distCheck === true && this.perkDistCheck === true) {
        this.$q.notify({
          color: "primary",
          textColor: "white",
          avatar: nosImage,
          timeout: 4000,
          message: "Edges/Perks Complete",
        });
        return true;
      }
      return false;
    },
  },
  computed: {
    distCheck() {
      if (this.edgeDist.distArr[0] === this.edgeArr.edges.length) {
        return true;
      }
      return false;
    },
    perkDistCheck() {
      if (this.edgeDist.distArr[1] === this.edgeArr.perks.length) {
        return true;
      }
      return false;
    },
    perkOptions() {
      let arr = [];
      if (this.edgeDist.distArr[0] === 2) {
        let perkOne =
          this.edgesList[this.edgeArr.edges[0].category].edges[
            this.edgeArr.edges[0].edge
          ].perks;
        let perkTwo =
          this.edgesList[this.edgeArr.edges[1].category].edges[
            this.edgeArr.edges[1].edge
          ].perks;

        arr = perkOne.concat(perkTwo);
      } else {
        arr =
          this.edgesList[this.edgeArr.edges[0].category].edges[
            this.edgeArr.edges[0].edge
          ].perks;
      }

      return arr;
    },
  },
});
</script>
