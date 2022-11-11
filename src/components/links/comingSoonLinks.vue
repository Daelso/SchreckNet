<template>
  <q-item-label header> Coming Soon </q-item-label>

  <q-item style="color: red">
    <q-item-section avatar>
      <q-icon color="secondary" name="app:ankh" style="scale: 180%" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Vampire: The Masquerade</q-item-label>
      <q-item-label caption style="color: white">20th</q-item-label>
    </q-item-section>
  </q-item>
  <q-item style="color: red">
    <q-item-section avatar>
      <q-icon color="secondary" name="app:claws" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Werewolf the Apocalypse</q-item-label>
      <q-item-label caption style="color: white">20th/5E</q-item-label>
    </q-item-section>
  </q-item>
  <q-item style="color: red">
    <q-item-section avatar>
      <q-icon color="secondary" name="app:hunter" style="scale: 145%" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Hunter the Reckoning</q-item-label>
      <q-item-label caption style="color: white">1E/5E</q-item-label>
    </q-item-section>
  </q-item>
  <q-item style="color: red">
    <q-item-section avatar>
      <q-icon color="secondary" name="app:mage" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Mage the Ascension</q-item-label>
      <q-item-label caption style="color: white">20th/5E</q-item-label>
    </q-item-section>
  </q-item>
  <q-item style="color: red">
    <q-item-section avatar>
      <q-icon color="secondary" name="app:changeling" style="scale: 150%" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Changeling: The Dreaming</q-item-label>
      <q-item-label caption style="color: white">20th</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "comingSoonLinks",
});
</script>
