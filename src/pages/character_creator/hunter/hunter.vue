<template>
  <q-page class="flex flex-center">
    <suspense :timeout="0">
      <template #default>
        <hunterSheet :key="attempt" @retry="attempt++" />
      </template>
      <template #fallback>
        <q-spinner color="secondary" size="3em" aria-label="Loading" />
      </template>
    </suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import hunterSheet from "src/components/character_creator/hunter/hunterView.vue";

export default defineComponent({
  name: "hunter-5e-view",
  components: { hunterSheet },
  data() {
    // Bumped by Retry to remount the character and reload it.
    return { attempt: 0 };
  },
});
</script>
