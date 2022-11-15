<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent v-model="layout">
    <q-layout view="Lhh lpR fff" container>
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>Affiliations</q-toolbar-title>
          <q-btn color="primary" label="OK" @click="onOKClick" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding class="bg-dark">
          <q-stepper
            v-model="step"
            vertical
            color="primary"
            animated
            class="stepper"
          >
            <q-step
              :name="1"
              title="Select a clan"
              caption="Assign disciplines as well"
              icon="settings"
              :done="step > 1"
            >
              <q-select
                v-model="clan"
                label="Clan"
                :options="clanOptions"
                bg-color="grey-3"
                filled
                style="margin-bottom: 20px; width: 100%"
                class="select"
                label-color="primary"
                @update:model-value="clanSelected"
              />
              <q-separator />
              <div>Clan Description: {{ clanDesc }}</div>
              <q-separator />
              <div class="q-mt-md q-mb-sm">
                Disciplines: (Choose two in-clan Disciplines. Put two dots in
                one and one dot in the other.)
              </div>
              <q-item v-for="(disciplines, key) in clanDisciplines" :key="key">
                <q-item>
                  {{ disciplines }}:
                  <q-tooltip
                    anchor="top right"
                    self="center left"
                    :offset="[10, 10]"
                    class="bg-dark text-body2"
                  >
                    {{ discExplained[key] }}
                  </q-tooltip>
                </q-item>
                <q-rating
                  size="2.5em"
                  icon="app:ankh"
                  color="white"
                  :max="2"
                  v-model="discChoices[key]"
                  @update:model-value="discSelected()"
                />
              </q-item>
              <q-separator />
              Bane: {{ clanBane }}
              <q-separator />

              <q-stepper-navigation>
                <q-btn @click="step = 2" color="primary" label="Continue" />
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="2"
              title="Sire and Generation"
              caption="Optional"
              icon="create_new_folder"
              :done="step > 2"
            >
              <q-input
                filled
                bg-color="grey-3"
                v-model="sire"
                label="Your sire's name, if you know *"
                autogrow
                lazy-rules
                style="margin-top: 15px; width: 100%"
                label-color="primary"
                :rules="[
                  (val) =>
                    val === null ||
                    val.length <= 2000 ||
                    'Please keep this field under 2000 characters',
                ]"
              />

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

            <q-step :name="3" title="Ad template" icon="assignment">
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

<style>
.q-stepper__dot {
  color: #e31c25;
}
.q-stepper__line {
  color: #e31c25;
}

.stepper {
  background-color: #222831;

  font-size: larger;
}
@media only screen and (max-width: 600px) {
  .stepper {
    font-size: medium;
  }
}
</style>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";
import { useDialogPluginComponent } from "quasar";

export default defineComponent({
  name: "5eClanSelect",
  props: ["info"],
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    const discArr = Object.entries(props.info.disciplines).map((arr) => ({
      discipline: arr[0],
      choice: arr[1],
    }));

    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    const clan = ref(props.info.clan);
    const sect = ref(props.info.sect);
    const archtype = ref(props.info.archtype);
    let newBane = ref(props.info.bane);
    let newTips = ref(props.info.tooltips);
    const sire = ref(null);
    const clanDesc = ref(
      "The 'Rabble' rebel against power and rage against tyranny."
    );
    const clanDisciplines = ref([]);
    const discChoices = ref([]);
    const clanBane = ref(
      "Violent Temper: Subtract dice equal to the Bane Severity of the Brujah from any roll to resist fury frenzy. This cannot take the pool below one die"
    );
    const discExplained = ref([
      "Supernatural quickness and reflexes",
      "The Discipline of physical vigor and strength",
      "The ability to attract, sway, and control emotions",
    ]);
    if (discArr.length === 0) {
      clanDisciplines.value = ["Celerity", "Potence", "Presence"];

      discChoices.value = [0, 0, 0];
    } else {
      clanDisciplines.value = [
        discArr[0].discipline,
        discArr[1].discipline,
        discArr[2].discipline,
      ];

      discChoices.value = [
        discArr[0].choice,
        discArr[1].choice,
        discArr[2].choice,
      ];

      clanBane.value = newBane;
      discExplained.value = newTips.value;
    }

    const discChoicesRemaining = ref(3);
    const disableRating = ref(false);

    console.log(discExplained);

    return {
      clan,
      clanBane,
      clanDesc,
      clanDisciplines,
      disableRating,
      discChoices,
      discChoicesRemaining,
      discExplained,
      sect,
      sire,
      archtype,
      step: ref(1),
      dialogRef,
      onDialogHide,

      clanOptions: [
        "Banu Haqim",
        "Brujah",
        "Caitiff",
        "Gangrel",
        "Hecata",
        "Lasombra",
        "Malkavian",
        "Nosferatu",
        "Toreador",
        "Tremere",
        "Tzimisce",
        "Ventrue",
        "The Ministry",
        "Thin-Blood",
      ],
      sectOptions: [
        "Anarchs",
        "Camarilla",
        "Independent",
        "Sabbat",
        "Clanless",
      ],

      archtypeOptions: ["Murderhobo", "Hobo"],

      onOKClick() {
        onDialogOK({
          clan: clan,
          disciplines: clanDisciplines,
          disciplineChoices: discChoices,
          bane: clanBane,
          tooltips: discExplained,
        });
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
  data() {
    return {
      layout: false,
    };
  },
  methods: {
    clanSelected() {
      console.log(this.clan);
      switch (this.clan) {
        case "Brujah":
          this.clanDesc =
            "The 'Rabble' rebel against power and rage against tyranny.";
          this.clanBane =
            "Violent Temper: Subtract dice equal to the Bane Severity of the Brujah from any roll to resist fury frenzy. This cannot take the pool below one die";
          this.clanDisciplines = ["Celerity", "Potence", "Presence"];
          this.discExplained = [
            "Supernatural quickness and reflexes",
            "The Discipline of physical vigor and strength",
            "The ability to attract, sway, and control emotions",
          ];
          break;
        case "Malkavian":
          this.clanDesc =
            "The madness of the 'Lunatics' conceals and reveals truths.";
          this.clanBane =
            "Derangement: When the Malkavian suffers a Bestial Failure or a Compulsion, their curse comes to the fore. Suffer a penalty equal to your character’s Bane Severity to one category of dice pools (Physical, Social, or Mental) for the entire scene. This is in addition to any penalties incurred by Compulsions.";
          this.clanDisciplines = ["Auspex", "Dominate", "Obfuscate"];
          this.discExplained = [
            "Extrasensory perception, awareness, and premonitions",
            "Mind control practiced through one’s piercing gaze",
            "The ability to remain obscure and unseen, even in crowds",
          ];
          break;
        case y:
          // code block
          break;
        default:
          this.clanDesc =
            "The 'Rabble' rebel against power and rage against tyranny.";
          this.clanDisciplines = ["Celerity", "Potence", "Presence"];
          this.discExplained = [
            "Supernatural quickness and reflexes",
            "The Discipline of physical vigor and strength",
            "The ability to attract, sway, and control emotions",
          ];
      }
    },
    discSelected() {
      let sum = 0;

      this.discChoices.forEach((choice) => (sum += choice));

      function arrayEquals(a, b) {
        return (
          Array.isArray(a) &&
          Array.isArray(b) &&
          a.length === b.length &&
          a.every((val, index) => val === b[index])
        );
      }

      if (sum > 3 || arrayEquals([1, 1, 1], this.discChoices)) {
        this.discChoices = [0, 0, 0];
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: "Please re-read the discipline instructions.",
        });
      }
    },
  },
});
</script>
