<template>
  <q-item clickable style="color: red" :to="{ name: 'vampire5e' }">
    <q-item-section avatar>
      <q-icon color="secondary" name="app:ankh" style="scale: 180%" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Vampire: The Masquerade </q-item-label>
      <q-item-label caption style="color: white">5e</q-item-label>
    </q-item-section>
  </q-item>

  <q-item style="color: red" clickable :to="{ name: 'garou5e' }">
    <q-item-section avatar>
      <q-icon color="secondary" name="app:claws" style="scale: 145%" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Werewolf: The Apocalypse</q-item-label>
      <q-item-label caption style="color: white">5e</q-item-label>
    </q-item-section>
  </q-item>

  <q-item style="color: red" clickable :to="{ name: 'hunter5e' }">
    <q-item-section avatar>
      <q-icon color="secondary" name="app:hunter" style="scale: 145%" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Hunter: The Reckoning</q-item-label>
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
