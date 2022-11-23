<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout view="Lhh lpR fff" container>
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>Base Skill Selection</q-toolbar-title>
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
              skills.</q-tooltip
            >
          </q-btn>

          <br />
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page padding class="bg-dark">
          <q-select
            v-model="skillDistribution"
            label="Select a skill distribution"
            :options="distributionOptions"
            bg-color="grey-3"
            filled
            style="width: 100%; background-color: #1d1d1d; align-items: center"
            class="select"
            label-color="primary"
            option-label="label"
            @update:model-value="distributionSelected"
          />
          <div>poooo</div>
          <div class="q-pa-md doc-container">
            <q-badge class="q-mb-sm"
              >Skill Points Remaining: {{ this.skillPoints }}</q-badge
            >
            <br />

            <q-btn
              class="q-mb-sm"
              color="primary"
              label="Reset All"
              @click="resetAllSkills"
            />

            <div
              class="row items-center"
              v-for="i in Math.ceil(skillList.length / 3)"
              :key="i"
            >
              <div
                class="col"
                v-for="skill in skillList.slice((i - 1) * 3, i * 3)"
                :key="skill"
              >
                <q-separator vertical />
                <div class="attName">{{ skill }}</div>
                <q-btn
                  :id="skill"
                  round
                  color="primary"
                  icon="remove_circle"
                  text-color="secondary"
                  size="12px"
                  @click="subtractSkill($event.currentTarget.id)"
                />
                {{ this.baseSkills[skill.toLowerCase()] }}/5
                <q-btn
                  :id="skill.toLowerCase()"
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
import skillInfo from "../vtm/5eSkills.json";

export default defineComponent({
  name: "5e-Skills",
  props: ["info"],
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    console.log(props.info.baseSkills);
    const baseSkills = ref(props.info.baseSkills);

    const skillPoints = ref(props.info.skillPoints);

    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    return {
      baseSkills,
      skillPoints,
      dialogRef,
      onDialogHide,
      onOKClick() {
        onDialogOK({
          baseSkills: baseSkills,
          skillPoints: skillPoints,
        });
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
  data() {
    return {
      skillList: skillInfo.skills,
      skillDistribution: {
        label: "Jack-of-all-trades",
        pointsTotal: 29,
        distribution: [3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        distributionDesc: "One Skill at 3; eight Skills at 2; ten Skills at 1",
      },
      distributionOptions: [
        {
          label: "Jack-of-all-trades",
          pointsTotal: 29,
          distribution: [
            3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          ],
          distributionDesc:
            "One Skill at 3; eight Skills at 2; ten Skills at 1",
        },
        {
          label: "Balanced",
          pointsTotal: 26,
          distribution: [3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
          distributionDesc:
            "Three Skills at 3; five Skills at 2; seven Skills at 1",
        },
        {
          label: "Specialist",
          pointsTotal: 22,
          distribution: [4, 3, 3, 3, 2, 2, 2, 1, 1, 1],
          distributionDesc:
            "One Skill at 4; three Skills at 3; three Skills at 2; three Skills at 1",
        },
      ],
    };
  },
  methods: {
    addSkill(data) {
      console.log(data);
      if (this.baseSkills[data.toLowerCase()] === 5) {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: `You have reached the maximum level for ${data}`,
        });
        return;
      }
      if (this.skillPoints === 0) {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: "Out of skill points!",
        });
        return;
      }
      this.baseSkills[data.toLowerCase()]++;
      console.log(this.baseSkills);
      this.skillPoints--;
    },
    subtractSkill(data) {
      console.log(data);
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

    resetAllSkills() {},
    checkIfGood() {},
    colorCheck() {},
    distributionSelected() {
      console.log(this.skillDistribution);
    },
  },
});
</script>
