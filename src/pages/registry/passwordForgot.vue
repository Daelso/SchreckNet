<template>
  <q-page class="flex flex-center">
    <PasswordForgot />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import PasswordForgot from "src/components/registry/passwordForgot.vue";

export default defineComponent({
  name: "passwordForgot",
  components: { PasswordForgot },
});
</script>
