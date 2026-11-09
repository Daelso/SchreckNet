<template>
  <q-page class="flex flex-center">
    <suspense :timeout="0">
      <template #default>
        <garouSheet :key="attempt" @retry="attempt++" />
      </template>
      <template #fallback>
        <q-spinner color="secondary" size="3em" aria-label="Loading" />
      </template>
    </suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import garouSheet from "src/components/character_creator/werewolf/werewolfView.vue";

export default defineComponent({
  name: "garou-view",
  components: { garouSheet },
  data() {
    // Bumped by Retry to remount the character and reload it.
    return { attempt: 0 };
  },
});
</script>
