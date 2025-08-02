<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card
      class="q-pa-sm bg-dark text-white"
      style="max-width: 600px; width: 95vw; max-height: 90vh"
    >
      <q-card-section class="q-pa-sm">
        <div class="text-h6">Select an Ingrained Discipline</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-none scroll" style="max-height: 60vh">
        <q-expansion-item
          expand-icon="expand_more"
          default-opened
          class="bg-grey-10 text-white rounded-borders q-mb-md"
          header-class="bg-grey-9 text-white"
        >
          <!-- Custom icon slot -->
          <template v-slot:header>
            <div class="row items-center q-gutter-sm q-pa-sm">
              <img
                :src="nosImage"
                alt="Nosferatu"
                width="24"
                height="24"
                style="border-radius: 50%"
              />
              <div class="text-subtitle1">
                Blunt Ingrained Discipline (Example)
              </div>
            </div>
          </template>

          <div class="q-pa-sm">
            <p class="q-mb-md">
              <strong>What's that?</strong> An ingrained discipline allows you
              to take up to 3 more discipline powers above the normal cap of 5.
              With this extra power comes a flaw. Select one of your disciplines
              below to see what awaits you. It is suggested that you already
              have 3 dots in a discipline <em>and</em> Storyteller approval
              before selecting this option. You may only select one discipline.
            </p>

            <q-separator size="1px" color="red" class="q-my-md" />

            <p class="q-mb-none">
              Veronica, a Ventrue, has four levels of Dominate but has eyes on
              some of the lower-level powers. She decides to take the
              <strong>Blunt Ingrained Discipline</strong> Flaw to pick them up
              without sacrificing her top spot. She can decide to purchase
              either an additional three level 1 powers at 5 experience each,
              one level 3 power for 15 experience points, or one level 2 power
              (10 experience points) and one level 1 power (5 experience
              points). Her Dominate rating remains at level 4 throughout, but
              she can still choose to purchase Dominate 5 for 25 experience
              points at a later date.
            </p>
          </div>
        </q-expansion-item>
      </q-card-section>
      <q-card-section class="q-pa-none scroll">
        <div>
          <q-select
            v-model="ingrained_disc"
            color="secondary"
            label="Select your discipline"
            popup-content-style="background-color:#222831; color:white"
            :options="disciplineOptions"
            bg-color="grey-3"
            filled
            emit-value
            style="margin-bottom: 20px; width: 100%"
            class="select"
            label-color="primary"
            @update:model-value="clear_fields()"
          />
        </div>
        <div v-if="ingrained_disc">
          <div class="text-subtitle1">
            Ingrained {{ ingrained_disc }} Flaw:
            {{ disc_flaws[ingrained_disc].name }}
          </div>
          <div>
            {{ disc_flaws[ingrained_disc].description }}
          </div>
          <div class="q-my-md text-subtitle1">
            Ingrained Discipline XP Cap Remaining: {{ this.xp_to_spend }} --
            Your XP: {{ this.local_xp }}
          </div>
        </div>
      </q-card-section>
      <q-card-section
        class="q-pa-none q-my-md scroll"
        v-if="this.ingrained_disc"
      >
        <div>
          <q-select
            v-model="selected_disc"
            color="secondary"
            label="Select your discipline power"
            popup-content-style="background-color:#222831; color:white"
            :options="powerOptions"
            map-options
            option-label="full_name"
            bg-color="grey-3"
            filled
            style="margin-bottom: 20px; width: 100%"
            class="select"
            label-color="primary"
            @update:model-value="choose_a_disc()"
          />
        </div>
      </q-card-section>
      <q-card-section
        class="q-pa-none q-my-md scroll"
        v-if="this.ingrained_disc && chosen_discs.length > 0"
      >
        <q-card class="q-pa-md bg-grey-10 text-white shadow-2">
          <div class="row items-center justify-between q-mb-sm">
            <div class="text-subtitle1 text-bold">Chosen Discipline Powers</div>
            <q-btn
              flat
              dense
              color="red"
              icon="restart_alt"
              label="Reset"
              @click="resetChosenDiscs"
            />
          </div>

          <q-separator color="white" class="q-my-sm" />

          <div v-if="chosen_discs.length > 0" class="q-mt-sm">
            <q-list dense bordered class="rounded-borders bg-grey-9">
              <q-item
                v-for="(disc, index) in chosen_discs"
                :key="index"
                class="q-py-sm q-mb-xs"
              >
                <q-item-section>
                  <q-item-label class="text-white">
                    {{ disc.skill }}
                  </q-item-label>
                  <q-item-label caption class="text-grey-4">
                    {{ disc.discipline }} — {{ disc.cost }} XP
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div v-else class="q-mt-sm text-italic text-grey-5">
            No disciplines selected yet.
          </div>
        </q-card>
      </q-card-section>
      <q-card-actions class="q-pa-sm">
        <div class="row full-width justify-between items-center">
          <q-btn
            flat
            label="Remove Flaw"
            color="white"
            @click="
              () => {
                local_disc_flaw = false;
                cleanupFlaw();
                onOKClick();
              }
            "
          />
          <q-btn
            flat
            label="Confirm"
            color="white"
            @click="
              () => {
                distributeDiscs();

                onOKClick();
              }
            "
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useDialogPluginComponent } from "quasar";
import disc_flaws from "../vtm/5eDisciplineFlaws.json";
import nosImage from "../../../assets/images/Nosfer_logo.png";
import disciplines from "./5eDisciplines.json";

