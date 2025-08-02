<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-pa-md bg-dark">
      <q-card-section>
        <div class="text-h6">Select an Ingrained Discipline</div>
        <q-expansion-item
          label="Blunt Ingrained Discipline (Example)"
          expand-icon="expand_more"
          default-opened
          class="bg-grey-10 text-white rounded-borders shadow-2 q-mb-md"
          header-class="bg-grey-9 text-white"
        >
          <!-- Custom icon slot -->
          <template v-slot:header>
            <div class="row items-center q-gutter-sm">
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
          <div class="q-pa-md">
            <p class="q-mb-md">
              <strong>What's that?</strong> An ingrained discipline allows you
              to take up to 3 more discipline powers above the normal cap of 5.
              With this extra power comes a flaw. It is suggested that you
              already have 3 dots in a discipline <em>and</em> Storyteller
              approval before selecting this option.
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

      <q-card-actions align="right">
        <q-btn flat label="OK" color="white" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useDialogPluginComponent } from "quasar";
import disc_flaws from "../vtm/5eDisciplineFlaws.json";
import nosImage from "../../../assets/images/Nosfer_logo.png";

export default defineComponent({
  name: "ManageDisciplineFlaw",

  props: ["info"],
  emits: [...useDialogPluginComponent.emits],
  created() {
    console.log(this.disc_flaws);
  },
  setup(props, { emit }) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    return {
      emit,
      onCancelClick: onDialogCancel,
      dialogRef,
      onDialogHide,
      onOKClick() {
        onDialogOK({
          advantages: advantagePoints,
          disciplines: disciplines,
          disciplineSkillsObj: disciplineSkillsObj,
          potency: potency,
          xp: localXP,
        });
      },
    };
  },
  data() {
    return { disc_flaws, nosImage };
  },
});
</script>
