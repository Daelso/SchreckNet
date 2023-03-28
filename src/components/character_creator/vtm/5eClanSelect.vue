<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    persistent
    style="color: white"
  >
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
                color="secondary"
                label="Clan"
                popup-content-style="background-color:#222831; color:white"
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
              <div
                class="q-mt-md q-mb-sm"
                v-if="this.clan !== 'Thin-Blood' && this.clan !== 'Caitiff'"
              >
                Disciplines: (Choose two in-clan Disciplines. Put two dots in
                one and one dot in the other.)
              </div>
              <q-item
                v-for="(disciplines, key) in clanDisciplines"
                :key="key"
                v-if="this.clan !== 'Thin-Blood' && this.clan !== 'Caitiff'"
              >
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
              <div v-if="this.clan === 'Caitiff'">
                <div class="q-my-md" style="font-weight: bold">
                  Disciplines: (Choose three Caitiff Disciplines. Put two dots
                  in one and one dot in the other. Select a third to be taken at
                  0.)
                </div>
                <q-separator />
                <q-item
                  v-for="(disciplines, key) in clanDisciplines"
                  :key="key"
                >
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
                <q-select
                  v-model="caitiffThird"
                  label="Select your 3rd Caitiff Discipline (0 dots)"
                  popup-content-style="background-color:#222831; color:white"
                  :options="caitiffThirdOptions"
                  bg-color="grey-3"
                  color="secondary"
                  filled
                  style="margin-bottom: 20px; width: 100%"
                  class="select"
                  label-color="primary"
                />
              </div>
              <div v-if="this.clan === 'Thin-Blood'">
                <div class="q-my-md" style="font-weight: bold">
                  Duskborn must choose between 1-3 Thin-Blood Merits, they must
                  also take an equal amount of flaws.
                </div>
                <div class="q-my-sm">
                  Thin-Blood Advantages: {{ clanThinAdvantages }}
                </div>
                <q-separator />
                <div class="q-my-sm">Thin-Blood Flaws: {{ clanThinFlaws }}</div>
                <div>
                  <q-list
                    dark
                    padding
                    bordered
                    class="rounded-borders q-mb-md"
                    style="max-width: 378px"
                  >
                    <q-expansion-item icon="trending_up" label="Merits">
                      <q-card style="background-color: #222831">
                        <q-card-section>
                          <q-list bordered separator>
                            <div v-if="this.thinMeritsOnly.length < 1">
                              None Selected
                            </div>
                            <q-item
                              v-for="(advantage, key) in this.thinMeritsOnly"
                              :key="key"
                              clickable
                              v-ripple
                              @click="
                                removeThinAdvantage(
                                  $event.target.id,
                                  advantage.name
                                )
                              "
                            >
                              <q-item-section :id="key">
                                {{ advantage.name }}
                                - {{ advantage.cost }} dots
                                <q-tooltip class="bg-dark text-body2"
                                  >Click to delete</q-tooltip
                                >
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-card-section>
                      </q-card>
                    </q-expansion-item>
                    <q-separator />
                    <q-expansion-item icon="support" label="Flaws">
                      <q-card style="background-color: #222831">
                        <q-card-section>
                          <q-list bordered separator>
                            <div v-if="this.thinFlawsOnly.length < 1">
                              None Selected
                            </div>
                            <q-item
                              v-for="(advantage, key) in this.thinFlawsOnly"
                              :key="key"
                              clickable
                              v-ripple
                              @click="
                                removeThinFlaw($event.target.id, advantage.name)
                              "
                            >
                              <q-item-section :id="key">
                                {{ advantage.name }}
                                - {{ advantage.cost }} dots
                                <q-tooltip class="bg-dark text-body2"
                                  >Click to delete</q-tooltip
                                >
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-card-section>
                      </q-card>
                    </q-expansion-item>
                  </q-list>
                </div>
                <q-select
                  v-model="advantagesOrFlaws"
                  label="Select Thin-Blood Advantages or Flaws"
                  popup-content-style="background-color:#222831; color:white"
                  :options="advantagesOrFlawsOptions"
                  bg-color="grey-3"
                  color="secondary"
                  filled
                  style="margin-bottom: 20px; width: 100%"
                  class="select"
                  label-color="primary"
                />
                <q-select
                  v-if="this.advantagesOrFlaws"
                  v-model="thinBloodMerits"
                  :label="
                    this.advantagesOrFlaws === 'Advantages'
                      ? 'Advantages'
                      : 'Flaws'
                  "
                  :options="allThinBloodOptions"
                  bg-color="grey-3"
                  filled
                  color="secondary"
                  popup-content-style="background-color:#222831; color:white"
                  style="margin-bottom: 20px; width: 100%"
                  class="select"
                  label-color="primary"
                  option-label="name"
                />
                <div class="description">{{ this.thinBloodMerits.desc }}</div>
                <!-- alchemist -->
                <q-select
                  v-if="
                    this.thinBloodMerits.name ===
                    'Thin-Blood: Thin-blood Alchemist'
                  "
                  v-model="alchemyDiscipline"
                  label="Which Alchemy Discipline Would You Like?"
                  :options="['Athanor Corporis', 'Calcinatio', 'Fixatio']"
                  bg-color="grey-3"
                  filled
                  style="width: 100%"
                  class="select q-my-sm"
                  popup-content-style="background-color:#222831; color:white"
                  label-color="primary"
                  color="secondary"
                />
                <q-select
                  v-if="this.alchemyDiscipline"
                  v-model="formula"
                  label="Select your formula"
                  :options="formulaOptions"
                  bg-color="grey-3"
                  filled
                  style="width: 100%"
                  class="select q-my-sm"
                  color="secondary"
                  label-color="primary"
                  popup-content-style="background-color:#222831; color:white"
                />
                <!-- Disciplines -->
                <q-select
                  v-if="
                    this.thinBloodMerits.name ===
                    'Thin-Blood: Discipline Affinity'
                  "
                  v-model="thinDisc"
                  label="Which Discipline Would You Like?"
                  :options="filteredDiscOptions"
                  bg-color="grey-3"
                  filled
                  color="secondary"
                  style="width: 100%"
                  class="select q-my-sm"
                  popup-content-style="background-color:#222831; color:white"
                  label-color="primary"
                />
                <q-select
                  v-if="this.thinDisc"
                  v-model="thinDiscPower"
                  label="Which power would you like?"
                  :options="disciplineOptions(this.thinDisc, 1)"
                  bg-color="grey-3"
                  filled
                  style="width: 100%"
                  class="select q-my-sm"
                  color="secondary"
                  label-color="primary"
                  popup-content-style="background-color:#222831; color:white"
                />
                <!-- Clan Bane Flaw -->
                <q-select
                  v-if="this.thinBloodMerits.name === 'Thin-Blood: Clan Curse'"
                  v-model="thinBane"
                  label="Which Clan's Bane would you like?"
                  :options="thinClanBanes"
                  bg-color="grey-3"
                  filled
                  style="width: 100%"
                  class="select q-my-sm"
                  label-color="primary"
                  color="secondary"
                  popup-content-style="background-color:#222831; color:white"
                />
                <q-separator />
                <q-btn
                  v-if="this.thinBloodMerits"
                  class="q-mt-sm"
                  style="background-color: #222831"
                  :label="
                    this.advantagesOrFlaws === 'Advantages'
                      ? 'Select Merit'
                      : 'Select Flaw'
                  "
                  @click="this.handleThinMerits()"
                />
              </div>
              <q-stepper-navigation>
                <q-btn
                  @click="
                    () => {
                      step = 2;
                      if (this.clan === 'Caitiff') {
                        this.disciplineObj[this.caitiffThird] = 0;
                      }
                    }
                  "
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
              title="Generation, Coterie Age"
              icon="remove_red_eye"
              :done="step > 2"
            >
              <q-select
                v-model="generation"
                label="Generation"
                :options="filteredGenerationOptions"
                bg-color="grey-3"
                filled
                style="margin-bottom: 20px; width: 100%"
                class="select"
                label-color="primary"
                color="secondary"
                option-label="label"
                popup-content-style="background-color:#222831; color:white"
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
                :options="filteredAgeOptions"
                bg-color="grey-3"
                filled
                style="margin-bottom: 20px; width: 100%"
                class="select"
                label-color="primary"
                option-label="label"
                color="secondary"
                @update:model-value="ageSelected"
                popup-content-style="background-color:#222831; color:white"
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

            <q-step :name="3" title="Predator Type" icon="directions_run">
              <q-select
                v-model="predatorType"
                label="Predator Type"
                :options="modifyPredatorTypes()"
                bg-color="grey-3"
                filled
                style="margin-bottom: 20px; width: 100%"
                class="select"
                label-color="primary"
                option-label="label"
                color="secondary"
                @update:model-value="predatorPicked()"
                popup-content-style="background-color:#222831; color:white"
              />
              <div v-if="modifyPredatorTypes().length === 1">
                Thin-Bloods and Fledglings do not have a predator type.
              </div>
              <div v-if="modifyPredatorTypes().length > 1">
                <div class="predBlurb">{{ predBlurb.desc }}</div>
                <div class="predChoices q-my-md">
                  <q-list dark bordered separator style="max-width: 318px">
                    <q-item v-for="choice in predBlurb.choices" :key="choice">
                      <q-item-section>{{ choice }}</q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <q-separator />
                <div>
                  <q-select
                    v-model="bonusDisc"
                    label="Bonus Discipline Selection"
                    :options="sortPredDiscOptions()"
                    bg-color="grey-3"
                    filled
                    style="margin-bottom: 20px; width: 100%"
                    class="select"
                    label-color="primary"
                    option-label="label"
                    color="secondary"
                    popup-content-style="background-color:#222831; color:white"
                  />
                  <q-separator />
                </div>
                <div>
                  <q-select
                    v-model="bonusSpecs"
                    label="Bonus Specialties Selection"
                    :options="sortPredSpecOptions()"
                    bg-color="grey-3"
                    filled
                    style="margin-bottom: 20px; width: 100%"
                    class="select"
                    label-color="primary"
                    option-label="skill"
                    color="secondary"
                    popup-content-style="background-color:#222831; color:white"
                  />
                  <q-separator />
                </div>
                <div
                  v-if="
                    this.predatorType === 'Scene Queen' ||
                    this.predatorType === 'Farmer' ||
                    this.predatorType === 'Osiris' ||
                    (this.predatorType === 'Booth Buffet' && this.bonusSpecs)
                  "
                >
                  <q-input
                    v-model="bonusSpecs.specialty"
                    label="Specify your specialty"
                    bg-color="grey-3"
                    filled
                    style="margin-bottom: 20px; width: 100%"
                    class="select"
                    label-color="primary"
                  />
                  <q-separator />
                </div>
              </div>

              <q-separator />
              <q-stepper-navigation>
                <q-btn
                  @click="
                    () => {
                      if (this.clan === 'Thin-Blood') {
                        this.disciplinesDone = true;
                        this.onOKClick();
                      }
                      step = 4;

                      confirmPredator();
                    }
                  "
                  color="primary"
                  label="Confirm Predator Selection"
                  :disable="
                    (!bonusSpecs || !bonusDisc) && this.clan !== 'Thin-Blood'
                  "
                >
                  <q-tooltip
                    v-if="!bonusSpecs || !bonusDisc"
                    class="bg-dark text-body2"
                    >Please select your bonuses.</q-tooltip
                  >
                </q-btn>
                <q-btn
                  flat
                  @click="step = 2"
                  color="secondary"
                  label="Back"
                  class="q-ml-sm"
                />
              </q-stepper-navigation>
            </q-step>
            <q-step :name="4" title="Select Discipline Skills" icon="sort">
              Select disciplines available to you:
              <div v-for="(discPoints, key) in finalDisciplineObj" :key="key">
                <div v-if="discPoints > 0">
                  Choose: {{ discPoints }}
                  <q-select
                    v-model="disciplineChoice[key]"
                    :label="key"
                    :options="disciplineOptions(key, discPoints)"
                    bg-color="grey-3"
                    filled
                    style="margin-bottom: 20px; width: 100%"
                    class="select"
                    label-color="primary"
                    option-label="label"
                    color="secondary"
                    @update:model-value="
                      skillPicked(this.disciplineChoice[key], key)
                    "
                    popup-content-style="background-color:#222831; color:white"
                  />
                  <q-separator />
                </div>
              </div>
              <q-list bordered separator>
                <q-item
                  v-for="(skill, key) in skillsSelected"
                  :key="key"
                  clickable
                  v-ripple
                  @click="removeDiscSkill($event.target.id)"
                >
                  <q-item-section :id="key"
                    >Discipline: {{ skill.discipline }} - Skill:
                    {{ skill.skill }}
                    <q-tooltip class="bg-dark text-body2"
                      >Click to delete</q-tooltip
                    >
                  </q-item-section>
                </q-item>
              </q-list>

              <q-stepper-navigation>
                <q-btn
                  color="primary"
                  label="Finish"
                  :disable="donePickingSkills()"
                  @click="onOKClick"
                >
                  <q-tooltip
                    anchor="top right"
                    self="center left"
                    :offset="[10, 10]"
                    class="bg-dark text-body2"
                    v-if="donePickingSkills()"
                  >
                    Please select all of your skills first.
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  @click="step = 3"
                  color="secondary"
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
import disciplineSkills from "../vtm/5eDisciplines.json";
import allPredatorTypes from "../vtm/predatorTypes.json";
import nosImage from "../../../assets/images/Nosfer_logo.png";
import meritJSON from "../vtm/5eMerits.json";

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
    let disciplinesDone = ref(props.info.disciplinesDone);
    let merits = ref(props.info.merits);
    const skillsSelected = ref(props.info.discSkills);
    const predatorType = ref(props.info.predatorType);
    const disciplineObj = ref(props.info.disciplines);
    const finalDisciplineObj = ref(props.info.disciplines);
    const predBlurb = ref({
      desc: "A dangerous, combative attack feeder. You feed by stalking, attacking and overpowering any prey you choose. This is one of the most violent and direct forms of feeding.",
      choices: [
        "Alleycats gain a choice of the Intimidation (stickups) or Brawl (Grappling) specialty.",
        "Choose between one dot of celerity or potence.",
        "Lose one dot of humanity.",
        "Gain three dots of criminal Contacts.",
      ],
    });

    const compulsion = ref(props.info.compulsion);
    const generation = ref(props.info.generation);
    const xp = ref(props.info.xp);
    let flaws = ref(2);
    let advantages = ref(7);
    let clanThinAdvantages = ref(props.info.thinAdvantages);
    let clanThinFlaws = ref(props.info.thinFlaws);
    const humanity = ref(props.info.humanity);
    const clanDesc = ref(
      "The 'Rabble' rebel against power and rage against tyranny."
    );
    const disciplineChoice = ref({});
    const specialtiesFromPred = ref([]);
    const discSpecificArr = ref([]);
    const discSkillsArr = ref([]);
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
        discChoices.value = [];
        clanDisciplines.value = [
          "Animalism",
          "Auspex",
          "Blood Sorcery",
          "Celerity",
          "Dominate",
          "Fortitude",
          "Obfuscate",
          "Oblivion",
          "Potence",
          "Presence",
          "Protean",
        ];
      } else if (clan.value === "Thin-Blood") {
        discChoices.value = [2];
        clanDisciplines.value = ["Athanor Corporis", "Calcinatio", "Fixatio"];
      } else {
        discChoices.value = [0, 0, 0];
        clanDisciplines.value = ["Celerity", "Potence", "Presence"];
        compulsion.value =
          "Rebellion: The vampire takes a stand against whatever or whomever they see as the status quo in the situation, whether that is their leader, a viewpoint expressed by a potential vessel, or just the task they were supposed to do at the moment. Until they have gone against their orders or expectations, perceived or real, the vampire receives a two dice penalty to all rolls. This Compulsion ends once they have managed to either make someone change their minds (by force if necessary) or done the opposite of what was expected of them. (V5 Corebook p.210)";
      }
    } else {
      discArr.forEach((x) => {
        clanDisciplines.value.push(x.discipline);
        discChoices.value.push(x.choice);
      });

      clanBane.value = newBane;
      discExplained.value = newTips.value;
      clanDesc.value = newDesc;
    }

    const disableRating = ref(false);

    return {
      age,
      advantagesOrFlaws: ref(""),
      alchemyDiscipline: ref(""),
      thinDisc: ref(""),
      thinDiscPower: ref(""),
      thinBane: ref(""),
      advantagesOrFlawsOptions: ref(["Advantages", "Flaws"]),
      formula: ref(""),
      advantages,
      allPredatorTypes,
      clan,
      clanBane,
      clanDesc,
      clanDisciplines,
      compulsion,
      disableRating,
      disciplinesDone,
      disciplineSkills,
      disciplineObj,
      finalDisciplineObj,
      discChoices,
      thinBloodMerits: ref(""),
      thinBloodMeritOptions: ref([]),
      disciplineChoice,
      discSkillsArr,
      discSpecificArr,
      discExplained,
      merits,
      flaws,
      meritJSON,
      nosImage,
      generation,
      humanity,
      predBlurb,
      predatorType,
      skillsSelected,
      specialtiesFromPred,
      xp,
      clanThinAdvantages,
      clanThinFlaws,
      step: ref(1),
      dialogRef,
      onDialogHide,

      ageOptions: [
        { label: "Fledgling", bonusXp: 0 },
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
          disciplines:
            Object.keys(finalDisciplineObj.value).length === 0
              ? disciplineObj
              : finalDisciplineObj,
          discSkillsSelected: skillsSelected,
          flaws: flaws,
          advantages: advantages,
          bane: clanBane,
          tooltips: discExplained,
          generation: generation,
          humanity: humanity,
          xp: xp,
          predatorType: predatorType,
          specialtiesFromPred: specialtiesFromPred,
          disciplinesDone: disciplinesDone,
          merits: merits,
          thinAdvantages: clanThinAdvantages,
          thinFlaws: clanThinFlaws,
        });
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
  data() {
    return {
      bonusDisc: "",
      bonusSpecs: "",
      caitiffThird: "",
    };
  },
  methods: {
    clanSelected() {
      this.advantagesOrFlaws = "";
      this.thinBloodMerits = "";
      this.alchemyDiscipline = "";
      this.formula = "";
      this.thinDisc = "";
      this.thinDiscPower = "";
      this.thinBane = "";
      //Thin blood stuff above
      this.skillsSelected = [];
      this.discChoices = [0, 0, 0];
      this.disciplineObj = {};
      this.finalDisciplineObj = {};
      this.humanity = 7;
      this.flaws = 2;
      this.advantages = 7;
      this.generation = { label: "12th", potency: 1, maxPotency: 3 };
      this.age = { label: "Childer", bonusXp: 0 };
      this.specialtiesFromPred = [];
      this.disciplinesDone = false;
      this.merits = {
        merits: { advantages: [], flaws: [] },
        backgrounds: { advantages: [], flaws: [] },
        haven: { advantages: [], flaws: [] },
        loresheets: { advantages: [], flaws: [] },
      };
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
          this.discChoices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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
            "Dominate",
            "Fortitude",
            "Obfuscate",
            "Oblivion",
            "Potence",
            "Presence",
            "Protean",
          ];
          this.discExplained = [
            "Supernatural affinity with and control of animals",
            "Extrasensory perception, awareness, and premonitions",
            "The use of the Blood to perform magic",
            "Supernatural quickness and reflexes",
            "Mind control practiced through one's piercing gaze",
            "Unearthly toughness, even to the point of resisting fire and sunlight",
            "The ability to remain obscure and unseen, even in crowds",
            "Control over shadows and spirits",
            "The Discipline of physical vigor and strength",
            "The ability to attract, sway, and control emotions",
            "Shape-changing, from growing claws to melding with the earth",
            "Mixing blood, emotion, and other ingredients to create powerful effects",
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
          this.clanDisciplines = ["Athanor Corporis", "Calcinatio", "Fixatio"];
          this.discExplained = [
            "Mixing blood, emotion, and other ingredients to create powerful effects",
          ];
          this.finalDisciplineObj = {
            "Athanor Corporis": 0,
            Calcinatio: 0,
            Fixatio: 0,
          };
          this.generation = { label: "14th", potency: 0, maxPotency: 0 };

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
      this.skillsSelected = []; //reset it
      this.disciplineObj = {};
      this.caitiffThird = "";
      let sum = 0;
      this.clanDisciplines.forEach(
        (key, i) => (this.disciplineObj[key] = this.discChoices[i])
      );

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
          this.discChoices = [0, 0, 0];
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
        case "Fledgling":
          this.xp = 0;
          this.humanity = 7;
          this.flaws = 2;
          this.advantages = 7;
          break;
        case "Childer":
          this.xp = 0;
          this.humanity = 7;
          this.flaws = 2;
          this.advantages = 7;
          break;
        case "Neonate":
          this.humanity = 7;
          this.xp = 15;
          this.flaws = 2;
          this.advantages = 7;
          break;
        case "Ancillae":
          this.xp = 35;
          this.humanity = 6;
          this.flaws = 4;
          this.advantages = 9;
        default:
          this.xp += 0;
      }
    },

    stepOne() {
      let sum = 0;
      this.discChoices.forEach((choice) => (sum += choice));

      if (this.skillsSelected.length !== 0 && this.clan !== "Thin-Blood") {
        this.skillsSelected = [];
        this.clanSelected();
        this.$q.notify({
          color: "primary",
          textColor: "white",
          avatar: nosImage,
          timeout: 14000,
          message:
            "To prevent duplicates/bad character data, clan info, disciplines, and merits have been reset.",
        });
        return;
      }

      if (
        this.clan === "Thin-Blood" &&
        this.clanThinAdvantages === this.clanThinFlaws &&
        this.clanThinAdvantages >= 1 &&
        this.clanThinAdvantages <= 3
      ) {
        return false;
      }

      if (this.clan === "Caitiff" && !this.caitiffThird) {
        return true;
      }
      if (sum < 3) {
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

    disciplineOptions(data, points) {
      let mergedOptions = [];
      for (let i = 0; i < points; i++) {
        this.disciplineSkills.Disciplines[data].skills[i].forEach((x) => {
          mergedOptions.push(x);
        });
      }

      for (let i = mergedOptions.length - 1; i >= 0; i--) {
        switch (mergedOptions[i]) {
          case "Unliving Hive":
            if (
              this.finalDisciplineObj.Obfuscate === undefined ||
              this.finalDisciplineObj.Obfuscate < 2
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Obeah":
            if (
              this.finalDisciplineObj.Fortitude === undefined ||
              this.finalDisciplineObj.Fortitude < 1
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Unerring Pursuit":
            if (
              this.finalDisciplineObj.Dominate === undefined ||
              this.finalDisciplineObj.Dominate < 1
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Eyes of Beasts":
            if (
              this.finalDisciplineObj.Animalism === undefined ||
              this.finalDisciplineObj.Animalism < 2
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Unerring Aim":
            if (
              this.finalDisciplineObj.Auspex === undefined ||
              this.finalDisciplineObj.Auspex < 2
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Dementation":
            if (
              this.finalDisciplineObj.Obfuscate === undefined ||
              this.finalDisciplineObj.Obfuscate < 2
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Slavish Devotion":
            if (
              this.finalDisciplineObj.Presence === undefined ||
              this.finalDisciplineObj.Presence < 1
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Ancestral Dominion":
            if (
              this.finalDisciplineObj["Blood Sorcery"] === undefined ||
              this.finalDisciplineObj["Blood Sorcery"] < 2 ||
              this.cult !== "Mithraic Mysteries"
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Submerged Directive":
            if (
              this.skillsSelected.some((e) => e.skill !== "Mesmerize") === false
            ) {
              mergedOptions.splice(i, 1);
            }

            break;
          case "Enduring Beasts":
            if (
              this.finalDisciplineObj.Animalism === undefined ||
              this.finalDisciplineObj.Animalism < 1
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Obdurate":
            if (
              this.finalDisciplineObj.Potence === undefined ||
              this.finalDisciplineObj.Potence < 2
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Valeren":
            if (
              this.finalDisciplineObj.Auspex === undefined ||
              this.finalDisciplineObj.Auspex < 1
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Chimerstry":
            if (
              this.finalDisciplineObj.Presence === undefined ||
              this.finalDisciplineObj.Presence < 1
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Ghost's Passing":
            if (
              this.finalDisciplineObj.Animalism === undefined ||
              this.finalDisciplineObj.Animalism < 1
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Ventriloquism":
            if (
              this.finalDisciplineObj.Auspex === undefined ||
              this.finalDisciplineObj.Auspex < 2
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Fata Morgana":
            if (
              this.finalDisciplineObj.Presence === undefined ||
              this.finalDisciplineObj.Presence < 2
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Mental Maze":
            if (
              this.finalDisciplineObj.Dominate === undefined ||
              this.finalDisciplineObj.Dominate < 1
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Mask of Isolation":
            if (
              this.finalDisciplineObj.Dominate === undefined ||
              this.finalDisciplineObj.Dominate < 1 ||
              this.skillsSelected.some(
                (e) => e.skill !== "Mask of a Thousand Faces"
              ) === false
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Conceal":
            if (
              this.finalDisciplineObj.Auspex === undefined ||
              this.finalDisciplineObj.Auspex < 3
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Vanish":
            if (
              this.skillsSelected.some(
                (e) => e.skill !== "Cloak of Shadows"
              ) === false
            ) {
              mergedOptions.splice(i, 1);
            }

            break;
          case "Arms of Ahriman":
            if (
              this.finalDisciplineObj.Potence === undefined ||
              this.finalDisciplineObj.Potence < 2
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Fatal Prediction":
            if (
              this.finalDisciplineObj.Auspex === undefined ||
              this.finalDisciplineObj.Auspex < 2
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Passion Feast":
            if (
              this.finalDisciplineObj.Fortitude === undefined ||
              this.finalDisciplineObj.Fortitude < 2
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Spark of Rage":
            if (
              this.finalDisciplineObj.Presence === undefined ||
              this.finalDisciplineObj.Presence < 3
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Eyes of the Serpent":
            if (
              this.finalDisciplineObj.Protean === undefined ||
              this.finalDisciplineObj.Protean < 1
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Clear the Field":
            if (
              this.finalDisciplineObj.Dominate === undefined ||
              this.finalDisciplineObj.Dominate < 3
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "True Love's Face":
            if (
              this.finalDisciplineObj.Obfuscate === undefined ||
              this.finalDisciplineObj.Obfuscate < 3 ||
              this.cult !== "Church of Set"
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Irresistible Voice":
            if (
              this.finalDisciplineObj.Dominate === undefined ||
              this.finalDisciplineObj.Dominate < 1
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Magnum Opus":
            if (
              this.finalDisciplineObj.Auspex === undefined ||
              this.finalDisciplineObj.Auspex < 3
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Vicissitude":
            if (
              this.finalDisciplineObj.Dominate === undefined ||
              this.finalDisciplineObj.Dominate < 2
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Flesh Crafting":
            if (
              this.finalDisciplineObj.Dominate === undefined ||
              this.finalDisciplineObj.Dominate < 2 ||
              this.skillsSelected.some((e) => e.skill !== "Vicissitude") ===
                false
            ) {
              mergedOptions.splice(i, 1);
            }
            break;

          case "Visceral Absorption":
            if (
              this.finalDisciplineObj["Blood Sorcery"] === undefined ||
              this.finalDisciplineObj["Blood Sorcery"] < 2
            ) {
              mergedOptions.splice(i, 1);
            }
            break;

          case "Horrid Form":
            if (
              this.finalDisciplineObj.Dominate === undefined ||
              this.finalDisciplineObj.Dominate < 2 ||
              this.skillsSelected.some((e) => e.skill !== "Vicissitude") ===
                false
            ) {
              mergedOptions.splice(i, 1);
            }
            break;

          case "Metamorphosis":
            if (
              this.skillsSelected.some((e) => e.skill !== "Shapechange") ===
              false
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Animal Messenger":
            if (
              this.finalDisciplineObj.Auspex === undefined ||
              this.finalDisciplineObj.Auspex < 1
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Messenger's Command":
            if (
              this.skillsSelected.some(
                (e) =>
                  e.skill !== "Animal Messenger" ||
                  e.skill !== "Compel" ||
                  e.skill !== "Mesmerize"
              ) === false
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Panacea":
            if (
              this.finalDisciplineObj.Fortitude === undefined ||
              this.finalDisciplineObj.Fortitude < 1
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Fatal Flaw":
            if (
              this.finalDisciplineObj.Oblivion === undefined ||
              this.finalDisciplineObj.Oblivion < 1
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Unburdening the Bestial Soul":
            if (
              this.finalDisciplineObj.Dominate === undefined ||
              this.finalDisciplineObj.Dominate < 3
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Weaving":
            if (
              this.skillsSelected.some((e) => e.skill !== "Rapid Reflexes") ===
              false
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Unseen Strike":
            if (
              this.finalDisciplineObj.Obfuscate === undefined ||
              this.finalDisciplineObj.Obfuscate < 4 ||
              this.skillsSelected.some((e) => e.skill !== "Blink") === false
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Implant Suggestion":
            if (this.finalDisciplineObj.Presence === undefined) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Invigorating Vitae":
            if (this.finalDisciplineObj.Auspex === undefined) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Mind Masque":
            if (
              this.finalDisciplineObj.Dominate === undefined ||
              this.finalDisciplineObj.Dominate < 2
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Wrecker":
            if (
              this.skillsSelected.some((e) => e.skill !== "Prowess") === false
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Crash Down":
            if (
              this.skillsSelected.some((e) => e.skill !== "Soaring Leap") ===
              false
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Thrown Voice":
            if (
              (this.finalDisciplineObj.Auspex === undefined ||
                this.finalDisciplineObj.Auspex < 1) === false
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "One With the Land":
            if (
              (this.finalDisciplineObj.Animalism === undefined ||
                this.finalDisciplineObj.Animalism < 2) === false ||
              this.skillsSelected.some((e) => e.skill !== "Earth Meld") ===
                false
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
          case "Shadow Servant":
            if (
              (this.finalDisciplineObj.Auspex === undefined ||
                this.finalDisciplineObj.Auspex < 1) === false
            ) {
              mergedOptions.splice(i, 1);
            }
            break;
        }
      }
      return mergedOptions;
    },

    skillPicked(skill, discipline) {
      let allowedLen = 0;
      for (const property in this.finalDisciplineObj) {
        if (isNaN(this.finalDisciplineObj[property])) {
          continue;
        }
        allowedLen += this.finalDisciplineObj[property];
      }

      if (this.skillsSelected.length === allowedLen) {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message:
            "You have selected all possible skills, please remove one to pick again.",
        });
        return;
      }

      if (this.skillsSelected.filter((e) => e.skill === skill).length > 0) {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: "You have already selected this skill!",
        });
        return;
      }

      let newSkill = { discipline: discipline, skill: skill };
      this.skillsSelected.push(newSkill);
    },
    removeDiscSkill(event) {
      this.skillsSelected.splice(event, 1);
    },

    modifyPredatorTypes() {
      let modifiedArr = this.allPredatorTypes.predator;
      if (this.clan === "Thin-Blood" || this.age.label === "Fledgling") {
        this.predatorType = "None";
        return (modifiedArr = ["None"]);
      }
      if (this.clan === "Ventrue") {
        modifiedArr = modifiedArr.filter(
          (x) => x !== "Bagger" && x !== "Farmer"
        );
      }
      if (this.generation.potency >= 3) {
        modifiedArr = modifiedArr.filter((x) => x !== "Farmer");
      }
      return modifiedArr;
    },
    predatorPicked() {
      this.bonusDisc = "";
      this.bonusSpecs = "";
      switch (this.predatorType) {
        case "Alleycat":
          this.predBlurb = {
            desc: "A dangerous, combative attack feeder. You feed by stalking, attacking and overpowering any prey you choose. This is one of the most violent and direct forms of feeding.",
            choices: [
              "Alleycats gain a choice of the Intimidation (stickups) or Brawl (grappling) specialty.",
              "Choose between one dot of celerity or potence.",
              "Lose one dot of humanity.",
              "Gain three dots of criminal Contacts.",
            ],
          };
          break;
        case "Bagger":
          this.predBlurb = {
            desc: "Instead of hunting you secure your blood from the black market, robbery or a night shift at the blood bank. Ventrue cannot select this option.",
            choices: [
              "Baggers gain a choice of the Larceny (Lockpicking) or Streetwise (Black Market) specialty.",
              "Choose between one dot of blood sorcery (if Tremere or Banu Haqim) or obfuscate.",
              "Gain the Feeding Merit: Iron Gullet (•••)",
              "Gain the enemy flaw: (••) Someone believes you owe them or something else keeps you off the streets.",
            ],
          };
          break;
        case "Blood Leech":
          this.predBlurb = {
            desc: "You drink from other kindred in any way you can. This practice is often forbidden amongst Kindred society.",
            choices: [
              "Gain a choice of the Stealth (against Kindred) or Brawl (Kindred) specialty.",
              "Choose between one dot of celerity or protean.",
              "Gain the Dark Secret Flaw: (••) Diablerist, or the Shunned Flaw: (••)",
              "Lose one dot of humanity.",
              "Gain three dots of criminal Contacts.",
              "Gain the feeding flaw, pray exclusion (mortals)",
            ],
          };
          break;
        case "Booth Buffet":
          this.predBlurb = {
            desc: "You practice a profession which requires a great deal of personal contact in a private or semi-private setting. Maybe you are a hairdresser, a chiropractor, or a tattoo artist. you get your clients to relax when they are alone with you. Sometimes, they even experience an unexplained sense of euphoria as you work on them, which keeps them coming back. They have come to accept that after an appointment they look so awesome, but feel so... drained. ",
            choices: [
              "Gain a specialty in Craft (Specific Trade) or Medicine (Specific Trade)",
              "Gain a dot in Auspex or Presence",
              "Gain three dots (•••) to spread across the Resources, Herd, Contacts and Fame merits",
              "Gain the Enemy Flaw: (••) (Rival in same Trade)",
            ],
          };
          break;
        case "Catfisher":
          this.predBlurb = {
            desc: "You take your time to develop a number of personas online, and use these false identities on social media and forums to develop friendships with kine. You develop these connections to the point a person-to-person meeting can happen, which can be taken advantage for feeding. The benefit of doing so is being able to control the many factors involved in feeding, such as the time and location.",
            choices: [
              "Gain a specialty in Insight (Loneliness) or Technology (Social Media)",
              "Gain a dot in Dominate or Obfuscate",
              "Gain the Merit: Mask (•)",
              "Gain the Enemy Flaw: (•) Catfish Victim",
            ],
          };
          break;
        case "Cleaver":
          this.predBlurb = {
            desc: "Cleaver's feed discretely from close mortal friends or family. Some adopt children, take a wife or maintain a family as a source of blood. This practice is forbidden by the Camarilla.",
            choices: [
              "Gain a choice of the Persuasion (Gaslighting) or Subterfuge (Coverups) specialty.",
              "Choose between one dot of Dominate or Celerity.",
              "Gain the Dark Secret Flaw: (•) Cleaver",
              "Gain the Herd Advantage (••)",
            ],
          };
          break;
        case "Consensualist":
          this.predBlurb = {
            desc: "Consensualists would never feed by force or against ones will. They will always gain permission be it honestly or through manipulation before accessing someone's blood.",
            choices: [
              "Gain a choice of the Medicine (Phlebotomy) or Persuasion (Victims) specialty.",
              "Choose between one dot of Auspex or Fortitude.",
              "Gain one dot of humanity.",
              "Gain the Dark Secret Flaw: (•) Masquerade Breacher",
              "Gain the feeding flaw: (•) pray exclusion (non-consenting)",
            ],
          };
          break;
        case "Extortionist":
          this.predBlurb = {
            desc: "The extortionist likes to force their victims to bleed for them. Ostensibly, the extortionist acquires blood in exchange for services such as security or surveillance, but as many times as the need for protection is real, it is just as often a fiction engineered to make the deal feel acceptable.",
            choices: [
              "Add a specialty: Intimidation (Coercion) or Larceny (Security)",
              "Gain one dot of Dominate or Potence.",
              "Spend three dots between the Contacts and Resources Backgrounds.",
              "Gain the Enemy Flaw: (••) The police or a victim who escaped your extortion and now wants revenge.",
            ],
          };
          break;
        case "Farmer":
          this.predBlurb = {
            desc: "Farmers do everything in their power to not harm humans, drinking exclusively animal blood, even if it means unliving with constant hunger. Ventrue and kindred with a blood potency of 3 or more cannot choose this predator type.",
            choices: [
              "Gain a choice of the Animal Ken (Specific Animal) or Survival (Hunting) specialty.",
              "Choose between one dot of Animalism or Protean.",
              "Gain one dot of humanity.",
              "Gain the feeding flaw: (••) Farmer",
            ],
          };
          break;
        case "Graverobber":
          this.predBlurb = {
            desc: "Graverobbers often feed from fresh corpses, but despite their name, they prefer feeding from mourners in cemeteries and sad, frightened visitors and patients in hospitals. Melancholic Resonance in a victim’s blood appeals more than any other humour. This predator type often requires the vampire to hold a haven in or connections to a church, hospital, or morgue.",
            choices: [
              "Add a specialty: Occult (Grave Rituals) or Medicine (Cadavers)",
              "Gain one dot of Fortitude or Oblivion",
              "Gain the Feeding Merit: (•••) Iron Gullet",
              "Gain the Haven Advantage: (•)",
              "Gain the Herd Flaw: (••) Obvious Predator (your cold nature makes you act in a deeply unsettling matter when hunting)",
            ],
          };
          break;
        case "Grim Reaper":
          this.predBlurb = {
            desc: "The dead, dying and sick are easy prey and even easier if you work within hospital wards or retirement homes. You use your knowledge of medical issues, and your ability to present yourself as a health worker to gain access to these people you can then easily feed upon, or draw copious amounts of blood from. Old Blood never tasted so sweet.",
            choices: [
              "Reapers gain a choice of the Awareness (death) or Larceny (forgery) specialty.",
              "Choose between one dot of Auspex or Oblivion.",
              "Gain one dot of humanity.",
              "Gain the feeding flaw: healthy mortals.",
              "Gain a dot of influence or allies in the medical field.",
            ],
          };
          break;
        case "House Cat":
          this.predBlurb = {
            desc: "We live in the age of delivery apps, online shopping, dating apps and all night services. Getting someone to come to you has never been so easy. Why go hunt in the streets when you can have the food come to your haven? For the modern Anarch you never have to worry about going hungry!",
            choices: [
              "Gain a specialty in Technology (Mobile Apps) or Subterfuge (Luring)",
              "Gain a dot in Dominate or Presence",
              "Spend 2 dots (••) between Resources and Haven",
              "Gain either the Stalkers, Disliked or Enemy (•) Flaw",
            ],
          };
          break;
        case "Montero":
          this.predBlurb = {
            desc: "In the old days, aristocratic Spaniards ran the monteria, a deer hunt in which beaters drove deer into the waiting nobles spears. Carrying on that tradition today, you instead use your retainers to funnel mortals into your waiting fangs.",
            choices: [
              "Reapers gain a choice of the Leadership (Hunting Pack) or Stealth (Stakeout) specialty.",
              "Choose between one dot of Dominate or Obfuscate.",
              "Lose one dot of humanity.",
              "Gain two dots of retainers.",
            ],
          };
          break;
        case "Osiris":
          this.predBlurb = {
            desc: "You are a cult-leader, celebrity or popular twitch streamer with a ready and willing group of fans or worshippers from which to harvest blood. While access to blood is easy, attention isn't always good.",
            choices: [
              "Gain a choice of the Occult (specific tradition) or Performance (Specific entertainment field) specialty.",
              "Choose between one dot of Blood Sorcery (Tremere only) or Presence.",
              "Spend three dots between Fame and Herd.",
              "Spend two points between Enemies and Mythic flaws.",
            ],
          };
          break;
        case "Pursuer":
          this.predBlurb = {
            desc: "You carefully study your victims, following them for days and memorizing their routines. Then, you stalk and pursue your victim through the night. Tormenting them until your hunger has reached its pitch.",
            choices: [
              "Reapers gain a choice of the Investigation (Profiling) or Stealth (Shadowing) specialty.",
              "Choose between one dot of Animalism or Auspex.",
              "Lose one dot of humanity.",
              "Gain the merit: Bloodhound",
              "Gain a dot of contacts from among your hunting grounds.",
            ],
          };
          break;
        case "Sandman":
          this.predBlurb = {
            desc: "You always feed from sleeping victims. Ideally, no one would ever know you were there.",
            choices: [
              "Gain a choice of the Medicine (anesthetics) or Stealth (Break-in) specialty.",
              "Choose between one dot of Auspex or Obfuscate.",
              "Gain one dot of resources.",
            ],
          };
          break;
        case "Roadside Killer":
          this.predBlurb = {
            desc: "You belong with the vagabonds, tourists, and truckers of the world — always moving, never at home. You know how to pick out the ones whose deaths are discounted as the risk of a woman hitchhiking alone, or who simply won’t be missed at all. You still have to fight to keep other vampires away from them lest the herd thins too much, though. In life, you either were one of them, or you met these vagrants as they rested at your roadside stop.",
            choices: [
              "Add a specialty Survival (the road) or Investigation (vampire cant)",
              "Add one dot of Fortitude or Protean",
              "Gain two additional dots of migrating Herd",
              "Gain the Flaw Prey Exclusion (locals)",
            ],
          };
          break;
        case "Scene Queen":
          this.predBlurb = {
            desc: "You hunt exclusively within a sub-culture of your choosing. It could be punks or magic the gathering players. The choice is yours and you have mastered blending in amongst your kind.",
            choices: [
              "Gain a choice of the Etiquette (specific scene), Leadership (specific scene) or Streetwise (specific scene) specialty.",
              "Choose between one dot of Dominate or Potence.",
              "Gain the Fame (•) advantage",
              "Gain the Contact (•) advantage",
              "Gain either the influence flaw: Disliked (•) (Outside of your subculture) or the feeding flaw: prey exclusion (A different subculture)",
            ],
          };
          break;
        case "Siren":
          this.predBlurb = {
            desc: "You hunt almost entirely during or while pretending to have sex. Moving from one-night stand to one-night stand, feeding from random club goers or prostitutes.",
            choices: [
              "Gain a choice of the Persuasion(Seduction) or Subterfuge(Seduction) specialty.",
              "Choose between one dot of Fortitude or Presence.",
              "Gain the Looks (••) merit: Beautiful",
              "Gain the Enemy Flaw: (•) A spurned lover or jealous partner.",
            ],
          };
          break;
        case "Trapdoor":
          this.predBlurb = {
            desc: "You build your nest and lure prey into it like the trapdoor spider. When a mortal enters your domain, they surely will be drunk deep.",
            choices: [
              "Gain a choice of the Persuasion (Marketing) or Stealth (Ambushes) specialty.",
              "Choose between one dot of Protean or Obfuscate.",
              "Gain a (•) Haven",
              "Gain one dot of either retainers or herd.",
              "Gain the Haven Flaw: (•) Creepy or Haunted.",
            ],
          };
          break;
        case "Typhus":
          this.predBlurb = {
            desc: "The dead, dying and sick are easy prey and even easier if you work within hospital wards or retirement homes. You use your knowledge of medical issues, and your ability to present yourself as a health worker to gain access to these people you can then easily feed upon, or draw copious amounts of blood from. Old Blood never tasted so sweet.",
            choices: [
              "Gain a specialty in Medicine (Pharmacy) or Insight (Grief)",
              "Gain a dot in Auspex or Fortitude",
              "Gain the Feeding Merit: Iron Gullett (•••)",
              "Gain the Feeding Flaw: (••) Prey Exclusion (Healthy)",
            ],
          };
          break;
        default:
          this.predBlurb = {
            desc: "A dangerous, combative attack feeder. You feed by stalking, attacking and overpowering any prey you choose. This is one of the most violent and direct forms of feeding.",
            choices: [
              "Alleycats gain a choice of the Intimidation (stickups) or Brawl (Grappling) specialty.",
              "Choose between one dot of celerity or potence.",
              "Lose one dot of humanity.",
              "Gain three dots of criminal Contacts.",
            ],
          };
      }
    },

    confirmPredator() {
      let trueDiscs = {};
      trueDiscs = { ...trueDiscs, ...this.disciplineObj };
      if (this.clan !== "Thin-Blood" && this.age.label !== "Fledgling") {
        if (this.bonusDisc in trueDiscs) {
          trueDiscs[this.bonusDisc]++;
        } else if (this.clan === "Caitiff") {
          trueDiscs[this.bonusDisc] = 1;
          trueDiscs["Caitiff"] = this.bonusDisc;
        } else {
          trueDiscs[this.bonusDisc] = 1;
        }
        this.specialtiesFromPred.push(this.bonusSpecs);
        if (this.clan === "Caitiff") {
          this.merits.merits.flaws.push({
            cost: 1,
            desc: "Mistrusted by Kindred society.",
            name: "Suspect",
          });
        }

        switch (this.predatorType) {
          case "Alleycat":
            this.humanity--;
            this.merits.backgrounds.advantages.push({
              cost: 3,
              desc: "Someone who can help you with a specific task, be it a camarilla insider, police dispatcher or shady merchant. Each dot increases their level of usefulness.",
              name: "Contact: Criminals",
              maxCost: 3,
            });
            break;
          case "Bagger":
            this.merits.merits.advantages.push({
              cost: 3,
              desc: "You can feed from rancid, bagged and processed blood.",
              name: "Iron Gullet",
            });
            this.merits.backgrounds.flaws.push({
              cost: 2,
              desc: "A mortal, group or organization who is aware of you and actively working against you. Each point taken increases their fervor and capability. Enemies are rated two dots lower than allies. A 1 dot enemy is equivalent to a 3 dot ally.",
              name: "Enemy",
            });
            break;
          case "Blood Leech":
            this.humanity--;
            this.generation.potency++;
            this.merits.merits.flaws.push({
              name: "Prey Exclusion: Mortals",
              cost: 1,
              desc: "You refuse to hunt a certain type of prey, be it women, addicts, homeless.",
            });
            this.merits.backgrounds.flaws.push({
              name: "Dark Secret: Diablerist",
              desc: "A milder version of infamy, you have a terrible secret that would harm your reputation if it got out.",
              cost: 2,
              maxCost: 2,
              specNeeded: true,
            });
            break;
          case "Booth Buffet":
            this.merits.backgrounds.flaws.push({
              name: "Enemy: Trade Rival",
              desc: "A mortal, group or organization who is aware of you and actively working against you. Each point taken increases their fervor and capability. Enemies are rated two dots lower than allies. A 1 dot enemy is equivalent to a 3 dot ally.",
              cost: 2,
            });
            this.advantages = this.advantages + 3;
            this.$q.notify({
              color: "primary",
              textColor: "white",
              avatar: nosImage,
              timeout: 12000,
              message:
                "An additional 3 dots have been provided to be divided amongst Resources, Herd and Fame.",
            });
            break;
          case "Catfisher":
            this.merits.backgrounds.flaws.push({
              name: "Enemy: Catfish Victim",
              desc: "A mortal, group or organization who is aware of you and actively working against you. Each point taken increases their fervor and capability. Enemies are rated two dots lower than allies. A 1 dot enemy is equivalent to a 3 dot ally.",
              cost: 1,
            });
            this.merits.backgrounds.advantages.push({
              cost: 1,
              desc: "Each dot of mask strengthens the level of your fake identity. Choose a max of 2 dots. At 2 dots, you may purchase additional related 1 dot merits.",
              name: "Mask",
              maxCost: 2,
            });
            break;
          case "Cleaver":
            this.merits.backgrounds.flaws.push({
              name: "Dark Secret: Cleaver",
              desc: "You are known to routinely violate the masquerade, you likely have been run out of other domains and are not long to last here either.",
              cost: 1,
            });
            this.merits.backgrounds.advantages.push({
              name: "Herd",
              desc: "You have assembled a group of mortals from which you regularly and easily feed. They are also capable of performing menial tasks for you, though not loyally. Your first dot awards 1-3 mortals. Each dot essentially doubles the size of your herd",
              cost: 2,
            });
            break;
          case "Consensualist":
            this.merits.backgrounds.flaws.push({
              name: "Dark Secret: Masquerade Breacher",
              desc: "You are known to routinely violate the masquerade.",
              cost: 1,
            });
            this.merits.merits.flaws.push({
              name: "Prey Exclusion: Non-consenting",
              cost: 1,
              desc: "You refuse to hunt a certain type of prey, be it women, addicts, homeless.",
            });
            this.humanity++;
            break;
          case "Extortionist":
            this.merits.backgrounds.flaws.push({
              name: "Enemy: The Police",
              desc: "A mortal, group or organization who is aware of you and actively working against you. Each point taken increases their fervor and capability. Enemies are rated two dots lower than allies. A 1 dot enemy is equivalent to a 3 dot ally.",
              cost: 2,
            });
            this.advantages = this.advantages + 3;
            this.$q.notify({
              color: "primary",
              textColor: "white",
              avatar: nosImage,
              timeout: 12000,
              message:
                "An additional 3 dots have been provided to be divided amongst Resources and Contacts.",
            });
            break;
          case "Farmer":
            this.merits.merits.flaws.push({
              name: "Feeding Flaw: Farmer",
              cost: 2,
              desc: "You refuse to hunt a certain type of prey, be it women, addicts, homeless.",
            });
            this.humanity++;
            break;
          case "Graverobber":
            this.merits.merits.advantages.push({
              name: "Iron Gullet",
              cost: 3,
              desc: "You can feed from rancid, bagged and processed blood.",
            });
            this.merits.haven.advantages.push({
              name: "Haven",
              desc: "Select between 1-3 dots, each point grows the size, security and privacy of your haven.",
              cost: 1,
              maxCost: 3,
            });
            this.merits.backgrounds.flaws.push({
              name: "Obvious Predator",
              desc: "You exude danger. All humans instinctively mistrust you. Lose two dice from any dice pool from any non-physical skills used for hunting",
              cost: 2,
            });
            break;
          case "Grim Reaper":
            this.humanity++;
            this.merits.merits.flaws.push({
              name: "Feeding Flaw: Healthy Mortals",
              cost: 1,
              desc: "You refuse to hunt a certain type of prey, be it women, addicts, homeless.",
            });
            this.advantages = this.advantages + 1;
            this.$q.notify({
              color: "primary",
              textColor: "white",
              avatar: nosImage,
              timeout: 12000,
              message:
                "An additional dot has been provided to be distributed to either Allies or Influence in the Medical Community.",
            });
            break;
          case "House Cat":
            this.advantages = this.advantages + 2;
            this.$q.notify({
              color: "primary",
              textColor: "white",
              avatar: nosImage,
              timeout: 12000,
              message:
                "An additional 2 dots have been provided to be divided amongst Resources and Haven.",
            });
            this.merits.backgrounds.flaws.push({
              name: "Stalker",
              desc: "A former retainer is obsessed with you, should you deal with one another emerges.",
              cost: 1,
            });
            break;
          case "Montero":
            this.humanity--;
            this.merits.backgrounds.advantages.push({
              name: "Retainer: ",
              desc: "With each dot your retainer grows more capable. 1 dot = weak mortal, 2 dot = average ghoul, 3 dot = gifted ghoul",
              cost: 2,
              maxCost: 5,
            });
            break;
          case "Osiris":
            this.advantages = this.advantages + 3;
            this.flaws = this.flaws + 2;
            this.$q.notify({
              color: "primary",
              textColor: "white",
              avatar: nosImage,
              timeout: 12000,
              message:
                "An additional 3 advantage dots have been provided to be divided amongst Herd and Fame backgrounds.",
            });
            this.$q.notify({
              color: "primary",
              position: "top",
              textColor: "white",
              avatar: nosImage,
              timeout: 12000,
              message:
                "An additional 2 flaw dots have been provided to be divided amongst Enemy and Mythic flaws.",
            });
            break;
          case "Pursuer":
            this.humanity--;
            this.merits.backgrounds.advantages.push({
              name: "Contact: ",
              desc: "Someone who can help you with a specific task, be it a camarilla insider, police dispatcher or shady merchant. Each dot increases their level of usefulness.",
              cost: 1,
              maxCost: 5,
            });
            this.merits.merits.advantages.push({
              cost: 1,
              desc: "You can smell the resonance on your prey without tasting it.",
              name: "Blood Hound",
            });
            break;
          case "Sandman":
            this.merits.backgrounds.advantages.push({
              name: "Resources",
              desc: "Each dot of resources grows your wealth, one dot of resources might equal a minimum wage worker, where five would put you on par with Jeff Bezos.",
              cost: 1,
              maxCost: 5,
            });
            break;
          case "Roadside Killer":
            this.merits.backgrounds.advantages.push({
              name: "Migrating Herd",
              desc: "You have assembled a group of mortals from which you regularly and easily feed. They are also capable of performing menial tasks for you, though not loyally. Your first dot awards 1-3 mortals. Each dot essentially doubles the size of your herd",
              cost: 2,
              maxCost: 5,
            });
            this.merits.merits.flaws.push({
              name: "Prey Exclusion: Locals",
              cost: 1,
              desc: "You refuse to hunt a certain type of prey, be it women, addicts, homeless.",
            });
            break;
          case "Scene Queen":
            this.merits.backgrounds.advantages.push({
              name: "Fame",
              desc: "Each dot of resources grows your wealth, one dot of resources might equal a minimum wage worker, where five would put you on par with Jeff Bezos.",
              cost: 1,
              maxCost: 5,
            });
            this.merits.backgrounds.advantages.push({
              name: "Contacts",
              desc: "Each dot of resources grows your wealth, one dot of resources might equal a minimum wage worker, where five would put you on par with Jeff Bezos.",
              cost: 1,
              maxCost: 5,
            });
            this.merits.backgrounds.flaws.push({
              name: "Influence: Disliked",
              desc: "Each dot of resources grows your wealth, one dot of resources might equal a minimum wage worker, where five would put you on par with Jeff Bezos.",
              cost: 1,
              maxCost: 5,
            });
            break;
          case "Siren":
            this.merits.merits.advantages.push({
              cost: 2,
              desc: "You are considered beautiful.",
              name: "Beautiful",
            });
            this.merits.backgrounds.flaws.push({
              cost: 2,
              desc: "A mortal, group or organization who is aware of you and actively working against you. Each point taken increases their fervor and capability. Enemies are rated two dots lower than allies. A 1 dot enemy is equivalent to a 3 dot ally.",
              name: "Enemy: Spurned Lover",
            });
            break;
          case "Trapdoor":
            this.merits.haven.advantages.push({
              name: "Haven",
              desc: "Select between 1-3 dots, each point grows the size, security and privacy of your haven.",
              cost: 1,
              maxCost: 3,
            });
            this.merits.haven.flaws.push({
              name: "Haven: Creepy/Haunted",
              desc: "Select between either on your sheet.",
              cost: 1,
              maxCost: 3,
            });
            this.advantages = this.advantages + 1;
            this.$q.notify({
              color: "primary",
              textColor: "white",
              avatar: nosImage,
              timeout: 12000,
              message:
                "An additional dot has been granted to distribute into a Retainer or Herd.",
            });
            break;
          case "Typhus":
            this.merits.merits.advantages.push({
              cost: 3,
              desc: "You can feed from rancid, bagged and processed blood.",
              name: "Iron Gullet",
            });
            this.merits.merits.flaws.push({
              name: "Prey Exclusion: Healthy",
              cost: 2,
              desc: "You refuse to hunt a certain type of prey, be it women, addicts, homeless.",
            });
            break;
          default:
        }
      }
      this.finalDisciplineObj = { ...this.finalDisciplineObj, ...trueDiscs };
    },

    donePickingSkills() {
      let allowedLen = 0;
      for (const property in this.finalDisciplineObj) {
        if (isNaN(this.finalDisciplineObj[property])) {
          continue;
        }
        allowedLen += this.finalDisciplineObj[property];
      }
      if (allowedLen > this.skillsSelected.length) {
        this.disciplinesDone = true;
        return true;
      }
      return false;
    },
    sortPredDiscOptions() {
      let arr = [];
      switch (this.predatorType) {
        case "AlleyCat":
          arr = ["Celerity", "Potence"];
          break;
        case "Bagger":
          arr = ["Obfuscate"];
          if (this.clan === "Tremere" || this.clan === "Banu Haqim") {
            arr.push("Blood Sorcery");
          }
          break;
        case "Blood Leech":
          arr = ["Celerity", "Protean"];
          break;
        case "Booth Buffet":
          arr = ["Auspex", "Presence"];
          break;
        case "Catfisher":
          arr = ["Dominate", "Obfuscate"];
          break;
        case "Cleaver":
          arr = ["Dominate", "Animalism"];
          break;
        case "Consensualist":
          arr = ["Auspex", "Fortitude"];
          break;
        case "Extortionist":
          arr = ["Dominate", "Potence"];
          break;
        case "Farmer":
          arr = ["Animalism", "Protean"];
          break;
        case "Graverobber":
          arr = ["Fortitude", "Oblivion"];
          break;
        case "Grim Reaper":
          arr = ["Auspex", "Oblivion"];
          break;
        case "House Cat":
          arr = ["Dominate", "Presence"];
          break;
        case "Montero":
          arr = ["Dominate", "Obfuscate"];
          break;
        case "Osiris":
          arr = ["Presence"];
          if (this.clan === "Tremere") {
            arr.push("Blood Sorcery");
          }
          break;
        case "Pursuer":
          arr = ["Animalism", "Auspex"];
          break;
        case "Sandman":
          arr = ["Auspex", "Obfuscate"];
          break;
        case "Roadside Killer":
          arr = ["Fortitude", "Protean"];
          break;
        case "Scene Queen":
          arr = ["Dominate", "Potence"];
          break;
        case "Siren":
          arr = ["Fortitude", "Presence"];
          break;
        case "Trapdoor":
          arr = ["Protean", "Obfuscate"];
          break;
        case "Typhus":
          arr = ["Auspex", "Fortitude"];
          break;
        default:
          arr = ["Celerity", "Potence"];
      }
      return arr;
    },
    sortPredSpecOptions() {
      let arr = [];
      switch (this.predatorType) {
        case "AlleyCat":
          arr = [
            { skill: "Intimidation", specialty: "Stickups" },
            { skill: "Brawl", specialty: "Grappling" },
          ];
          break;
        case "Bagger":
          arr = [
            { skill: "Larceny", specialty: "Lock Picking" },
            { skill: "Streetwise", specialty: "Black Market" },
          ];
          break;
        case "Blood Leech":
          arr = [
            { skill: "Brawl", specialty: "Kindred" },
            { skill: "Stealth", specialty: "Against Kindred" },
          ];
          break;
        case "Booth Buffet":
          arr = [
            { skill: "Craft", specialty: "Specific Trade" },
            { skill: "Medicine", specialty: "Specific Trade" },
          ];
          break;
        case "Catfisher":
          arr = [
            { skill: "Insight", specialty: "Loneliness" },
            { skill: "Technology", specialty: "Social Media" },
          ];
          break;
        case "Cleaver":
          arr = [
            { skill: "Persuasion", specialty: "Gaslighting" },
            { skill: "Subterfuge", specialty: "Coverups" },
          ];
          break;
        case "Consensualist":
          arr = [
            { skill: "Medicine", specialty: "Phlebotomy" },
            { skill: "Persuasion", specialty: "Victims" },
          ];
          break;
        case "Extortionist":
          arr = [
            { skill: "Intimidation", specialty: "Coercion" },
            { skill: "Larceny", specialty: "Security" },
          ];
          break;
        case "Farmer":
          arr = [
            { skill: "AnimalKen", specialty: "Specific Animal" },
            { skill: "Survival", specialty: "Hunting" },
          ];
          break;
        case "Graverobber":
          arr = [
            { skill: "Occult", specialty: "Grave Rituals" },
            { skill: "Medicine", specialty: "Cadavers" },
          ];
          break;
        case "Grim Reaper":
          arr = [
            { skill: "Awareness", specialty: "Death" },
            { skill: "Larceny", specialty: "Forgery" },
          ];
          break;
        case "House Cat":
          arr = [
            { skill: "Technology", specialty: "Mobile Apps" },
            { skill: "Subterfuge", specialty: "Luring" },
          ];
          break;
        case "Montero":
          arr = [
            { skill: "Leadership", specialty: "Hunting Pack" },
            { skill: "Stealth", specialty: "Stakeout" },
          ];
          break;
        case "Osiris":
          arr = [
            { skill: "Occult", specialty: "Specific Tradition" },
            { skill: "Performance", specialty: "Specific entertainment" },
          ];
          break;
        case "Pursuer":
          arr = [
            { skill: "Investigation", specialty: "Profiling" },
            { skill: "Stealth", specialty: "Shadowing" },
          ];
          break;
        case "Sandman":
          arr = [
            { skill: "Medicine", specialty: "Anesthetics" },
            { skill: "Stealth", specialty: "Break-in" },
          ];
          break;
        case "Roadside Killer":
          arr = [
            { skill: "Survival", specialty: "The Road" },
            { skill: "Investigation", specialty: "Vampire Cant" },
          ];
          break;
        case "Scene Queen":
          arr = [
            { skill: "Etiquette", specialty: "Specific scene" },
            { skill: "Leadership", specialty: "Specific scene" },
            { skill: "Streetwise", specialty: "Specific scene" },
          ];
          break;
        case "Siren":
          arr = [
            { skill: "Persuasion", specialty: "Seduction" },
            { skill: "Subterfuge", specialty: "Seduction" },
          ];
          break;
        case "Trapdoor":
          arr = [
            { skill: "Persuasion", specialty: "Marketing" },
            { skill: "Stealth", specialty: "Ambushes" },
          ];
          break;
        case "Typhus":
          arr = [
            { skill: "Medicine", specialty: "Pharmacy" },
            { skill: "Insight", specialty: "Grief" },
          ];
          break;
        default:
          arr = [
            { skill: "Intimidation", specialty: "Stickups" },
            { skill: "Brawl", specialty: "Grappling" },
          ];
      }
      return arr;
    },
    handleThinMerits() {
      if (this.thinGuard() === true) {
        return;
      }

      switch (this.thinBloodMerits.name) {
        case "Thin-Blood: Anarch Comrades":
          this.clanThinAdvantages++;
          this.merits.merits.advantages.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.merits.backgrounds.advantages.push({
            cost: 1,
            desc: "Someone who can help you with a specific task, be it a camarilla insider, police dispatcher or shady merchant. Each dot increases their level of usefulness.",
            name: "Mawla: Anarchs",
            maxCost: 3,
          });

          this.clearThinFields();
          break;
        case "Thin-Blood: Camarilla Contact":
          this.clanThinAdvantages++;
          this.merits.merits.advantages.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.merits.backgrounds.advantages.push({
            cost: 1,
            desc: "Someone who can help you with a specific task, be it a camarilla insider, police dispatcher or shady merchant. Each dot increases their level of usefulness.",
            name: "Mawla: Camarilla",
            maxCost: 3,
          });

          this.clearThinFields();
          break;
        case "Thin-Blood: Catenating Blood":
          this.clanThinAdvantages++;
          this.merits.merits.advantages.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });

          this.clearThinFields();
          break;
        case "Thin-Blood: Day Drinker":
          this.clanThinAdvantages++;
          this.merits.merits.advantages.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });

          this.clearThinFields();
          break;
        case "Thin-Blood: Discipline Affinity":
          this.clanThinAdvantages++;
          this.merits.merits.advantages.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.finalDisciplineObj[this.thinDisc] = 1;

          this.skillsSelected.push({
            discipline: this.thinDisc,
            skill: this.thinDiscPower,
          });
          this.clearThinFields();
          break;
        case "Thin-Blood: Lifelike":
          this.clanThinAdvantages++;
          this.merits.merits.advantages.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });

          this.clearThinFields();
          break;
        case "Thin-Blood: Abhorrent Blood":
          this.clanThinAdvantages++;
          this.merits.merits.advantages.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.clearThinFields();
          break;
        case "Thin-Blood: Faith-Proof":
          this.clanThinAdvantages++;
          this.merits.merits.advantages.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.clearThinFields();
          break;
        case "Thin-Blood: Lucid Dreamer":
          this.clanThinAdvantages++;
          this.merits.merits.advantages.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.clearThinFields();
          break;
        case "Thin-Blood: Mortality's Mien":
          this.clanThinAdvantages++;
          this.merits.merits.advantages.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.clearThinFields();
          break;
        case "Thin-Blood: Swift Feeder":
          this.clanThinAdvantages++;
          this.merits.merits.advantages.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.clearThinFields();
          break;
        case "Thin-Blood: Low Appetite":
          this.clanThinAdvantages++;
          this.merits.merits.advantages.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.clearThinFields();
          break;
        case "Thin-Blood: Vampiric Resilience":
          this.clanThinAdvantages++;
          this.merits.merits.advantages.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });

          this.clearThinFields();
          break;
        case "Thin-Blood: Thin-blood Alchemist":
          this.clanThinAdvantages++;
          this.finalDisciplineObj[this.alchemyDiscipline]++;
          this.merits.merits.advantages.push({
            cost: 1,
            desc: "Gain a dot in Thin-blood alchemy and an additional recipe as discussed with your ST.",
            name: "Thin-Blood: Thin-blood Alchemist",
          });
          this.skillsSelected.push({
            discipline: this.alchemyDiscipline,
            skill: this.formula,
          });
          this.clearThinFields();
          break;
        //Flaws below
        case "Thin-Blood: Baby Teeth":
          this.clanThinFlaws++;
          this.merits.merits.flaws.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });

          this.clearThinFields();
          break;
        case "Thin-Blood: Heliophobia":
          this.clanThinFlaws++;
          this.merits.merits.flaws.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.clearThinFields();
          break;
        case "Thin-Blood: Night Terrors":
          this.clanThinFlaws++;
          this.merits.merits.flaws.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.clearThinFields();
          break;
        case "Thin-Blood: Plague Bearer":
          this.clanThinFlaws++;
          this.merits.merits.flaws.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.clearThinFields();
          break;
        case "Thin-Blood: Sloppy Drinker":
          this.clanThinFlaws++;
          this.merits.merits.flaws.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.clearThinFields();
          break;
        case "Thin-Blood: Sun-Faded":
          this.clanThinFlaws++;
          this.merits.merits.flaws.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.clearThinFields();
          break;
        case "Thin-Blood: Supernatural Tell":
          this.clanThinFlaws++;
          this.merits.merits.flaws.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.clearThinFields();
          break;
        case "Thin-Blood: Twilight Presence":
          this.clanThinFlaws++;
          this.merits.merits.flaws.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.clearThinFields();
          break;
        case "Thin-Blood: Unending Hunger":
          this.clanThinFlaws++;
          this.merits.merits.flaws.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });
          this.clearThinFields();
          break;
        case "Thin-Blood: Bestial Temper":
          this.clanThinFlaws++;
          this.merits.merits.flaws.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });

          this.clearThinFields();
          break;
        case "Thin-Blood: Branded by the Camarilla":
          this.clanThinFlaws++;
          this.merits.merits.flaws.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });

          this.clearThinFields();
          break;
        case "Thin-Blood: Clan Curse":
          this.clanThinFlaws++;
          this.merits.merits.flaws.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name + " (" + this.thinBane + ")",
          });

          this.clearThinFields();
          break;
        case "Thin-Blood: Mortal Frailty":
          this.clanThinFlaws++;
          this.merits.merits.flaws.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });

          this.clearThinFields();
          break;
        case "Thin-Blood: Dead Flesh":
          this.clanThinFlaws++;
          this.merits.merits.flaws.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });

          this.clearThinFields();
          break;
        case "Thin-Blood: Shunned by the Anarchs":
          this.clanThinFlaws++;
          this.merits.merits.flaws.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });

          this.clearThinFields();
          break;
        case "Thin-Blood: Vitae Dependency":
          this.clanThinFlaws++;
          this.merits.merits.flaws.push({
            cost: 1,
            desc: this.thinBloodMerits.desc,
            name: this.thinBloodMerits.name,
          });

          this.clearThinFields();
          break;
      }
    },
    clearThinFields() {
      this.advantagesOrFlaws = "";
      this.thinBloodMerits = "";
      this.alchemyDiscipline = "";
      this.formula = "";
      this.thinDisc = "";
      this.thinDiscPower = "";
      this.thinBane = "";
    },
    thinGuard() {
      if (
        this.clanThinAdvantages === 3 &&
        this.advantagesOrFlaws === "Advantages"
      ) {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: "You may only take 3 Thin-Blood Merits ",
        });
        return true;
      }
      if (this.clanThinFlaws === 3 && this.advantagesOrFlaws === "Flaws") {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: "You may only take 3 Thin-Blood Flaws",
        });
        return true;
      }
      if (
        this.merits.merits.advantages.filter(
          (e) => e.name === this.thinBloodMerits.name
        ).length > 0 ||
        this.merits.merits.flaws.filter(
          (e) => e.name === this.thinBloodMerits.name
        ).length > 0
      ) {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: "You have already selected this merit!",
        });
        return true;
      }
      return false;
    },
    removeThinAdvantage(event, name) {
      this.merits.merits.advantages.splice(event, 1);

      switch (name) {
        case "Thin-Blood: Anarch Comrades":
          this.merits.backgrounds.advantages =
            this.merits.backgrounds.advantages.filter(
              (e) => e.name !== "Mawla: Anarchs"
            );
          break;
        case "Thin-Blood: Camarilla Contact":
          this.merits.backgrounds.advantages =
            this.merits.backgrounds.advantages.filter(
              (e) => e.name !== "Mawla: Camarilla"
            );
          break;
        case "Thin-Blood: Discipline Affinity":
          let keys = Object.keys(this.finalDisciplineObj);

          keys.forEach((x) => {
            if (
              x !== "Athanor Corporis" &&
              x !== "Calcinatio" &&
              x !== "Fixatio"
            ) {
              this.skillsSelected = this.skillsSelected.filter(
                (e) => e.discipline !== x
              );
              delete this.finalDisciplineObj[x];
            }
          });

          break;
        case "Thin-Blood: Thin-blood Alchemist":
          this.finalDisciplineObj["Athanor Corporis"] = 0;
          this.finalDisciplineObj["Calcinatio"] = 0;
          this.finalDisciplineObj["Fixatio"] = 0;
          this.skillsSelected = this.skillsSelected.filter(
            (e) =>
              e.discipline !== "Athanor Corporis" &&
              e.discipline !== "Calcinatio" &&
              e.discipline !== "Fixatio"
          );

          break;
      }

      this.clanThinAdvantages--;
    },
    removeThinFlaw(event, name) {
      this.merits.merits.flaws.splice(event, 1);

      this.clanThinFlaws--;
    },
  },
  computed: {
    allThinBloodOptions() {
      //fix this its beyond horrible
      let arr = [];
      let haveIt;
      if (this.advantagesOrFlaws === "Advantages") {
        arr = this.meritJSON.Merits["Thin-blood"].advantages;

        haveIt = this.merits.merits.flaws.find(
          (o) => o.name === "Thin-Blood: Dead Flesh"
        );
        if (typeof haveIt !== "undefined") {
          arr = arr.filter((x) => x.name !== "Thin-Blood: Lifelike");
        }
        haveIt = this.merits.merits.flaws.find(
          (o) => o.name === "Thin-Blood: Mortal Frailty"
        );
        if (typeof haveIt !== "undefined") {
          arr = arr.filter((x) => x.name !== "Thin-Blood: Vampiric Resilience");
        }
        haveIt = this.merits.merits.flaws.find(
          (o) => o.name === "Thin-Blood: Shunned by the Anarchs"
        );
        if (typeof haveIt !== "undefined") {
          arr = arr.filter((x) => x.name !== "Thin-Blood: Anarch Comrades");
        }
      } else {
        arr = this.meritJSON.Merits["Thin-blood"].flaws;

        haveIt = this.merits.merits.advantages.find(
          (o) => o.name === "Thin-Blood: Lifelike"
        );
        if (typeof haveIt !== "undefined") {
          arr = arr.filter((x) => x.name !== "Thin-Blood: Dead Flesh");
        }
        haveIt = this.merits.merits.advantages.find(
          (o) => o.name === "Thin-Blood: Vampiric Resilience"
        );
        if (typeof haveIt !== "undefined") {
          arr = arr.filter((x) => x.name !== "Thin-Blood: Mortal Frailty");
        }
        haveIt = this.merits.merits.advantages.find(
          (o) => o.name === "Thin-Blood: Anarch Comrades"
        );
        if (typeof haveIt !== "undefined") {
          arr = arr.filter(
            (x) => x.name !== "Thin-Blood: Shunned by the Anarchs"
          );
        }
      }

      return arr;
    },

    caitiffThirdOptions() {
      let arr = Object.keys(this.disciplineSkills.Disciplines);

      Object.keys(this.disciplineObj).forEach((discipline) => {
        if (this.disciplineObj[discipline] < 1) {
          delete this.disciplineObj[discipline];
        }
      });

      arr = arr.filter(
        (x) =>
          x !== "Athanor Corporis" &&
          x !== "Fixatio" &&
          x !== "Calcinatio" &&
          x !== "Thin-blood Alchemy" &&
          !Object.keys(this.disciplineObj).includes(x)
      );

      return arr;
    },

    formulaOptions() {
      let arr = [];
      arr = this.disciplineSkills.Disciplines["Thin-blood Alchemy"].skills[0];
      return arr;
    },
    filteredAgeOptions() {
      let arr = this.ageOptions;
      if (this.clan === "Thin-Blood") {
        arr = arr.filter(
          (x) => x.label !== "Neonate" && x.label !== "Ancillae"
        );
      }

      return arr;
    },

    filteredGenerationOptions() {
      let arr = this.generationOptions;
      if (this.clan === "Thin-Blood") {
        arr = arr.filter(
          (x) => x.label === "14th" || x.label === "15th" || x.label === "16th"
        );
      } else {
        arr = arr.filter(
          (x) => x.label !== "14th" && x.label !== "15th" && x.label !== "16th"
        );
      }

      return arr;
    },
    filteredDiscOptions() {
      let arr = Object.keys(this.disciplineSkills.Disciplines);
      if (this.clan === "Thin-Blood") {
        arr = arr.filter(
          (x) =>
            x !== "Athanor Corporis" &&
            x !== "Fixatio" &&
            x !== "Calcinatio" &&
            x !== "Thin-blood Alchemy"
        );
      }

      return arr;
    },

    thinMeritsOnly() {
      let arr = this.merits.merits.advantages;

      arr = arr.filter((x) => x.name.includes("Thin-Blood"));

      return arr;
    },

    thinFlawsOnly() {
      let arr = this.merits.merits.flaws;

      arr = arr.filter((x) => x.name.includes("Thin-Blood"));

      return arr;
    },
    thinClanBanes() {
      let haveIt;
      let arr = [
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
      ];

      haveIt = this.merits.merits.flaws.find(
        (o) => o.name === "Thin-Blood: Bestial Temper"
      );
      if (typeof haveIt === "undefined") {
        arr = arr.filter((x) => x !== "Brujah" && x !== "Gangrel");
      }

      haveIt = this.merits.merits.advantages.find(
        (o) => o.name === "Thin-Blood: Catenating Blood"
      );
      if (typeof haveIt === "undefined") {
        arr = arr.filter((x) => x !== "Tremere");
      }

      return arr;
    },
  },
});
</script>
