<template>
  <q-page class="flex flex-center">
    <suspense>
      <mine />
    </suspense>
  </q-page>
</template>

<style>
.backgroundDefault {
  background-color: #171a1e;
}
</style>

<script>
import { defineComponent } from "vue";
import mine from "../../../components/character_creator/werewolf/myGarou.vue";

export default defineComponent({
  components: { mine },
  name: "my-garou",
  setup() {
    return {};
  },
});
</script>
