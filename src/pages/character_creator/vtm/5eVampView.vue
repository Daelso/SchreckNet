<template>
  <q-page class="flex flex-center">
    <suspense>
      <kindred />
    </suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import kindred from "src/components/character_creator/vtm/kindredView.vue";

export default defineComponent({
  name: "vampire-5e-view",
  components: { kindred },
});
</script>
