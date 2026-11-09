<template>
  <q-page class="flex flex-center">
    <suspense :timeout="0">
      <template #default>
        <kindred :key="attempt" @retry="attempt++" />
      </template>
      <template #fallback>
        <q-spinner color="secondary" size="3em" aria-label="Loading" />
      </template>
    </suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import kindred from "src/components/character_creator/vtm/kindredView.vue";

export default defineComponent({
  name: "vampire-5e-view",
  components: { kindred },
  data() {
    // Bumped by Retry to remount the character and reload it.
    return { attempt: 0 };
  },
});
</script>
