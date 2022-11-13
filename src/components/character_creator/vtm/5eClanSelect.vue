<template>
  <q-dialog persistent v-model="layout">
    <q-layout view="Lhh lpR fff" container>
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>Affiliations</q-toolbar-title>
          <q-btn flat v-close-popup round dense> Save </q-btn>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding class="bg-primary">
          <q-stepper v-model="step" vertical color="primary" animated>
            <q-step
              :name="1"
              title="Select a clan"
              icon="settings"
              :done="step > 1"
            >
              <q-select
                v-model="clan"
                label="Clan"
                :options="clanOptions"
                bg-color="grey-3"
                filled
                style="margin-bottom: 20px"
                class="select"
                label-color="primary"
                @update:model-value="clanSelected"
              />
              <q-separator />
              For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.

              <q-stepper-navigation>
                <q-btn @click="step = 2" color="primary" label="Continue" />
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="2"
              title="Create an ad group"
              caption="Optional"
              icon="create_new_folder"
              :done="step > 2"
            >
              An ad group contains one or more ads which target a shared set of
              keywords.

              <q-stepper-navigation>
                <q-btn @click="step = 4" color="primary" label="Continue" />
                <q-btn
                  flat
                  @click="step = 1"
                  color="primary"
                  label="Back"
                  class="q-ml-sm"
                />
              </q-stepper-navigation>
            </q-step>

            <q-step :name="3" title="Ad template" icon="assignment" disable>
              This step won't show up because it is disabled.
            </q-step>

            <q-step :name="4" title="Create an ad" icon="add_comment">
              Try out different ad text to see what brings in the most
              customers, and learn how to enhance your ads using features like
              ad extensions. If you run into any problems with your ads, find
              out how to tell if they're running and how to resolve approval
              issues.

              <q-stepper-navigation>
                <q-btn color="primary" label="Finish" />
                <q-btn
                  flat
                  @click="step = 2"
                  color="primary"
                  label="Back"
                  class="q-ml-sm"
                />
              </q-stepper-navigation>
            </q-step>
          </q-stepper>
          <q-select
            v-model="archtype"
            :options="archtypeOptions"
            label="Archtype"
            label-color="primary"
            bg-color="grey-3"
            filled
            style="margin-bottom: 20px"
          />
          <q-select
            v-model="sect"
            :options="sectOptions"
            label="Sect"
            label-color="primary"
            bg-color="grey-3"
            filled
          />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { ref, computed } from "vue";

export default defineComponent({
  name: "5eClanSelect",
  props: ["info"],
  setup() {
    const moreContent = ref(true);

    return {
      step: ref(1),

      moreContent,
      contentSize: computed(() => (moreContent.value ? 150 : 5)),

      clanOptions: [
        "Brujah",
        "Gangrel",
        "Malkavian",
        "Nosferatu",
        "Toreador",
        "Tremere",
        "Ventrue",
        "Caitiff",
        "Thin-Blood",
      ],
      sectOptions: ["Camarilla", "Anarchs", "Sabbat"],

      archtypeOptions: ["Murderhobo", "Hobo"],
    };
  },
  data() {
    return {
      layout: false,
      clan: this.info.clan,
      sect: this.info.sect,
      archtype: this.info.archtype,
    };
  },

  methods: {
    clanSelected() {
      console.log(this.clan);
      this.$emit("newClan", this.clan);
    },
  },
});
</script>
