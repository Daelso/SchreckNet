<template>
  <q-page class="flex flex-center">
    <suspense>
      <hunter />
    </suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import hunter from "src/components/character_creator/hunter/edit-hunter-5e.vue";

export default defineComponent({
  name: "edit-hunter-5e-view",
  components: { hunter },
});
</script>
