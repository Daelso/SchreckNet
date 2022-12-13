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
import mine from "../../../components/character_creator/vtm/myVamps.vue";

export default defineComponent({
  components: { mine },
  name: "my-vamps",
  setup() {
    return {};
  },
});
</script>
