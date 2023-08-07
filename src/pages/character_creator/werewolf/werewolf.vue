<template>
  <q-page class="flex flex-center">
    <suspense>
      <garouSheet />
    </suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import garouSheet from "src/components/character_creator/werewolf/werewolf-5e.vue";
export default defineComponent({
  name: "garou-5e-view",
  components: { garouSheet },
});
</script>
