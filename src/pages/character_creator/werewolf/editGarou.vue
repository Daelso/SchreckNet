<template>
  <q-page class="flex flex-center">
    <suspense>
      <garou />
    </suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import garou from "src/components/character_creator/werewolf/edit-garou-5e.vue";

export default defineComponent({
  name: "edit-garou-5e-view",
  components: { garou },
});
</script>
