<template>
  <q-page class="flex flex-center">
    <suspense :timeout="0">
      <template #default>
        <editvampire5e :key="attempt" @retry="attempt++" />
      </template>
      <template #fallback>
        <q-spinner color="secondary" size="3em" aria-label="Loading" />
      </template>
    </suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import editvampire5e from "src/components/character_creator/vtm/edit-vampire-5e.vue";

export default defineComponent({
  name: "edit-vampire-5e",
  components: { editvampire5e },
  data() {
    // Bumped by Retry to remount the character and reload it.
    return { attempt: 0 };
  },
});
</script>
