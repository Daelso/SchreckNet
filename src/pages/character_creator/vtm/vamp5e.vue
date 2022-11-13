<template>
  <q-page class="flex flex-center">
    <vampire5e />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import vampire5e from "src/components/character_creator/vtm/vampire-5e.vue";

export default defineComponent({
  name: "vampire-5e",
  components: { vampire5e },
});
</script>
