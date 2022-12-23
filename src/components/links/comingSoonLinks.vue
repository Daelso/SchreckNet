<template>
  <q-item-label header> Coming Soon </q-item-label>

  <q-item style="color: red">
    <q-item-section avatar>
      <q-icon color="secondary" name="app:claws" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Werewolf: The Apocalypse</q-item-label>
      <q-item-label caption style="color: white">5e</q-item-label>
    </q-item-section>
  </q-item>

  <q-item style="color: red">
    <q-item-section avatar>
      <q-icon color="secondary" name="app:mage" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Mage the Ascension</q-item-label>
      <q-item-label caption style="color: white">5e</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "comingSoonLinks",
});
</script>
