<template>
  <q-page class="flex flex-center">
    <PasswordReset />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import PasswordReset from "src/components/registry/passwordReset.vue";

export default defineComponent({
  name: "passwordReset",
  components: { PasswordReset },
});
</script>
