<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
        <div v-if="dataFromApi">{{ dataFromApi }}</div>
        <div v-else>Loading...</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="secondary" @click="emit('cancel')" />
        <q-btn flat label="OK" color="primary" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useDialogPluginComponent } from "quasar";

export default defineComponent({
  name: "ManageDisciplineFlaw",

  props: {
    title: String,
    info: Object, // passed from componentProps
  },

  setup(props, { emit }) {
    const dataFromApi = ref("");
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    async function loadData() {
      const result = await new Promise((resolve) =>
        setTimeout(() => resolve("Fetched flaw data!"), 1000)
      );
      dataFromApi.value = result;
    }

    function confirm() {
      emit("ok", {
        xp: props.info?.xp ?? 0,
        advantagesObj: props.info?.advantagesObj ?? {},
        disciplines: props.info?.disciplines ?? [],
        disciplineSkillsObj: props.info?.disciplineSkills ?? [],
        attributes: {
          value: [
            { name: "Strength", points: 3 },
            { name: "Dexterity", points: 2 },
          ],
        },
      });
    }

    onMounted(loadData);

    return {
      dataFromApi,
      emit,
      confirm,
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
    return {};
  },
});
</script>
