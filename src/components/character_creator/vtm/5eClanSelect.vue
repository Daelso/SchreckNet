<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
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
              <div class="q-mt-md">Compulsion: {{ compulsion }}</div>
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
              title="Sire, Generation, Coterie Age, Predator Type"
              icon="remove_red_eye"
              :done="step > 2"
            >
              <q-input
                filled
                bg-color="grey-3"
                v-model="sire"
                label="Your sire's name, if you know"
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
              <q-separator />
              <q-select
                v-model="generation"
                label="Generation"
                :options="generationOptions"
                bg-color="grey-3"
                filled
                style="margin-bottom: 20px; width: 100%"
                class="select"
                label-color="primary"
                option-label="label"
                @update:model-value="generationSelected"
              />
              <q-separator />
              <div>Blood Potency: {{ generation.potency }}</div>
              <q-separator />
              <div class="q-mb-md">
                Max Blood Potency: {{ generation.maxPotency }}
              </div>
              <q-select
                v-model="age"
                label="Coterie Age"
                :options="ageOptions"
                bg-color="grey-3"
                filled
                style="margin-bottom: 20px; width: 100%"
                class="select"
                label-color="primary"
                option-label="label"
                @update:model-value="ageSelected"
              />
              <q-separator />
              Bonus XP: {{ age.bonusXp }}
              <q-stepper-navigation>
                <q-btn @click="step = 3" color="primary" label="Continue" />
                <q-btn
                  flat
                  @click="step = 1"
                  color="secondary"
                  label="Back"
                  class="q-ml-sm"
                />
              </q-stepper-navigation>
            </q-step>

            <q-step :name="3" title="Select Discipline Skills" icon="sort">
              Filler
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

            <q-step :name="4" title="Sect and Archtype" icon="help">
              efwefwefew
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
    const age = ref(props.info.age);
    const clan = ref(props.info.clan);
    let newBane = ref(props.info.bane);
    let newTips = ref(props.info.tooltips);
    let newDesc = ref(props.info.desc);
    const compulsion = ref(props.info.compulsion);
    const generation = ref(props.info.generation);
    const sire = ref(props.info.sire);
    const xp = ref(props.info.xp);
    const humanity = ref(props.info.humanity);
    const clanDesc = ref(
      "The 'Rabble' rebel against power and rage against tyranny."
    );
    const clanDisciplines = ref([]);
    const discChoices = ref([]);
    const clanBane = ref(
      "Violent Temper: Subtract dice equal to the Bane Severity of the Brujah from any roll to resist fury frenzy. This cannot take the pool below one die. (V5 Corebook p.67)"
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
      } else if (clan.value === "Thin-Blood") {
        discChoices.value = [2];
        clanDisciplines.value = ["Thin-blood Alchemy"];
      } else {
        discChoices.value = [0, 0, 0];
        clanDisciplines.value = ["Celerity", "Potence", "Presence"];
        compulsion.value =
          "Rebellion: The vampire takes a stand against whatever or whomever they see as the status quo in the situation, whether that is their leader, a viewpoint expressed by a potential vessel, or just the task they were supposed to do at the moment. Until they have gone against their orders or expectations, perceived or real, the vampire receives a two dice penalty to all rolls. This Compulsion ends once they have managed to either make someone change their minds (by force if necessary) or done the opposite of what was expected of them. (V5 Corebook p.210)";
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
      } else if (clan.value === "Thin-Blood") {
        clanDisciplines.value = [discArr[0].discipline];

        discChoices.value = [discArr[0].choice];
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
      age,
      clan,
      clanBane,
      clanDesc,
      clanDisciplines,
      compulsion,
      disableRating,
      discChoices,
      discExplained,
      generation,
      humanity,
      sire,
      xp,
      step: ref(1),
      dialogRef,
      onDialogHide,

      ageOptions: [
        { label: "Childer", bonusXp: 0 },
        { label: "Neonate", bonusXp: 15 },
        {
          label: "Ancillae",
          bonusXp: 35,
          other:
            "Adds 1 dot in Blood Potency, two dots of advantages, two dots of Flaws and costs you a point of humanity.",
        },
      ],

      clanOptions: [
        "Banu Haqim",
        "Brujah",
        "Caitiff",
        "Gangrel",
        "Hecata",
        "Lasombra",
        "Malkavian",
        "Nosferatu",
        "Ravnos",
        "Salubri",
        "Toreador",
        "Tremere",
        "Tzimisce",
        "Ventrue",
        "The Ministry",
        "Thin-Blood",
      ],
      generationOptions: [
        { label: "16th", potency: 0, maxPotency: 0 },
        { label: "15th", potency: 0, maxPotency: 0 },
        { label: "14th", potency: 0, maxPotency: 0 },
        { label: "13th", potency: 1, maxPotency: 3 },
        { label: "12th", potency: 1, maxPotency: 3 },
        { label: "11th", potency: 2, maxPotency: 4 },
        { label: "10th", potency: 2, maxPotency: 4 },
      ],

      onOKClick() {
        onDialogOK({
          age: age,
          clan: clan,
          compulsion: compulsion,
          desc: clanDesc,
          disciplines: clanDisciplines,
          disciplineChoices: discChoices,
          bane: clanBane,
          tooltips: discExplained,
          sire: sire,
          generation: generation,
          humanity: humanity,
          xp: xp,
        });
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
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
            "When one of the Judges tastes the Blood of another Cainite, they find it very hard to stop. Slaking at least one Hunger level with vampiric vitae provokes a Hunger Frenzy test at a Difficulty 2 + Bane Severity.[4] If the test is failed they attempt to gorge themselves on vampire Blood, sometimes until they diablerize their Kindred victim. " +
            this.citation(2, 167);
          this.compulsion =
            "Judgment: Banu Haqim are compelled to punish anyone seen to transgress against their personal creed, taking their blood as just vengeance for the crime. For one scene the vampire must slake at least one Hunger level from anyone, friend or foe, who acts against a personal Conviction of theirs. Failure to do so results in a three-dice penalty to all rolls until the compulsion is satisfied or the scene ends. (If the one fed from is a vampire, it also triggers their Bane.) " +
            this.citation(2, 167);
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
          this.compulsion =
            "Rebellion: the vampire takes a stand against whatever or whomever they see as the status quo in the situation, whether that is their leader, a viewpoint expressed by a potential vessel, or just the task they were supposed to do at the moment. Until they have gone against their orders or expectations, perceived or real, the vampire receives a two dice penalty to all rolls. This Compulsion ends once they have managed to either make someone change their minds (by force if necessary) or done the opposite of what was expected of them. (V5 Corebook p.210)";

          this.clanBane =
            "Violent Temper: Subtract dice equal to the Bane Severity of the Brujah from any roll to resist fury frenzy. This cannot take the pool below one die (V5 Corebook p.67)";
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
            "Caitiff characters begin with the Suspect (•) Flaw and you may not purchase positive Status for them during character creation. The Storyteller may always impose a one or two dice penalty on Social tests against fellow Kindred who know they are Caitiff, regardless of their eventual Status. Further, to improve one of the Disciplines of a Caitiff costs six times the level purchased in experience points " +
            this.citation(1, 107);
          this.compulsion = "Caitiff possess no clan compulsion.";
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
            "Mind control practiced through one's piercing gaze",
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
        case "Gangrel":
          this.clanDesc = "The feral “Outlanders” blend vampire and beast.";
          this.clanBane =
            "In frenzy, Gangrel gain one or more animal features: a physical trait, a smell, or a behavioral tic. These features last for one more night afterward, lingering like a hangover following debauchery. ";
          this.clanDisciplines = ["Animalism", "Fortitude", "Protean"];
          this.compulsion =
            "Feral Impulses: returning to an animalistic state, the vampire regresses to a point where speech is hard, clothes are uncomfortable, and arguments are best settled with teeth and claws. For one scene, the vampire gains a three-dice penalty to all rolls involving Manipulation and Intelligence. They can only speak in one-word sentences during this time. " +
            this.citation(1, 210);
          this.discExplained = [
            "Supernatural affinity with and control of animals",
            "Unearthly toughness, even to the point of resisting fire and sunlight",
            "Shape-changing, from growing claws to melding with the earth",
          ];
          break;
        case "Hecata":
          this.clanDesc =
            "'The Clan of Death' is more an amalgamation of bloodlines that may have descended from a common progenitor whom the Giovanni destroyed.";
          this.clanBane =
            "The Hecata's kiss is torture to their prey. The pain is unbearable and all encompassing. " +
            this.citation(5, 203);
          this.compulsion =
            "Morbidity: a sense of morbid curiosity. The Hecata's Blood urges them to study the individuals around them for signs of illness, frailty, or impending death. Until they have either predicted a death or solved the cause of a local one, the vampire suffers a three-dice penalty to other rolls. Their conclusions do not need to be absolutely correct, but should stay within the boundaries of the possible. " +
            this.citation(5, 202);
          this.clanDisciplines = ["Auspex", "Fortitude", "Oblivion"];
          this.discExplained = [
            "Extrasensory perception, awareness, and premonitions",
            "Unearthly toughness, even to the point of resisting fire and sunlight",
            "Control over shadows and spirits",
          ];
          break;
        case "Lasombra":
          this.clanDesc =
            "The “Keepers” claim nobility and suffer no fools or traitors among their ranks.";
          this.compulsion =
            "Ruthlessness: To the Lasombra, failure is not an option. Their Blood urges them to increasingly ruthless measures when the Beast flares and they are faced with failure. The next action they fail after suffering this Compulsion causes all rolls to receive a penalty until a future attempt at the same action succeeds.  " +
            this.citation(6, "289-295");
          this.clanBane =
            "Distorted Image: The broken souls of Lasombra vampires are halfway drawn into the Abyss. All reflections and recordings distort, flicker, or become transparent (though this does not conceal their identity with any certainty). Microphones have the same difficulty with the vampire's voice as cameras have with their image, touch technology becomes unresponsive at best, and their anomalous nature makes it harder to avoid electronic detection systems. " +
            this.citation(6, "289-295");
          this.clanDisciplines = ["Dominate", "Oblivion", "Potence"];
          this.discExplained = [
            "Mind control practiced through one's piercing gaze",
            "Control over shadows and spirits",
            "The Discipline of physical vigor and strength",
          ];
          break;
        case "Malkavian":
          this.clanDesc =
            "The madness of the 'Lunatics' conceals and reveals truths.";
          this.compulsion =
            "Delusion: Malkavian's extrasensory gifts running wild, the vampire experiences what might be truths or portents, but what others call figments of imagination, dredged up by Hunger. While still functional, the vampire's mind and perceptions are skewed. They receive a two-dice penalty to rolls involving Dexterity, Manipulation, Composure, and Wits as well as on rolls to resist terror frenzy, for one scene. " +
            this.citation(1, 210);
          this.clanBane =
            "Derangement: When the Malkavian suffers a Bestial Failure or a Compulsion, their curse comes to the fore. Suffer a penalty equal to your character's Bane Severity to one category of dice pools (Physical, Social, or Mental) for the entire scene. This is in addition to any penalties incurred by Compulsions. " +
            this.citation(1, 79);
          this.clanDisciplines = ["Auspex", "Dominate", "Obfuscate"];
          this.discExplained = [
            "Extrasensory perception, awareness, and premonitions",
            "Mind control practiced through one's piercing gaze",
            "The ability to remain obscure and unseen, even in crowds",
          ];
          break;
        case "Nosferatu":
          this.clanDesc =
            "The hideous “Sewer Rats” hide their disfigured forms in the darkness, from whence they gather secrets.";
          this.compulsion =
            "Cryptophilia: vampires become consumed with a hunger for secrets, to know that which few or no one knows, almost as strong as that for blood. They also refuse to share secrets with others, except in strict trade for greater ones. " +
            this.citation(1, 210);
          this.clanBane =
            "Repulsiveness: Hideous and vile, all Nosferatu count as having the Repulsive Flaw (-2) and can never increase their rating in the Looks Merit. In addition, any attempt to disguise themselves as non-deformed incurs a penalty to the dice pool equal to the character's Bane Severity (this includes the Obfuscate powers Mask of a Thousand Faces and Manifold Guise). However, most do not break the Masquerade by just being seen.  " +
            this.citation(1, 85);
          this.clanDisciplines = ["Animalism", "Obfuscate", "Potence"];
          this.discExplained = [
            "Supernatural affinity with and control of animals",
            "The ability to remain obscure and unseen, even in crowds",
            "The Discipline of physical vigor and strength",
          ];
          break;
        case "Ravnos":
          this.clanDesc =
            " Reduced to a population of that of a bloodline, the “Deceivers” of Romani heritage were all but destroyed during the Week of Nightmares.";
          this.compulsion =
            "Tempting Fate: The Ravnos vampire is driven by their Blood to court danger. Haunted as they are by righteous fire burning its way up their lineage, why not? The next time the vampire is faced with a problem to solve, any attempt at a solution short of the most daring or dangerous incurs a two-dice penalty. (Suitably flashy and risky attempts can even merit bonus dice for this occasion.) The Daredevil is free to convince any fellows to do things their way, but is just as likely to go at it alone. The Compulsion persists until the problem is solved or further attempts become impossible. " +
            this.citation(7, "6-10");
          this.clanBane =
            "Doomed: A Ravnos' Bane is that the sun's fire that incinerated their founder rages through the Blood of the clan, erupting from their very flesh if they ever settle down for long. If they slumber in the same place more than once in seven nights, roll a number of dice equal to their Bane Severity. They receive aggravated damage equal to the number of 10’s (critical results) rolled as they are scorched from within. This happens every time they spend the day in a location they've already slumbered less than a week before. What constitutes a location in this regard depends on the scope of the chronicle, but unless otherwise stated, two resting places need to be at least a mile apart to avoid triggering the Bane. Furthermore, a mobile haven, such as a movers’ truck, is safe so long as the place where the truck is parked is at least a mile from the last location. " +
            this.citation(7, "6-10");
          this.clanDisciplines = ["Animalism", "Obfuscate", "Presence"];
          this.discExplained = [
            "Supernatural affinity with and control of animals",
            "The ability to remain obscure and unseen, even in crowds",
            "The ability to attract, sway, and control emotions",
          ];
          break;
        case "Salubri":
          this.clanDesc =
            "The rarest clan in the modern nights, the Salubri are healers, warriors and watchers.";
          this.compulsion =
            "Affective Empathy: When a Salubri suffers a Compulsion, the Kindred becomes overwhelmed with empathy for a personal problem that afflicts someone in the scene, seeking to further its resolution. The scale of the personal problem isn’t important; the Salubri understands that sometimes suffering is part of a cumulative situation and not an isolated stimulus. Any action not taken toward mitigating that personal tragedy incurs a two dice penalty. The Compulsion persists until the sufferer's burden is eased or a more immediate crisis supersedes it, or the end of the scene.  " +
            this.citation(7, "13-15");
          this.clanBane =
            "Hunted: A Salubri's Bane is that the Kindred of other clans are especially appreciative of Salubri vitae. When a non-Salubri partakes of the blood of a Cyclops, they often find it difficult to pull themselves away. Consuming enough to abate at least one Hunger level requires a Hunger Frenzy test. If the test fails, they just keep consuming, to the point that they may have to be physically fought off. Additionally, the third eye that Saulot opened while on one of his many journeys passes down through the bloodline every time a Salubri Embraces. This third eye is not always recognizably human in origin, and rumors persist of vertical, serpentine pupils, or even wormlike eyespots. While this third eye can be physically covered, such as with a headscarf or hood, it is always present, and no supernatural power can obscure it. Any time a Salubri activates a Discipline power, the third eye weeps vitae, its intensity correlating to the level of the Discipline being used, from welling up to a torrential flow. The blood flow from the third eye triggers a Hunger Frenzy test from nearby vampires with Hunger 4 or more.  " +
            this.citation(7, "13-15");
          this.clanDisciplines = ["Auspex", "Dominate", "Fortitude"];
          this.discExplained = [
            "Extrasensory perception, awareness, and premonitions",
            "Mind control practiced through one's piercing gaze",
            "Unearthly toughness, even to the point of resisting fire and sunlight",
          ];
          break;
        case "Toreador":
          this.clanDesc =
            "The “Degenerates” seek thrills of art, romance, and cruelty amidst stagnant undeath.";
          this.compulsion =
            "Obsession: enraptured by beauty, the vampire becomes temporarily obsessed with a singular gorgeous thing, able to think of nothing else. Pick one feature, such as a person, a song, an artwork, blood spatter, or even a sunrise. Enraptured, the vampire can hardly take their attention from it, and if spoken to, they only talk about that subject. Any other actions receive a two-dice penalty. " +
            this.citation(1, 210);
          this.clanBane =
            "Aesthetic Fixation: The Toreador exemplify the old saying that art in the blood takes strange forms. They desire beauty so intensely that they suffer in its absence. While your character finds themselves in less than beautiful surroundings, lose the equivalent of their Bane Severity in dice from dice pools to use Disciplines. " +
            this.citation(1, 91);
          this.clanDisciplines = ["Auspex", "Celerity", "Presence"];
          this.discExplained = [
            "Extrasensory perception, awareness, and premonitions",
            "Supernatural quickness and reflexes",
            "The ability to attract, sway, and control emotions",
          ];
          break;
        case "Tremere":
          this.clanDesc =
            "Broken by a new Inquisition, the once-mighty “Warlocks” seek to restore their monopoly on sorcerous power.";
          this.compulsion =
            "Perfectionism: nothing but the best satisfies the vampire. Anything less than exceptional performance instils a profound sense of failure, and they often repeat tasks obsessively to get them 'just right'. Until the vampire scores a critical win on a Skill roll or the scene ends, the vampire labours under a two-dice penalty to all dice pools. The penalty is reduced to one die for a repeated action and removed entirely on a second repeat. " +
            this.citation(1, 210);
          this.clanBane =
            "Tremere vitae can no longer Blood Bond other Kindred, though they themselves can be Bound by Kindred from other clans. A Tremere can still bind mortals and ghouls, though the corrupted vitae must be drunk an additional number of times equal to the vampire’s Bane Severity for the bond to form. " +
            this.citation(1, 97);
          this.clanDisciplines = ["Auspex", "Blood Sorcery", "Dominate"];
          this.discExplained = [
            "Extrasensory perception, awareness, and premonitions",
            "The use of the Blood to perform magic",
            "Mind control practiced through one's piercing gaze",
          ];
          break;
        case "Tzimisce":
          this.clanDesc =
            "The “Fiends” have shed their humanity along with their flesh and yet remain bound to their native soil.";
          this.compulsion =
            "Covetousness: when a Tzimisce suffers a Compulsion, the Kindred becomes obsessed with possessing something in the scene, desiring to add it to their proverbial hoard. This can be anything from an object to a piece of property to an actual person. Any action not taken toward this purpose incurs a two-dice penalty. The Compulsion persists until ownership is established (the Storyteller decides what constitutes ownership in the case of a non-object) or the object of desire becomes unattainable.  " +
            this.citation(7, "16-23");
          this.clanBane =
            "Grounded: Each Tzimisce must choose a specific charge — a physical domain, a group of people, an organization, or even something more esoteric — but clearly defined and limited. The Kindred must spend their daysleep surrounded by their chosen charge.  " +
            this.citation(7, "16-23");
          this.clanDisciplines = ["Animalism", "Dominate", "Protean"];
          this.discExplained = [
            "Supernatural affinity with and control of animals",
            "Mind control practiced through one's piercing gaze",
            "Shape-changing, from growing claws to melding with the earth",
          ];
          break;
        case "Ventrue":
          this.clanDesc =
            "The aristocratic “Blue Bloods” enforce the Traditions and the Masquerade on the lesser breeds.";
          this.compulsion =
            "Arrogance: the need to rule rears its head in the vampire. They stop at nothing to assume command of a situation. Someone must obey an order from the vampire. Any action not directly associated with leadership receives a two-dice penalty. This Compulsion lasts until an order has been obeyed, though the order must not be supernaturally enforced, such as through Dominate. " +
            this.citation(1, "210-211");
          this.clanBane =
            "Rarefied Tastes: When a Ventrue drinks blood from any mortal outside their preference, a profound exertion of will is required or the blood taken surges back up as scarlet vomit. Ventrue can sense if a mortal possesses the blood they require. If Ventrue want to feed from anything but their preferred victim, they must spend Willpower points equal to the character's Bane Severity. " +
            this.citation(1, "102");
          this.clanDisciplines = ["Dominate", "Fortitude", "Presence"];
          this.discExplained = [
            "Mind control practiced through one's piercing gaze",
            "Unearthly toughness, even to the point of resisting fire and sunlight",
            "The ability to attract, sway, and control emotions",
          ];
          break;
        case "The Ministry":
          this.clanDesc =
            "The pluralistic and largest branch of the “Setites” has embraced heresy in lieu of dogma.";
          this.compulsion =
            "Transgression: Set teaches that everyone's mind and spirit are bound by invisible chains of their own making. Their Blood chafes at these bindings and the Minister suffers a burning need to break them. The vampire receives a two-dice penalty to all dice pools not relating to enticing someone (including themselves) to break a Chronicle Tenet or personal Conviction, causing at least one Stain and ending this Compulsion. " +
            this.citation(3, "210-211");
          this.clanBane =
            "In 5th Edition, the Bane of the Ministry is that their Blood abhors the light. When exposed to direct illumination – whether natural or artificial – members of the clan recoil. Ministers receive a penalty equal to their Bane Severity to all dice pools when subjected to bright light directed straight at them. Also, they add their Bane Severity to aggravated damage taken from sunlight. " +
            this.citation(3, "102");
          this.clanDisciplines = ["Obfuscate", "Presence", "Protean"];
          this.discExplained = [
            "The ability to remain obscure and unseen, even in crowds",
            "The ability to attract, sway, and control emotions",
            "Shape-changing, from growing claws to melding with the earth",
          ];
          break;
        case "Thin-Blood":
          this.clanDesc =
            "The blood of the “Duskborn” is far too diluted to fully share in the vampiric curse and are considered less-than by much of Kindred Society.";
          this.compulsion =
            "Thin-bloods do not have a clan compulsion." +
            this.citation(1, "113");
          this.clanBane =
            "Thin-bloods do not possess a clan bane, their vitae is too far removed. " +
            this.citation(1, "113");
          this.clanDisciplines = ["Thin-blood Alchemy"];
          this.discExplained = [
            "Mixing blood, emotion, and other ingredients to create powerful effects",
          ];
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
        } else if (this.clan === "Thin-Blood") {
          this.discChoices = [0];
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

    ageSelected() {
      switch (this.age.label) {
        case "Childer":
          this.xp = 0;
          break;
        case "Neonate":
          this.xp = 15;
          break;
        case "Ancillae":
          this.xp = 35;
          this.humanity = 6;
          break;
        default:
          this.xp += 0;
      }
    },

    generationSelected() {
      console.log(this.age);
    },

    stepOne() {
      let sum = 0;
      this.discChoices.forEach((choice) => (sum += choice));

      if (sum < 3 && this.clan != "Thin-Blood") {
        return true;
      }

      return false;
    },
    citation(book, pageNum) {
      let bookName;
      switch (book) {
        case 1:
          bookName = "Core Rulebook";
          break;
        case 2:
          bookName = "Camarilla";
          break;
        case 3:
          bookName = "Anarch";
          break;
        case 4:
          bookName = "Sabbat";
          break;
        case 5:
          bookName = "Cults of the Blood Gods";
          break;
        case 6:
          bookName = "Chicago by Night";
          break;
        case 7:
          bookName = "Vampire: The Masquerade Companion";
          break;
        default:
          bookName = "Core Rulebook";
      }

      return `(V5 ${bookName}, p.${pageNum})`;
    },
  },
});
</script>
