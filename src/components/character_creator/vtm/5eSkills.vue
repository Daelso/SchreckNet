<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout view="Lhh lpR fff" container>
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>Base Skill Selection</q-toolbar-title>
          <q-btn color="primary" label="Save" @click="onOKClick"> </q-btn>
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
          <div class="blurb">
            {{ distBlurb }}
          </div>

          <div class="q-pa-md doc-container">
            <q-badge class="q-mb-sm"
              >Skill Points Remaining: {{ this.skillPoints }}</q-badge
            >
            <q-badge class="q-mb-sm"
              >Specialties Gained: {{ this.specialtiesFromSkills }}</q-badge
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

.blurb {
  background-color: #222831;
  border-radius: 4px;
  color: white;
  position: sticky;
  top: 15px;
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
    const baseSkills = ref(props.info.baseSkills);

    const skillPoints = ref(props.info.skillPoints);

    const distribution = ref(props.info.skillDistribution.distribution);

    const distBlurb = ref(props.info.skillDistribution.distributionDesc);
    const skillDistribution = ref(props.info.skillDistribution);

    const specialtiesFromSkills = ref(props.info.specialtiesFromSkills);

    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    return {
      baseSkills,
      distBlurb,
      distribution,
      skillPoints,
      dialogRef,
      skillDistribution,
      specialtiesFromSkills,
      onDialogHide,
      onOKClick() {
        onDialogOK({
          baseSkills: baseSkills,
          skillPoints: skillPoints,
          distBlurb: distBlurb,
          distribution: distribution,
          skillDistribution: skillDistribution,
          specialtiesFromSkills: specialtiesFromSkills,
        });
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
  data() {
    return {
      skillList: skillInfo.skills,
      maxPoint: Math.max(...this.skillDistribution.distribution),

      distributionOptions: [
        {
          label: "Jack-of-all-trades",
          pointsTotal: 29,
          distribution: [
            3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
            0, 0, 0, 0,
          ],
          distributionDesc:
            "One Skill at 3; eight Skills at 2; ten Skills at 1",
        },
        {
          label: "Balanced",
          pointsTotal: 26,
          distribution: [
            3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0,
          ],
          distributionDesc:
            "Three Skills at 3; five Skills at 2; seven Skills at 1",
        },
        {
          label: "Specialist",
          pointsTotal: 22,
          distribution: [
            4, 3, 3, 3, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0,
          ],
          distributionDesc:
            "One Skill at 4; three Skills at 3; three Skills at 2; three Skills at 1",
        },
      ],
    };
  },
  methods: {
    addSkill(data) {
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
      this.skillPoints--;
      switch (data) {
        case "craft":
          if (
            this.baseSkills[data.toLowerCase()] > 0 &&
            this.baseSkills[data.toLowerCase()] < 2
          ) {
            this.specialtiesFromSkills++;
            this.$q.notify({
              type: "positive",
              textColor: "white",
              position: "top",
              message: `Free specialty acquired from ${data}`,
            });
          }
          break;
        case "academics":
          if (
            this.baseSkills[data.toLowerCase()] > 0 &&
            this.baseSkills[data.toLowerCase()] < 2
          ) {
            this.specialtiesFromSkills++;
            this.$q.notify({
              type: "positive",
              textColor: "white",
              position: "top",
              message: `Free specialty acquired from ${data}`,
            });
          }
          break;
        case "science":
          if (
            this.baseSkills[data.toLowerCase()] > 0 &&
            this.baseSkills[data.toLowerCase()] < 2
          ) {
            this.specialtiesFromSkills++;
            this.$q.notify({
              type: "positive",
              textColor: "white",
              position: "top",
              message: `Free specialty acquired from ${data}`,
            });
          }
          break;
        case "performance":
          if (
            this.baseSkills[data.toLowerCase()] > 0 &&
            this.baseSkills[data.toLowerCase()] < 2
          ) {
            this.specialtiesFromSkills++;
            this.$q.notify({
              type: "positive",
              textColor: "white",
              position: "top",
              message: `Free specialty acquired from ${data}`,
            });
          }
          break;
      }

      this.checkIfGood();
    },
    subtractSkill(data) {
      if (this.baseSkills[data.toLowerCase()] === 0) {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: `You have reached the minimum level for ${data}`,
        });
        return;
      }

      this.baseSkills[data.toLowerCase()]--;
      this.skillPoints++;

      switch (data.toLowerCase()) {
        case "craft":
          if (this.baseSkills[data.toLowerCase()] === 0) {
            this.specialtiesFromSkills--;
            this.$q.notify({
              type: "negative",
              textColor: "white",
              position: "top",
              message: `Free specialty from ${data.toLowerCase()} lost!`,
            });
          }
          break;
        case "academics":
          if (this.baseSkills[data.toLowerCase()] === 0) {
            this.specialtiesFromSkills--;
            this.$q.notify({
              type: "negative",
              position: "top",
              textColor: "white",
              message: `Free specialty from ${data.toLowerCase()} lost!`,
            });
          }
          break;
        case "science":
          if (this.baseSkills[data.toLowerCase()] === 0) {
            this.specialtiesFromSkills--;
            this.$q.notify({
              type: "negative",
              position: "top",
              textColor: "white",
              message: `Free specialty from ${data.toLowerCase()} lost!`,
            });
          }
          break;
        case "performance":
          if (this.baseSkills[data.toLowerCase()] === 0) {
            this.specialtiesFromSkills--;
            this.$q.notify({
              type: "negative",
              textColor: "white",
              position: "top",
              message: `Free specialty from ${data.toLowerCase()} lost!`,
            });
          }
          break;
      }
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

    resetAllSkills() {
      this.skillPoints = this.skillDistribution.pointsTotal;
      for (const property in this.baseSkills) {
        this.baseSkills[property] = 0;
      }
    },

    checkIfGood() {
      let skills = [];

      for (const property in this.baseSkills) {
        skills.push(this.baseSkills[property]);
      }

      let sortedArr = skills.sort(function (a, b) {
        return b - a;
      });

      console.log(sortedArr);
      console.log(this.skillDistribution.distribution);
      if (
        JSON.stringify(sortedArr) !==
        JSON.stringify(this.skillDistribution.distribution)
      ) {
        console.log("We are not good!");
        return;
      }
      this.$q.notify({
        type: "positive",
        textColor: "white",
        message: `You have a proper ${this.skillDistribution.label} distribution.`,
      });
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
    distributionSelected() {
      this.skillPoints = this.skillDistribution.pointsTotal;
      this.distribution = this.skillDistribution.distribution;
      this.distBlurb = this.skillDistribution.distributionDesc;
      this.maxPoint = Math.max(...this.skillDistribution.distribution);

      for (const property in this.baseSkills) {
        this.baseSkills[property] = 0;
      }
    },
  },
});
</script>
