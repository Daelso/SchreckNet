<template>
  <div class="q-pa-md row justify-center text-center">
    <q-card class="bg-primary">
      <q-tabs
        v-model="tab"
        class="bg-primary tabs"
        active-color="white"
        indicator-color="secondary"
        align="justify"
        narrow-indicator
        mobile-arrows
      >
        <q-tab style="color: white" name="coreConcept" label="Core Concept" />
        <q-tab
          style="color: white"
          name="touchstones"
          label="Touchstones/Convictions"
        />
        <q-tab
          :disable="sortSkills().length < 1 && this.debug !== true"
          name="specialties"
          label="Specialties"
          style="color: white"
          id="specTab"
        >
          <q-tooltip
            v-if="sortSkills().length < 1 && this.debug !== true"
            class="bg-dark text-body2"
            >Must have any skill over 1 to set specialties.</q-tooltip
          >
        </q-tab>
        <q-tab
          :disable="!this.discDone && this.debug !== true"
          style="color: white"
          name="advantages"
          label="Advantages & Flaws"
          id="advantageTab"
        >
          <q-tooltip
            v-if="!this.discDone && this.debug !== true"
            class="bg-dark text-body2"
            >Please set your clan and disciplines first.</q-tooltip
          >
        </q-tab>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated class="bg-primary">
        <q-tab-panel name="coreConcept" class="q-m-b-xl">
          <q-input
            filled
            class="select"
            bg-color="grey-3"
            v-model="tabCharName"
            label="Your character's name *"
            lazy-rules
            label-color="primary"
            @update:model-value="$emit('update:charName', this.tabCharName)"
            :rules="[
              (val) =>
                (typeof val === 'string' &&
                  val.length > 3 &&
                  val.length <= 128) ||
                'Please enter a valid name, between 3-128 characters',
            ]"
          />
          <q-input
            filled
            bg-color="grey-3"
            class="select"
            v-model="tabConcept"
            label="Character Concept *"
            autogrow
            hint="Who or what is this kindred?"
            hide-hint
            lazy-rules
            label-color="primary"
            @update:model-value="$emit('update:concept', this.tabConcept)"
            :rules="[
              (val) =>
                (typeof val === 'string' &&
                  val.length <= 164 &&
                  val.length >= 1) ||
                'Please keep this field between 1 and 164 characters',
            ]"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="tabAmbition"
            class="select"
            label="Ambition *"
            hint="Long term goals"
            hide-hint
            autogrow
            lazy-rules
            label-color="primary"
            @update:model-value="$emit('update:ambition', this.tabAmbition)"
            :rules="[
              (val) =>
                (typeof val === 'string' &&
                  val.length <= 128 &&
                  val.length >= 3) ||
                'Please keep this field between 3 and 128 characters',
            ]"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="tabDesire"
            class="select"
            label="Desire *"
            hint="Specific, short-term goal"
            hide-hint
            autogrow
            label-color="primary"
            lazy-rules
            @update:model-value="$emit('update:desire', this.tabDesire)"
            :rules="[
              (val) =>
                (typeof val === 'string' &&
                  val.length <= 128 &&
                  val.length >= 3) ||
                'Please keep this field between 3 and 128 characters',
            ]"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="tabArchetype"
            label="Archetype *"
            hint="Regain willpower when you fulfill your purpose. Examples: Judge, Guru, Gambler, Masochist "
            hide-hint
            autogrow
            class="select"
            label-color="primary"
            lazy-rules
            @update:model-value="
              this.$emit('update:archetype', this.tabArchetype)
            "
            :rules="[
              (val) =>
                (typeof val === 'string' &&
                  val.length <= 128 &&
                  val.length >= 3) ||
                'Please keep this field between 3 and 128 characters',
            ]"
          />
          <q-select
            v-model="tabSect"
            :options="sectOptions"
            label="Sect"
            label-color="primary"
            bg-color="grey-3"
            filled
            color="secondary"
            @update:model-value="this.$emit('update:sect', this.tabSect)"
            popup-content-style="background-color:#222831; color:white"
          />
          <q-select
            v-model="cultInput"
            :options="[
              'None',
              'Ashfinders',
              'Bahari',
              'Church of Caine',
              'Church of Set',
              'Cult of Shalim',
              'Mithraic Mysteries',
              'Nephilim',
            ]"
            label="Cult"
            class="q-mt-md"
            label-color="primary"
            color="secondary"
            bg-color="grey-3"
            filled
            @update:model-value="this.$emit('update:cult', this.cultInput)"
            popup-content-style="background-color:#222831; color:white"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="tabChronicle"
            label="Chronicle *"
            class="select q-mt-md"
            label-color="primary"
            lazy-rules
            @update:model-value="
              this.$emit('update:chronicle', this.tabChronicle)
            "
            :rules="[
              (val) =>
                (typeof val === 'string' &&
                  val.length <= 128 &&
                  val.length >= 3) ||
                'Please keep this field between 3 and 128 characters',
            ]"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="sireInput"
            label="Your sire's name, if you know"
            autogrow
            lazy-rules
            label-color="primary"
            @update:model-value="this.$emit('update:sire', this.sireInput)"
            :rules="[
              (val) =>
                val.length <= 128 ||
                'Please keep this field below 128 characters',
            ]"
          />
          <q-input
            filled
            type="text"
            bg-color="grey-3"
            v-model="localImgLink"
            label="Image Link of Your Character"
            placeholder="Paste a direct image link (e.g. i.imgur...)"
            lazy-rules
            label-color="primary"
            debounce="2000"
            @update:model-value="
              () => {
                isValidImageUrl(localImgLink);
                this.$emit('update:imgLink', this.localImgLink);
              }
            "
            hint="Please use a direct imgur link."
          />
        </q-tab-panel>

        <q-tab-panel name="touchstones">
          <div class="q-mb-sm">
            Must have 1-3 convictions and as many touchstones as convictions.
          </div>
          <div class="q-mb-sm" style="color: white">
            Convictions and touchstones are
            <span
              v-if="this.tabConvictions.length != this.tabTouchstones.length"
              >NOT</span
            >
            equal.
          </div>
          <q-input
            filled
            bg-color="grey-3"
            v-model="convictionInput"
            label="Convictions *"
            hint="Human values your coterie attempts to uphold even after death. Must have 1-3. (Press enter to confirm)"
            hide-hint
            autogrow
            class="select"
            label-color="primary"
            lazy-rules
            v-on:keydown.enter.prevent="
              () => {
                if (!this.convictionInput) {
                  return;
                }
                if (this.convictions.length === 3) {
                  this.convicWarning();
                  return;
                }
                this.tabConvictions.push(this.convictionInput);
                this.convictionInput = '';
              }
            "
            :rules="[
              (val) =>
                (typeof val === 'string' && val.length <= 2000) ||
                'Please keep this field under 2000 characters',
            ]"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="touchStoneInput"
            label="Touchstone *"
            hint="A specific human who embodies one of your convictions. You must have a touchstone for each conviction."
            hide-hint
            autogrow
            class="select"
            label-color="primary"
            lazy-rules
            v-on:keydown.enter.prevent="
              () => {
                if (!this.touchStoneInput) {
                  return;
                }
                this.tabTouchstones.push(this.touchStoneInput);
                this.touchStoneInput = '';
              }
            "
            :rules="[
              (val) =>
                (typeof val === 'string' && val.length <= 2000) ||
                'Please keep this field under 2000 characters',
            ]"
          />
          <q-separator />
          <div class="text-h6" style="font-family: monospace">Convictions</div>

          <q-list bordered separator>
            <q-item
              v-for="(conviction, key) in tabConvictions"
              :key="key"
              clickable
              v-ripple
              @click="removeConviction($event.target.id)"
            >
              <q-item-section :id="key"
                >{{ conviction }}
                <q-tooltip class="bg-dark text-body2"
                  >Click to delete</q-tooltip
                >
              </q-item-section>
            </q-item>
          </q-list>

          <q-separator />
          <div class="text-h6" style="font-family: monospace">Touchstones</div>
          <q-list bordered separator>
            <q-item
              v-for="(touchstone, key) in tabTouchstones"
              :key="key"
              clickable
              v-ripple
              @click="removeTouchstone($event.target.id)"
            >
              <q-item-section :id="key"
                >{{ touchstone }}
                <q-tooltip class="bg-dark text-body2"
                  >Click to delete</q-tooltip
                ></q-item-section
              >
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="specialties">
          <div class="q-mb-sm">
            Specialties remaining: {{ specialtiePoints }}
          </div>
          <q-select
            v-model="skillSelect"
            :options="sortSkills()"
            label="Which skill *"
            class="select q-mb-md"
            label-color="primary"
            bg-color="grey-3"
            filled
            popup-content-style="background-color:#222831; color:white"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="specialtyInput"
            label="Specialty *"
            color="secondary"
            hint="Write your specialty (Press enter to confirm)"
            hide-hint
            autogrow
            class="select"
            label-color="primary"
            lazy-rules
            v-on:keydown.enter.prevent="
              () => {
                if (this.specialtyInput) {
                  this.addSpecialty();
                  this.$emit('update:specialties', this.tabSpecialties);
                }
              }
            "
            :rules="[
              (val) =>
                (val && val.length > 1 && val.length <= 100) ||
                'Please stay between 1-100 characters',
              (val) =>
                (val && this.skillSelect.length > 0) ||
                'Please select which skill this specialty is for first!',
            ]"
          />
          <q-separator />
          <div class="text-h6" style="font-family: monospace">Specialties</div>

          <q-list bordered separator>
            <q-item
              v-for="(specialty, key) in specialties"
              :key="key"
              clickable
              v-ripple
              @click="removeSpecialty($event.target.id)"
            >
              <q-item-section :id="key"
                >Skill:
                {{
                  specialty.skill[0].toUpperCase() + specialty.skill.slice(1)
                }}
                - {{ specialty.specialty }}
                <q-tooltip class="bg-dark text-body2"
                  >Click to delete</q-tooltip
                >
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator />
          <div v-if="!this.edit" class="text-h6" style="font-family: monospace">
            Specialties from Predator Type
          </div>

          <q-list bordered separator>
            <q-item v-for="(specialty, key) in specialtiesFromPred" :key="key">
              <q-item-section :id="key"
                >Skill:
                {{
                  specialty.skill[0].toUpperCase() + specialty.skill.slice(1)
                }}
                - {{ specialty.specialty }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="advantages" class="q-m-b-xl" style="color: white">
          <div>
            These are not mandatory to be filled out now and can be withheld for
            later use.
          </div>
          <div class="q-my-sm">
            Remaining dots of advantages: {{ advantagePoints }}
          </div>
          <div class="q-my-sm">Remaining dots of flaws: {{ flawPoints }}</div>
          <div
            v-if="this.advantageCategory == 'Loresheets'"
            class="q-my-sm"
            style="color: red; font-weight: bold"
          >
            Loresheets are too varied and too numerous to handle automatically,
            the sheet will track the dots you take, but please assign any
            additional bonuses on your sheet manually after.
          </div>

          <q-separator />

          <q-select
            v-model="advantageCategory"
            :options="advantageCategories"
            label="Select merits, backgrounds, and loresheets"
            label-color="primary"
            bg-color="grey-3"
            color="secondary"
            filled
            popup-content-style="background-color:#222831; color:white"
            @update:model-value="changeAdvCat()"
          />
          <q-separator />
          <div
            v-if="
              this.advantageCategory === 'Merits' ||
              this.advantageCategory == 'Cult' ||
              this.advantageCategory == 'Backgrounds' ||
              this.advantageCategory == 'Haven' ||
              this.advantageCategory == 'Loresheets'
            "
          >
            <q-select
              v-model="meritCategory"
              :options="filteredOptions"
              class="q-my-sm"
              :label="this.advantageCategory + ' Category'"
              label-color="primary"
              bg-color="grey-3"
              filled
              color="secondary"
              @filter="filterFn"
              use-input
              popup-content-style="background-color:#222831; color:white"
              input-debounce="0"
              @update:model-value="changeMeritCat()"
            />
          </div>
          <q-separator />
          <div
            v-if="this.meritCategory && this.advantageCategory !== 'Loresheets'"
          >
            <q-select
              v-model="advOrFlaw"
              :options="advorFlawOptions()"
              label="Select advantages or flaws"
              label-color="primary"
              class="q-mb-sm"
              color="secondary"
              bg-color="grey-3"
              filled
              popup-content-style="background-color:#222831; color:white"
            />
          </div>
          <q-separator />
          <div v-if="this.advOrFlaw">
            <q-select
              v-model="advFlawChoice"
              :options="meritOptions()"
              label="Choose your merit"
              label-color="primary"
              bg-color="grey-3"
              color="secondary"
              filled
              option-label="name"
              @update:model-value="clearDotField()"
              popup-content-style="background-color:#222831; color:white"
            />
          </div>
          <div
            v-if="
              this.advFlawChoice.maxCost ||
              (this.advantageCategory === 'Loresheets' && this.meritCategory)
            "
          >
            <q-select
              v-model="howManyDots"
              :options="dotOptions()"
              label="Choose how many dots"
              label-color="primary"
              bg-color="grey-3"
              class="q-mt-sm"
              color="secondary"
              filled
              @update:model-value="costAdjustment()"
              popup-content-style="background-color:#222831; color:white"
            />
          </div>

          <div
            v-if="
              this.advFlawChoice.specNeeded === true && this.howManyDots >= 1
            "
          >
            <q-input
              autogrow
              hint="Briefly elaborate on what this merit is"
              hide-hint
              v-model="specificationInput"
              label="Specify this merit"
              label-color="primary"
              bg-color="grey-3"
              v-on:keydown.enter.prevent="
                () => {
                  this.meritPicked();
                }
              "
              class="q-mt-sm"
              filled
              lazy-rules
              :rules="[
                (val) =>
                  (typeof val === 'string' &&
                    val.length > 3 &&
                    val.length <= 50) ||
                  'Please enter a brief description between 3-50 characters.',
              ]"
            />
          </div>
          <div
            v-if="this.advantageCategory === 'Loresheets' && this.meritCategory"
          >
            Description:
            {{
              this.loresheets.loresheets.find(
                (x) => x.Name === this.meritCategory
              ).Description
            }}
            <br />
            <div v-if="this.howManyDots">
              Dot Cost: {{ this.advFlawChoice.cost }} <br />
            </div>
          </div>
          <div
            v-if="this.advFlawChoice && this.advantageCategory !== 'Loresheets'"
          >
            Description: {{ this.advFlawChoice.desc }}
            <br />
            Dot Cost: {{ this.advFlawChoice.cost }} <br />
          </div>
          <div
            class="q-mt-sm"
            v-if="
              (this.advFlawChoice && !this.advFlawChoice.maxCost) ||
              (this.howManyDots && !this.advFlawChoice.specNeeded) ||
              (this.howManyDots &&
                this.advFlawChoice.specNeeded === true &&
                this.specificationInput.length >= 3)
            "
          >
            <q-btn
              flat
              label="Select Merit"
              @click="meritPicked()"
              color="white"
            />
          </div>

          <div
            v-if="
              this.advantagesObj.merits.advantages.length > 0 ||
              this.advantagesObj.merits.flaws.length > 0
            "
          >
            <!-- Merits -->
            <span class="text-h6">Merits</span>
            <q-separator />
            <div class="q-my-sm" style="font-family: monospace">Advantages</div>

            <q-list bordered separator>
              <q-item
                v-for="(advantage, key) in advantagesObj.merits.advantages"
                :key="key"
                clickable
                v-ripple
                @click="
                  removeAdvantage(
                    $event.target.id,
                    advantage.cost,
                    advantage.name,
                    'merits'
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

            <div class="q-my-sm" style="font-family: monospace">Flaws</div>

            <q-list bordered separator>
              <q-item
                v-for="(flaw, key) in advantagesObj.merits.flaws"
                :key="key"
                clickable
                v-ripple
                @click="
                  removeFlaw($event.target.id, flaw.cost, flaw.name, 'merits')
                "
              >
                <q-item-section :id="key">
                  {{ flaw.name }}
                  - {{ flaw.cost }} dots
                  <q-tooltip class="bg-dark text-body2"
                    >Click to delete</q-tooltip
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <br />
          <!-- Backgrounds -->
          <div
            v-if="
              this.advantagesObj.backgrounds.advantages.length > 0 ||
              this.advantagesObj.backgrounds.flaws.length > 0
            "
          >
            <span class="text-h6">Backgrounds</span>
            <q-separator />
            <div class="q-my-sm" style="font-family: monospace">Advantages</div>

            <q-list bordered>
              <q-item
                v-for="(advantage, key) in advantagesObj.backgrounds.advantages"
                :key="key"
                clickable
                v-ripple
                @click="
                  removeAdvantage(
                    $event.target.id,
                    advantage.cost,
                    advantage.name,
                    'backgrounds'
                  )
                "
              >
                <q-item-section :id="key"
                  >Advantage:
                  {{ advantage.name }}
                  - {{ advantage.cost }} dots
                  <q-tooltip class="bg-dark text-body2"
                    >Click to delete</q-tooltip
                  >
                </q-item-section>
              </q-item>
            </q-list>

            <div class="q-my-sm" style="font-family: monospace">Flaws</div>

            <q-list bordered>
              <q-item
                v-for="(flaw, key) in advantagesObj.backgrounds.flaws"
                :key="key"
                clickable
                v-ripple
                @click="
                  removeFlaw(
                    $event.target.id,
                    flaw.cost,
                    flaw.name,
                    'backgrounds'
                  )
                "
              >
                <q-item-section :id="key">
                  {{ flaw.name }}
                  - {{ flaw.cost }} dots
                  <q-tooltip class="bg-dark text-body2"
                    >Click to delete</q-tooltip
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <br />
          <!-- Loresheets -->
          <div
            v-if="
              this.advantagesObj.loresheets.advantages.length > 0 ||
              this.advantagesObj.loresheets.flaws.length > 0
            "
          >
            <span class="text-h6">Loresheets</span>
            <q-separator />
            <div class="q-my-sm" style="font-family: monospace">Advantages</div>

            <q-list bordered>
              <q-item
                v-for="(advantage, key) in advantagesObj.loresheets.advantages"
                :key="key"
                clickable
                v-ripple
                @click="
                  removeAdvantage(
                    $event.target.id,
                    advantage.cost,
                    advantage.name,
                    'loresheets'
                  )
                "
              >
                <q-item-section :id="key"
                  >Advantage:
                  {{ advantage.name }}
                  - {{ advantage.cost }} dots
                  <q-tooltip class="bg-dark text-body2"
                    >Click to delete</q-tooltip
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <br />
          <!-- Haven -->
          <div
            v-if="
              this.advantagesObj.haven.advantages.length > 0 ||
              this.advantagesObj.haven.flaws.length > 0
            "
          >
            <span class="text-h6">Haven</span>
            <q-separator />
            <div class="q-my-sm" style="font-family: monospace">Advantages</div>

            <q-list bordered>
              <q-item
                v-for="(advantage, key) in advantagesObj.haven.advantages"
                :key="key"
                clickable
                v-ripple
                @click="
                  removeAdvantage(
                    $event.target.id,
                    advantage.cost,
                    advantage.name,
                    'haven'
                  )
                "
              >
                <q-item-section :id="key"
                  >Advantage:
                  {{ advantage.name }}
                  - {{ advantage.cost }} dots
                  <q-tooltip class="bg-dark text-body2"
                    >Click to delete</q-tooltip
                  >
                </q-item-section>
              </q-item>
            </q-list>

            <div class="q-my-sm" style="font-family: monospace">Flaws</div>

            <q-list bordered>
              <q-item
                v-for="(flaw, key) in advantagesObj.haven.flaws"
                :key="key"
                clickable
                v-ripple
                @click="
                  removeFlaw($event.target.id, flaw.cost, flaw.name, 'haven')
                "
              >
                <q-item-section :id="key">
                  {{ flaw.name }}
                  - {{ flaw.cost }} dots
                  <q-tooltip class="bg-dark text-body2"
                    >Click to delete</q-tooltip
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<style>
.select {
  width: 800px;
}
.q-field__counter {
  color: white;
}
.q-field__bottom {
  color: white;
  margin-bottom: 3px;
}
@media only screen and (max-width: 600px) {
  .select {
    width: 300px;
  }
  .tabs {
    width: 300px;
  }
}
</style>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";
import allMerits from "../vtm/5eMerits.json";
import allCultMerits from "../vtm/5eCultMerits.json";
import allBackgrounds from "../vtm/5eBackgrounds.json";
import disciplinesList from "../vtm/5eDisciplines.json";
import havenMerits from "../vtm/havens.json";
import loresheets from "../vtm/loresheets.json";
import nosImage from "../../../assets/images/Nosfer_logo.png";

export default defineComponent({
  name: "v5-tabs",
  props: [
    "specialtiePoints",
    "specialties",
    "fullSkills",
    "specialtiesFromPred",
    "advantagePoints",
    "flawPoints",
    "sire",
    "age",
    "advantagesObj",
    "clan",
    "cult",
    "disciplines",
    "clanBane",
    "discDone",
    "debug",
    "thinAdvantages",
    "thinFlaws",
    "disciplineSkills",
    "xp",
    "charName",
    "concept",
    "ambition",
    "desire",
    "convictions",
    "touchstones",
    "archetype",
    "sect",
    "chronicle",
    "edit",
    "altAncilla",
    "imgLink",
  ],
  emits: [
    "update:specialtiePoints",
    "update:advantagePoints",
    "update:flawPoints",
    "update:sire",
    "update:disciplines",
    "update:advantagesObj",
    "update:clanBane",
    "update:cult",
    "update:thinAdvantages",
    "update:thinFlaws",
    "update:disciplineSkills",
    "update:xp",
    "update:specialties",
    "update:convictions",
    "update:touchstones",
    "update:charName",
    "update:concept",
    "update:ambition",
    "update:desire",
    "update:archetype",
    "update:sect",
    "update:chronicle",
    "update:imgLink",
  ],

  setup(props) {
    function range(size, startAt = 0) {
      return [...Array(size).keys()].map((i) => i + startAt);
    }

    return {
      range,
      tab: ref("coreConcept"),
    };
  },
  data(props) {
    return {
      advantagesArr: [],
      tabAltAncilla: props.altAncilla,
      allMerits: allMerits.Merits,
      allCultMerits: allCultMerits.Cults,
      allBackgrounds: allBackgrounds.Backgrounds,
      advOrFlaw: "",
      tabCharName: props.charName,
      advFlawChoice: "",
      howManyDots: "",
      specificationInput: "",
      advantageCategory: "",
      tabAmbition: props.ambition,
      tabArchetype: props.archetype,
      thinClanBane: "",
      filteredOptions: [],
      cultInput: this.cult,
      convictionInput: "",
      touchStoneInput: "",
      nosImage,
      tabConvictions: props.convictions,
      tabTouchstones: props.touchstones,
      disciplinesList,
      thinBonusDiscInput: "",
      tabChronicle: props.chronicle,
      havenMerits,
      tabDesire: props.desire,
      tabConcept: props.concept,
      meritCategory: "",
      cultCategory: "",
      tabSect: props.sect,
      localImgLink: props.imgLink,
      sectOptions: [
        "Anarch",
        "Camarilla",
        "Independent",
        "Sabbat",
        "Clanless",
        "Autarkis",
      ],
      advantageCategories: [
        "Merits",
        "Backgrounds",
        "Haven",
        "Cult",
        "Loresheets",
      ],
      specialtyInput: "",
      skillSelect: "",
      tabSpecialties: props.specialties,
      sireInput: props.sire,
      thinFlawsTabs: props.thinFlaws,
      thinAdvantagesTabs: props.thinAdvantages,
      loresheets,
    };
  },
  methods: {
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.filteredOptions = this.meritCatOptions();
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();

        this.filteredOptions = this.meritCatOptions().filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    isValidImageUrl(url) {
      try {
        const parsed = new URL(url);
        const allowedHosts = ["i.imgur.com", "imgur.com"];
        const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

        const test =
          ["https:"].includes(parsed.protocol) &&
          allowedHosts.some((host) => parsed.hostname.endsWith(host)) &&
          allowedExtensions.some((ext) =>
            parsed.pathname.toLowerCase().endsWith(ext)
          );
      } catch (err) {
        console.log(err);
        this.localImgLink = "";
        this.$q.notify({
          color: "primary",
          avatar: nosImage,
          textColor: "white",
          message: `Please use a direct image link from an approved host`,
        });
      }
    },
    removeConviction(event) {
      this.tabConvictions.splice(event, 1);
    },
    removeTouchstone(event) {
      this.tabTouchstones.splice(event, 1);
    },
    removeSpecialty(event) {
      this.tabSpecialties.splice(event, 1);
      this.handlePoints(false);
    },
    removeAdvantage(event, cost, name, category) {
      if (name.includes("Thin-Blood")) {
        this.removeThinAdvantage(event, name);
        return;
      }
      let modifiedObj = { ...{}, ...this.advantagesObj };
      modifiedObj[category].advantages.splice(event, 1);
      this.$emit("update:advantagesObj", { ...{}, ...modifiedObj });
      this.$emit("update:advantagePoints", this.advantagePoints + cost);
    },
    removeFlaw(event, cost, name, category) {
      if (name.includes("Thin-Blood")) {
        this.removeThinFlaw(event, name);
        return;
      }
      if (name === "Haven: Decaying") {
        if (this.xp >= cost * 3) {
          this.$q.notify({
            color: "primary",
            avatar: nosImage,
            textColor: "white",
            message: `${cost * 3} xp spent to remove this Bane flaw.`,
          });
          this.$emit("update:xp", this.xp - cost * 3);
        } else {
          this.$q.notify({
            type: "negative",
            textColor: "white",
            message: "Not enough xp to remove this bane flaw.",
          });
          return;
        }
      }
      let modifiedObj = { ...{}, ...this.advantagesObj };
      modifiedObj[category].flaws.splice(event, 1);
      this.$emit("update:advantagesObj", { ...{}, ...modifiedObj });
      this.$emit("update:flawPoints", this.flawPoints + cost);
    },
    sortSkills() {
      let optionsArr = [];
      for (const skill in this.fullSkills) {
        if (this.fullSkills[skill] > 0) {
          optionsArr.push(skill[0].toUpperCase() + skill.slice(1));
        }
      }
      return optionsArr;
    },
    addSpecialty() {
      if (this.handlePoints(true) === false) {
        return;
      }
      this.tabSpecialties.push({
        skill: this.skillSelect.toLowerCase(),
        specialty: this.specialtyInput,
      });
      this.specialtyInput = "";
      this.skillSelect = "";
    },
    convicWarning() {
      this.$q.notify({
        type: "negative",
        textColor: "white",
        message: "Maximum convictions reached!",
      });
    },
    handlePoints(data) {
      let points = this.specialtiePoints;
      if (points === 0 && data === true) {
        this.$q.notify({
          type: "negative",
          textColor: "white",
          message: "Out of specialties",
        });
        return false;
      }
      if (data === true) {
        points--;
      } else {
        points++;
      }
      this.$emit("update:specialtiePoints", points);
    },
    advorFlawOptions() {
      let arr = ["Advantages", "Flaws"];

      if (this.clan === "Thin-Blood" && this.meritCategory === "Thin-blood") {
        if (this.thinAdvantages > this.thinFlaws) {
          arr = ["Flaws"];
        } else if (this.thinFlaws > this.thinAdvantages) {
          arr = ["Advantages"];
        }
      }

      if (this.advantageCategory === "Merits") {
        arr = arr.filter(
          (type) =>
            allMerits.Merits[this.meritCategory][type.toLowerCase()].length > 0
        );
      }

      return arr;
    },
    meritCatOptions() {
      let arr = [];
      switch (this.advantageCategory) {
        case "Merits":
          arr = Object.keys(allMerits.Merits);
          if (this.age.label !== "Ancillae") {
            arr = arr.filter((x) => x !== "Archaic" && x !== "Adversary");
          }
          if (this.clan !== "Thin-Blood") {
            arr = arr.filter((x) => x !== "Thin-blood");
          }
          if (this.clan !== "Caitiff") {
            arr = arr.filter((x) => x !== "Caitiff");
          }
          if (this.clan === "Thin-Blood" && !this.edit) {
            arr = arr.filter((x) => x !== "Bonding");
          }
          break;
        case "Cult":
          arr = Object.keys(allCultMerits.Cults);
          if (this.cult === "None") {
            arr = arr.filter((x) => x === "General" || x === "Haven");
          } else {
            arr = arr.filter((x) => x === "General" || x === this.cult);
          }
          break;
        case "Backgrounds":
          arr = Object.keys(allBackgrounds.Backgrounds);
          if (this.clan === "Thin-Blood" && !this.edit) {
            arr = arr.filter(
              (x) => x !== "Mawla" && x !== "Status" && x !== "Retainers"
            );
          }
          break;
        case "Haven":
          arr = Object.keys(havenMerits.havens);
          break;
        case "Loresheets":
          for (const [key, value] of Object.entries(
            this.loresheets.loresheets
          )) {
            if (
              value.Prerequisite !== null &&
              !value.Prerequisite.includes(this.clan)
            ) {
              continue;
            }
            arr.push(value.Name);
          }

          break;
      }

      return arr;
    },
    meritOptions() {
      let arr = [];
      if (this.advOrFlaw.toLowerCase() === "advantages") {
        switch (this.advantageCategory) {
          case "Merits":
            arr = allMerits.Merits[this.meritCategory].advantages;

            if (
              this.disciplines.Dominate === undefined ||
              this.disciplines.dominate < 1
            ) {
              arr.forEach((merit, index) => {
                if (merit.name === "Bonds of Fealty") {
                  arr.splice(index, 1);
                }
              });
            }

            if (this.clan === "Nosferatu") {
              arr.forEach((merit, index) => {
                if (
                  merit.name === "Up All Night" ||
                  merit.name === "Up All Night x2"
                ) {
                  arr.splice(index, 1);
                }
              });
            } else if (
              this.clan === "Hecata" ||
              this.clan === "Giovanni" ||
              this.clan === "Lamiae" ||
              this.clan === "Samedi" ||
              this.clan === "Nagaraja" ||
              this.clan === "Lasombra"
            ) {
              arr.forEach((merit, index) => {
                if (
                  merit.name === "Up All Night x2" ||
                  merit.name === "Mystic of the Void"
                ) {
                  arr.splice(index, 1);
                }
              });
            }

            if (this.age.label !== "Ancillae") {
              const advantages =
                allMerits.Merits[this.meritCategory].advantages;
              arr = advantages.filter((advantage) => !advantage.ancillaOnly);
            }

            break;
          case "Cult":
            arr = allCultMerits.Cults[this.meritCategory].advantages;
            break;
          case "Backgrounds":
            arr = allBackgrounds.Backgrounds[this.meritCategory].advantages;

            break;
          case "Haven":
            arr = havenMerits.havens[this.meritCategory].advantages;
            break;
        }
      }
      if (this.advOrFlaw.toLowerCase() === "flaws") {
        switch (this.advantageCategory) {
          case "Merits":
            arr = allMerits.Merits[this.meritCategory].flaws;
            if (this.age.label !== "Ancillae") {
              const flaws = allMerits.Merits[this.meritCategory].flaws;
              arr = flaws.filter((flaw) => !flaw.ancillaOnly);
            }
            break;
          case "Cult":
            arr = allCultMerits.Cults[this.meritCategory].flaws;
            break;
          case "Backgrounds":
            arr = allBackgrounds.Backgrounds[this.meritCategory].flaws;
            if (this.age.label !== "Ancillae") {
              const flaws =
                allBackgrounds.Backgrounds[this.meritCategory].flaws;
              arr = flaws.filter((flaw) => !flaw.ancillaOnly);
            }
            break;
          case "Haven":
            arr = havenMerits.havens[this.meritCategory].flaws;
            break;
        }
      }

      return arr;
    },
    dotOptions() {
      let arr = [];

      if (this.advantageCategory === "Loresheets") {
        return this.range(5, 1);
      }
      arr = this.range(this.advFlawChoice.maxCost, 1);

      return arr;
    },
    costAdjustment() {
      if (this.howManyDots && this.advantageCategory === "Loresheets") {
        let loresheet = this.loresheets.loresheets.find(
          (x) => x.Name === this.meritCategory
        );
        this.advFlawChoice = {
          name: loresheet.Name,
          desc: loresheet.Description,
          cost: this.howManyDots,
        };
      }

      if (this.howManyDots && this.advantageCategory !== "Loresheets") {
        this.advFlawChoice.cost = this.howManyDots;
      }
    },
    clearDotField() {
      this.howManyDots = "";
    },

    changeAdvCat() {
      this.advFlawChoice = "";
      this.advOrFlaw = "";
      this.meritCategory = "";
      this.howManyDots = "";
      this.specificationInput = "";
    },

    changeMeritCat() {
      this.advFlawChoice = "";
      this.advOrFlaw = "";
      this.howManyDots = "";
      this.specificationInput = "";
    },

    clearFields() {
      this.advFlawChoice = "";
      this.advOrFlaw = "";
      this.meritCategory = "";
      this.advantageCategory = "";
      this.howManyDots = "";
      this.specificationInput = "";
      this.thinBonusDiscInput = "";
      this.thinClanBane = "";
    },

    sortAdvantageChoice(choiceObj, advOrFlaw) {
      let modifiedObj = { ...{}, ...this.advantagesObj };

      switch (this.advantageCategory) {
        case "Merits":
          if (advOrFlaw === true) {
            modifiedObj.merits.advantages.push(choiceObj);
          } else {
            modifiedObj.merits.flaws.push(choiceObj);
          }
          break;
        case "Cult":
          if (advOrFlaw === true) {
            modifiedObj.merits.advantages.push(choiceObj);
          } else {
            modifiedObj.merits.flaws.push(choiceObj);
          }
          break;
        case "Backgrounds":
          let bg_choice = { ...choiceObj };

          if (this.specificationInput) {
            bg_choice.name = choiceObj.name + this.specificationInput;
          }
          if (advOrFlaw === true) {
            modifiedObj.backgrounds.advantages.push(bg_choice);
          } else {
            modifiedObj.backgrounds.flaws.push(bg_choice);
          }
          break;
        case "Haven":
          if (advOrFlaw === true) {
            modifiedObj.haven.advantages.push(choiceObj);
          } else {
            modifiedObj.haven.flaws.push(choiceObj);
          }
          break;
        case "Loresheets":
          if (advOrFlaw === true) {
            modifiedObj.loresheets.advantages.push(choiceObj);
          } else {
            modifiedObj.loresheets.flaws.push(choiceObj);
          }
          break;
      }

      if (advOrFlaw === true) {
        this.$emit(
          "update:advantagePoints",
          this.advantagePoints - choiceObj.cost
        );
      } else {
        this.$emit("update:flawPoints", this.flawPoints - choiceObj.cost);
      }

      this.$emit("update:advantagesObj", { ...{}, ...modifiedObj });
    },

    canPurchase(advOrFlaw) {
      //true = advantage, false = flaw
      if (advOrFlaw === true) {
        if (
          this.advantagePoints < this.advFlawChoice.cost ||
          this.howManyDots > this.advantagePoints
        ) {
          this.$q.notify({
            type: "negative",
            textColor: "white",
            message: "Not enough advantage dots remaining!",
          });
          return false;
        }
      } else {
        if (
          this.flawPoints < this.advFlawChoice.cost ||
          this.howManyDots > this.flawPoints
        ) {
          this.$q.notify({
            type: "negative",
            textColor: "white",
            message: "Not enough flaw dots remaining!",
          });
          return false;
        }
      }

      if (
        this.advFlawChoice.name === "Zeroed" ||
        this.advFlawChoice.name === "Cobbler"
      ) {
        let mask = this.advantagesObj.backgrounds.advantages.find(
          (x) => x.name === "Mask"
        );
        if (typeof mask == "undefined" || mask.cost < 2) {
          this.$q.notify({
            type: "negative",
            textColor: "white",
            message: "You must have 2 dots in mask to take this background!",
          });
          return false;
        }
      }

      return true;
    },

    thinBloodBonusDiscs() {
      let arr = [];
      Object.keys(this.disciplinesList.Disciplines).forEach((element) => {
        arr.push(element);
      });

      arr = arr.filter((x) => x !== "Thin-blood Alchemy");

      return arr;
    },

    removeThinAdvantage(event, name) {
      let modifiedObj = { ...{}, ...this.advantagesObj };
      let newDisc = { ...{}, ...this.disciplines };
      modifiedObj.merits.advantages.splice(event, 1);
      let newDiscSkills = this.disciplineSkills;
      switch (name) {
        case "Thin-Blood: Anarch Comrades":
          modifiedObj.backgrounds.advantages =
            modifiedObj.backgrounds.advantages.filter(
              (e) => e.name !== "Mawla: Anarchs"
            );
          break;
        case "Thin-Blood: Camarilla Contact":
          modifiedObj.backgrounds.advantages =
            modifiedObj.backgrounds.advantages.filter(
              (e) => e.name !== "Mawla: Camarilla"
            );
          break;
        case "Thin-Blood: Discipline Affinity":
          let keys = Object.keys(newDisc);

          keys.forEach((x) => {
            if (
              x !== "Athanor Corporis" &&
              x !== "Calcinatio" &&
              x !== "Fixatio"
            ) {
              newDiscSkills = newDiscSkills.filter((e) => e.discipline !== x);
              delete newDisc[x];
            }
          });

          break;
        case "Thin-Blood: Thin-blood Alchemist":
          newDisc["Athanor Corporis"] = 0;
          newDisc["Calcinatio"] = 0;
          newDisc["Fixatio"] = 0;
          newDiscSkills = newDiscSkills.filter(
            (e) =>
              e.discipline !== "Athanor Corporis" &&
              e.discipline !== "Calcinatio" &&
              e.discipline !== "Fixatio"
          );

          break;
      }
      this.thinAdvantagesTab--;
      this.$emit("update:thinAdvantages", this.thinAdvantagesTabs);
      this.$emit("update:advantagesObj", { ...{}, ...modifiedObj });
      this.$emit("update:disciplines", newDisc);
      this.$emit("update:disciplineSkills", newDiscSkills);
    },

    removeThinFlaw(event, name) {
      let modifiedObj = { ...{}, ...this.advantagesObj };
      modifiedObj.merits.flaws.splice(event, 1);

      this.thinFlawsTabs--;
      this.$emit("update:thinFlaws", this.thinFlawsTabs);
      this.$emit("update:advantagesObj", { ...{}, ...modifiedObj });
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

      haveIt = this.advantagesObj.merits.flaws.find(
        (o) => o.name === "Thin-Blood: Bestial Temper"
      );
      if (typeof haveIt === "undefined") {
        arr = arr.filter((x) => x !== "Brujah" && x !== "Gangrel");
      }

      haveIt = this.advantagesObj.merits.advantages.find(
        (o) => o.name === "Thin-Blood: Catenating Blood"
      );
      if (typeof haveIt === "undefined") {
        arr = arr.filter((x) => x !== "Tremere");
      }

      return arr;
    },

    handleThinBloods(advOrFlaw, modifiedObj) {
      if (advOrFlaw === true) {
        let haveIt;
        switch (this.advFlawChoice.name) {
          case "Thin-Blood: Lifelike":
            haveIt = modifiedObj.merits.flaws.find(
              (o) => o.name === "Thin-Blood: Dead Flesh"
            );
            if (typeof haveIt !== "undefined") {
              this.$q.notify({
                type: "negative",
                textColor: "white",
                message: "Cannot take Dead Flesh with the Lifelike merit!",
              });
              return;
            }
            break;
          case "Thin-Blood: Vampiric Resilience":
            haveIt = modifiedObj.merits.flaws.find(
              (o) => o.name === "Thin-Blood: Mortal Frailty"
            );
            if (typeof haveIt !== "undefined") {
              this.$q.notify({
                type: "negative",
                textColor: "white",
                message:
                  "Cannot take Vampiric Resilience with the Mortal Frailty merit!",
              });
              return;
            }
            break;
          case "Thin-Blood: Anarch Comrades":
            haveIt = modifiedObj.merits.flaws.find(
              (o) => o.name === "Thin-Blood: Shunned by the Anarchs"
            );
            if (typeof haveIt !== "undefined") {
              this.$q.notify({
                type: "negative",
                textColor: "white",
                message:
                  "Cannot take Anarch Comrades with the Shunned by the Anarchs merit!",
              });
              return;
            }
            break;
        }

        if (this.advFlawChoice.name === "Thin-Blood: Thin-blood Alchemist") {
          let newDisc = { ...{}, ...this.disciplines };
          newDisc["Thin-blood Alchemy"]++;
          this.$emit("update:disciplines", newDisc);
        }
        if (this.advFlawChoice.name === "Thin-Blood: Discipline Affinity") {
          let newDisc = { ...{}, ...this.disciplines };
          newDisc[this.thinBonusDiscInput] = 1;
          this.$emit("update:disciplines", newDisc);
        }

        modifiedObj.merits.advantages.push(this.advFlawChoice);
        this.thinAdvantagesTab++;
        this.$emit("update:thinAdvantages", this.thinAdvantagesTabs);
        this.clearFields();
      } else {
        let haveIt;

        switch (this.advFlawChoice.name) {
          case "Thin-Blood: Dead Flesh":
            haveIt = modifiedObj.merits.advantages.find(
              (o) => o.name === "Thin-Blood: Lifelike"
            );
            if (typeof haveIt !== "undefined") {
              this.$q.notify({
                type: "negative",
                textColor: "white",
                message: "Cannot take Dead Flesh with the Lifelike merit!",
              });
              return;
            }
            break;
          case "Thin-Blood: Mortal Frailty":
            haveIt = modifiedObj.merits.advantages.find(
              (o) => o.name === "Thin-Blood: Vampiric Resilience"
            );
            if (typeof haveIt !== "undefined") {
              this.$q.notify({
                type: "negative",
                textColor: "white",
                message:
                  "Cannot take Vampiric Resilience with the Mortal Frailty merit!",
              });
              return;
            }
            break;
          case "Thin-Blood: Shunned by the Anarchs":
            haveIt = modifiedObj.merits.advantages.find(
              (o) => o.name === "Thin-Blood: Anarch Comrades"
            );
            if (typeof haveIt !== "undefined") {
              this.$q.notify({
                type: "negative",
                textColor: "white",
                message:
                  "Cannot take Anarch Comrades with the Shunned by the Anarchs merit!",
              });
              return;
            }
            break;
          case "Thin-Blood: Clan Curse":
            this.advFlawChoice.name =
              this.advFlawChoice.name + " " + this.thinClanBane;
            this.$emit("update:clanBane", this.thinClanBane);
            break;
        }

        modifiedObj.merits.flaws.push(this.advFlawChoice);
        this.thinFlawsTab++;
        this.$emit("update:thinFlaws", this.thinFlawsTabs);

        this.clearFields();
      }
    },

    meritPicked() {
      let modifiedObj = { ...{}, ...this.advantagesObj };

      if (this.advantageCategory === "Loresheets") {
        if (this.canPurchase(true) === true) {
          this.sortAdvantageChoice(this.advFlawChoice, true);
          this.clearFields();
        }
      }

      if (this.advOrFlaw.toLowerCase() === "advantages") {
        if (this.clan === "Thin-Blood" && this.meritCategory === "Thin-blood") {
          this.handleThinBloods(true, modifiedObj);
          return;
        }
        //true represents an advantage, false a flaw
        if (this.canPurchase(true) === true) {
          this.sortAdvantageChoice(this.advFlawChoice, true);
          this.clearFields();
        }
      }

      if (this.advOrFlaw.toLowerCase() === "flaws") {
        if (this.clan === "Thin-Blood" && this.meritCategory === "Thin-blood") {
          this.handleThinBloods(false, modifiedObj);
          return;
        }
        if (this.canPurchase(false) === true) {
          this.sortAdvantageChoice(this.advFlawChoice, false);
          this.clearFields();
        }
      }
    },
  },
});
</script>
