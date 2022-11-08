<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 480px">
      <q-img :src="darkpack" />
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          expand-separator
          icon="perm_identity"
          label="What is the Dark Pack?"
          caption="Thank you Paradox Interactive!"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              The Dark Pack is an agreement between Paradox Interactive, the
              owners of the World of Darkness IP and us, the fans. It is what
              allows us to use their intellectual property and provide you with
              things like character generators, references to WoD lore and more
              - all for free!
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="monitor"
          label="This website is not an official World of Darkness product"
          caption="We have no affiliation whatsoever with World of Darkness or Paradox Interactive."
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              Portions of the materials are the copyrights and trademarks of
              Paradox Interactive AB, and are used with permission. All rights
              reserved. For more information please visit
              <a
                href="https://www.worldofdarkness.com/"
                target="_blank"
                rel="noopener noreferrer"
                >worldofdarkness.com</a
              >.
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </q-page>
</template>

<style>
.backgroundDefault {
  background-color: #171a1e;
}
</style>

<script>
import { defineComponent } from "vue";
import darkpack from "../../assets/images/darkpack_logo2.png";

export default defineComponent({
  name: "dark-pack",
  setup() {
    return {
      darkpack,
    };
  },
});
</script>
