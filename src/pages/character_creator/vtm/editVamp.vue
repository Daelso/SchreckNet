<template>
  <q-page class="flex flex-center">
    <suspense>
      <editvampire5e />
    </suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import editvampire5e from "src/components/character_creator/vtm/edit-vampire-5e.vue";

export default defineComponent({
  name: "edit-vampire-5e",
  components: { editvampire5e },
});
</script>