export default defineComponent({
  name: "ManageDisciplineFlaw",

  props: ["info"],
  emits: [...useDialogPluginComponent.emits],
  created() {
    this.my_discs = this.info.disciplines;
    this.my_disc_skills = this.info.disciplineSkills;
    this.local_advantages = this.info.advantagesObj;
    console.log(this.my_disc_skills);
    console.log(this.local_advantages);

    this.disciplineOptions = Object.entries(this.my_discs).map(
      ([key, value]) => ({
        label: key,
        value: key,
      })
    );
    this.restoreDarkDiscSelections();
  },
  setup(props, { emit }) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    return {
      emit,

      dialogRef,
      onDialogHide,
      onDialogOK,
    };
  },
  data() {
    return {
      disc_flaws,
      nosImage,
      disciplines: disciplines.Disciplines,
      my_discs: null,
      my_disc_skills: null,
      selected_disc: "",
      ingrained_disc: "",
      disciplineOptions: [],
      chosen_discs: [],
      xp_to_spend: 15,
      local_xp: this.info.xp,
      local_advantages: null,
      local_disc_flaw: this.info.discipline_flaw,
    };
  },
  methods: {
    clear_fields() {
      this.chosen_discs = [];
      this.xp_to_spend = 15;
      this.selected_disc = "";
    },

    restoreDarkDiscSelections() {
      // Restore dark discipline powers
      const restoredDiscs =
        this.my_disc_skills?.filter((item) => item.dark_disc) || [];

      console.log("RESTORED:", restoredDiscs);

      if (restoredDiscs.length > 0) {
        this.chosen_discs = restoredDiscs;
        this.ingrained_disc = restoredDiscs[0].discipline || "";

        // Recalculate XP based on restored selections
        const totalXpUsed = restoredDiscs.reduce(
          (sum, disc) => sum + (disc.cost || 0),
          0
        );
        this.xp_to_spend = Math.max(15 - totalXpUsed, 0);
      } else {
        this.chosen_discs = [];
        this.xp_to_spend = 15;
      }
    },

    choose_a_disc() {
      // const can_afford = this.local_xp - this.selected_disc.cost > 0;
      // if (!can_afford) {
      //   this.$q.notify({
      //     message: "You do not have enough XP to purchase this discipline yet!",
      //     color: "primary",
      //     avatar: nosImage,
      //   });
      //   this.selected_disc = "";
      //   return;
      // }

      console.log(this.selected_disc);
      this.chosen_discs.push(this.selected_disc);
      console.log(this.chosen_discs);
      this.xp_to_spend = this.xp_to_spend - this.selected_disc.cost;
      this.local_xp = this.local_xp - this.selected_disc.cost;
      this.selected_disc = "";
    },
    cleanupFlaw() {
      // Filter out any dark discipline entries
      this.my_disc_skills = this.my_disc_skills.filter(
        (item) => !item.dark_disc
      );

      // Same for flaws in local_advantages
      if (
        this.local_advantages &&
        this.local_advantages.merits &&
        Array.isArray(this.local_advantages.merits.flaws)
      ) {
        this.local_advantages.merits.flaws =
          this.local_advantages.merits.flaws.filter((item) => !item.dark_disc);
      }
    },
    refundXp() {
      this.chosen_discs.forEach((disc) => {
        this.local_xp += disc.cost;
      });
    },
    resetChosenDiscs() {
      this.refundXp();
      this.cleanupFlaw();
      this.chosen_discs = [];
      this.xp_to_spend = 15;
    },

    distributeDiscs() {
      if (this.chosen_discs.length === 0) {
        return;
      }
      const base_disc = this.ingrained_disc;
      console.log(base_disc);
      this.chosen_discs.forEach((disc) => {
        this.my_disc_skills.push(disc);
      });
      this.local_advantages.merits.flaws.push({
        cost: 0,
        desc: this.disc_flaws[base_disc].description,
        name: `Ingrained ${base_disc} Flaw:
      ${this.disc_flaws[base_disc].name}`,
        dark_disc: true,
      });
    },
    onOKClick() {
      this.cleanupFlaw(); //prevents duping

      //readds stuff
      this.chosen_discs.forEach((disc) => {
        this.my_disc_skills.push(disc);
      });

      if (
        this.local_disc_flaw &&
        this.ingrained_disc &&
        this.chosen_discs.length > 0
      ) {
        this.local_advantages.merits.flaws.push({
          cost: 0,
          desc: this.disc_flaws[this.ingrained_disc].description,
          name: `Ingrained ${this.ingrained_disc} Flaw: ${
            this.disc_flaws[this.ingrained_disc].name
          }`,
          dark_disc: true,
        });
      }
      this.onDialogOK({
        disciplines: this.my_discs,
        disciplineSkillsObj: this.my_disc_skills,
        xp: this.local_xp,
        advantagesObj: this.local_advantages,
        discipline_flaw: this.local_disc_flaw,
      });
    },
  },
  computed: {
    powerOptions() {
      const selectedDiscipline = this.disciplines[this.ingrained_disc];
      if (!selectedDiscipline) return [];

      const skills = selectedDiscipline.skills;

      const xp = this.xp_to_spend;
      const skillLevels = {
        5: [0],
        10: [0, 1],
        15: [0, 1, 2],
      };

      const indexes = skillLevels[xp] || [];

      const options = [];

      indexes.forEach((levelIdx) => {
        const levelSkills = skills[levelIdx] || [];
        const cost = (levelIdx + 1) * 5;
        levelSkills.forEach((skill) => {
          options.push({
            skill,
            discipline: this.ingrained_disc,
            dark_disc: true,
            cost: cost,
            full_name: `${skill} - (${cost} xp)`,
          });
        });
      });

      return options;
    },
  },
});
</script>
