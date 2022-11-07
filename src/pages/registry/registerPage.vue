<template>
  <q-page class="flex flex-center">
    <registerForm />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import registerForm from "src/components/registry/registerForm.vue";

export default defineComponent({
  name: "registerPage",
  components: { registerForm },
});
</script>
