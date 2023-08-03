<template>
  <q-item-label header> Social Links </q-item-label>

  <q-item
    clickable
    style="color: red"
    href="https://discord.gg/CvUuaM84Ng"
    target="_blank"
  >
    <q-item-section avatar>
      <q-icon color="secondary" name="discord" style="scale: 120%" />
    </q-item-section>

    <q-item-section>
      <q-item-label>SchreckNet Discord</q-item-label>
      <q-item-label caption style="color: white"
        >Meet your fellow kindred</q-item-label
      >
    </q-item-section>
  </q-item>
  <q-item
    clickable
    style="color: red"
    href="https://www.worldofdarkness.com/"
    target="_blank"
    rel="noreferrer noopener"
  >
    <q-item-section avatar>
      <q-icon color="secondary" name="app:wod" />
    </q-item-section>

    <q-item-section>
      <q-item-label>World of Darkness</q-item-label>
      <q-item-label caption style="color: white"
        >From whence it came</q-item-label
      >
    </q-item-section>
  </q-item>
  <q-item
    clickable
    style="color: red"
    href="https://ko-fi.com/welard"
    target="_blank"
    rel="noreferrer noopener"
  >
    <q-item-section avatar>
      <q-icon color="secondary" name="favorite" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Support SchreckNet</q-item-label>
      <q-item-label caption style="color: white"
        >Helps fund hosting and server costs</q-item-label
      >
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "comingSoonLinks",
});
</script>
