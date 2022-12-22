<template>
  <q-page class="flex flex-center">
    <suspense>
      <hunterSheet />
    </suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import hunterSheet from "src/components/character_creator/hunter/hunterView.vue";

export default defineComponent({
  name: "hunter-5e-view",
  components: { hunterSheet },
});
</script>
