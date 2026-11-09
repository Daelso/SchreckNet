<template>
  <q-page class="flex flex-center">
    <suspense :timeout="0">
      <template #default>
        <hunter :key="attempt" @retry="attempt++" />
      </template>
      <template #fallback>
        <q-spinner color="secondary" size="3em" aria-label="Loading" />
      </template>
    </suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import hunter from "src/components/character_creator/hunter/edit-hunter-5e.vue";

export default defineComponent({
  name: "edit-hunter-5e-view",
  components: { hunter },
  data() {
    // Bumped by Retry to remount the character and reload it.
    return { attempt: 0 };
  },
});
</script>
