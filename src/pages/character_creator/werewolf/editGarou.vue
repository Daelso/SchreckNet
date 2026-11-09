<template>
  <q-page class="flex flex-center">
    <suspense :timeout="0">
      <template #default>
        <garou :key="attempt" @retry="attempt++" />
      </template>
      <template #fallback>
        <q-spinner color="secondary" size="3em" aria-label="Loading" />
      </template>
    </suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import garou from "src/components/character_creator/werewolf/edit-garou-5e.vue";

export default defineComponent({
  name: "edit-garou-5e-view",
  components: { garou },
  data() {
    // Bumped by Retry to remount the character and reload it.
    return { attempt: 0 };
  },
});
</script>
