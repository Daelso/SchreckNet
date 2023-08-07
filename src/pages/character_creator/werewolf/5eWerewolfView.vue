<template>
  <q-page class="flex flex-center">
    <suspense>
      <garouSheet />
    </suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import garouSheet from "src/components/character_creator/werewolf/werewolfView.vue";

export default defineComponent({
  name: "garou-view",
  components: { garouSheet },
});
</script>
