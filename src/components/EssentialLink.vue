<template>
  <q-item clickable style="color: red" to="login">
    <q-item-section avatar>
      <q-icon color="secondary" name="app:ankh" style="scale: 180%" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Vampire: The Masquerade</q-item-label>
      <q-item-label caption style="color: white">5e</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EssentialLink",
});
</script>
