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
import mine from "../components/myFavs.vue";

export default defineComponent({
  components: { mine },
  name: "my-favs",
  setup() {
    return {};
  },
});
</script>
