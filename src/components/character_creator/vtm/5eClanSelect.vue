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
                <q-btn
                  @click="step = 2"
                  color="primary"
                  label="Continue"
                  :disable="stepOne()"
                >
                  <q-tooltip
                    v-if="stepOne()"
                    class="bg-dark text-body2"
                    :offset="[1, 1]"
                    >Please select your disciplines</q-tooltip
                  >
                </q-btn>
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="2"
              title="Sire and Generation"
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
    let newDesc = ref(props.info.desc);
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
      if (clan.value === "Caitiff") {
        discChoices.value = [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];
        clanDisciplines.value = [
          "Animalism",
          "Auspex",
          "Blood Sorcery",
          "Celerity",
          "Chimerstry",
          "Dementation",
          "Dominate",
          "Fortitude",
          "Necromancy",
          "Obfuscate",
          "Oblivion",
          "Obtenebration",
          "Potence",
          "Presence",
          "Protean",
          "Quietus",
          "Serpentis",
          "Thaumaturgy",
          "Thin-Blood Alchemy",
          "Vicissitude",
        ];
      } else {
        discChoices.value = [0, 0, 0];
        clanDisciplines.value = ["Celerity", "Potence", "Presence"];
      }
    } else {
      if (clan.value === "Caitiff") {
        clanDisciplines.value = [
          discArr[0].discipline,
          discArr[1].discipline,
          discArr[2].discipline,
          discArr[3].discipline,
          discArr[4].discipline,
          discArr[5].discipline,
          discArr[6].discipline,
          discArr[7].discipline,
          discArr[8].discipline,
          discArr[9].discipline,
          discArr[10].discipline,
          discArr[11].discipline,
          discArr[12].discipline,
          discArr[13].discipline,
          discArr[14].discipline,
          discArr[15].discipline,
          discArr[16].discipline,
          discArr[17].discipline,
          discArr[18].discipline,
          discArr[19].discipline,
        ];
        discChoices.value = [
          discArr[0].choice,
          discArr[1].choice,
          discArr[2].choice,
          discArr[3].choice,
          discArr[4].choice,
          discArr[5].choice,
          discArr[6].choice,
          discArr[7].choice,
          discArr[8].choice,
          discArr[9].choice,
          discArr[10].choice,
          discArr[11].choice,
          discArr[12].choice,
          discArr[13].choice,
          discArr[14].choice,
          discArr[15].choice,
          discArr[16].choice,
          discArr[17].choice,
          discArr[18].choice,
          discArr[19].choice,
        ];
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
      }

      clanBane.value = newBane;
      discExplained.value = newTips.value;
      clanDesc.value = newDesc;
    }

    const disableRating = ref(false);

    return {
      clan,
      clanBane,
      clanDesc,
      clanDisciplines,
      disableRating,
      discChoices,
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
          desc: clanDesc,
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
        case "Banu Haqim":
          this.clanDesc =
            "The “Assamite” viziers, sorcerers, and warriors recently admitted to the Camarilla seek to defend themselves from the judgement of Alamut.";
          this.clanBane =
            "When one of the Judges tastes the Blood of another Cainite, they find it very hard to stop. Slaking at least one Hunger level with vampiric vitae provokes a Hunger Frenzy test at a Difficulty 2 + Bane Severity.[4] If the test is failed they attempt to gorge themselves on vampire Blood, sometimes until they diablerize their Kindred victim.";
          this.clanDisciplines = ["Blood Sorcery", "Celerity", "Obfuscate"];
          this.discExplained = [
            "The use of the Blood to perform magic",
            "Supernatural quickness and reflexes",
            "The ability to remain obscure and unseen, even in crowds",
          ];
          break;
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

        case "Caitiff":
          this.discChoices = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ];
          this.clanDesc =
            "The “Clanless” show no common traits, except to find themselves outcast by vampires of distinct lineage.";
          this.clanBane =
            "Caitiff characters begin with the Suspect (•) Flaw and you may not purchase positive Status for them during character creation. The Storyteller may always impose a one or two dice penalty on Social tests against fellow Kindred who know they are Caitiff, regardless of their eventual Status. Further, to improve one of the Disciplines of a Caitiff costs six times the level purchased in experience points ";
          this.clanDisciplines = [
            "Animalism",
            "Auspex",
            "Blood Sorcery",
            "Celerity",
            "Chimerstry",
            "Dementation",
            "Dominate",
            "Fortitude",
            "Necromancy",
            "Obfuscate",
            "Oblivion",
            "Obtenebration",
            "Potence",
            "Presence",
            "Protean",
            "Quietus",
            "Serpentis",
            "Thaumaturgy",
            "Thin-Blood Alchemy",
            "Vicissitude",
          ];
          this.discExplained = [
            "Supernatural affinity with and control of animals",
            "Extrasensory perception, awareness, and premonitions",
            "The use of the Blood to perform magic",
            "Supernatural quickness and reflexes",
            "Illusions made real or at least tangible",
            "See AUSPEX and DOMINATE. Gift your foes with madness",
            "Mind control practiced through one’s piercing gaze",
            "Unearthly toughness, even to the point of resisting fire and sunlight",
            "See OBLIVION. Control of the dead, both spirit and corpse",
            "The ability to remain obscure and unseen, even in crowds",
            "Control over shadows and spirits",
            "See OBLIVION. Manipulation of abyssal darkness",
            "The Discipline of physical vigor and strength",
            "The ability to attract, sway, and control emotions",
            "Shape-changing, from growing claws to melding with the earth",
            "See BLOOD SORCERY and OBFUSCATE. Art of the silent death",
            "See PRESENCE and PROTEAN. Acquire the physicality of serpents",
            "See BLOOD SORCERY. The use of the Blood to perform magic",
            "Mixing blood, emotion, and other ingredients to create powerful effects",
            "The sculpting of flesh into unnatural forms",
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
          this.clanBane =
            "Violent Temper: Subtract dice equal to the Bane Severity of the Brujah from any roll to resist fury frenzy. This cannot take the pool below one die";
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
        if (this.clan === "Caitiff") {
          this.discChoices = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ];
        } else {
          this.discChoices = [0, 0, 0];
        }
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: "Please re-read the discipline instructions.",
        });
      }
    },

    stepOne() {
      let sum = 0;
      this.discChoices.forEach((choice) => (sum += choice));

      if (sum < 3) {
        return true;
      }

      return false;
    },
  },
});
</script>
