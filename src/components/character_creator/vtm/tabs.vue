<template>
  <div class="q-pa-md row justify-center text-center">
    <q-card class="bg-primary">
      <q-tabs
        v-model="tab"
        class="bg-primary tabs"
        active-color="secondary"
        indicator-color="secondary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="coreConcept" label="Core Concept" />
        <q-tab name="touchstones" label="Touchstones/Convictions" />
        <q-tab name="specialties" label="Specialties" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated class="bg-primary">
        <q-tab-panel name="coreConcept" class="q-m-b-xl">
          <q-input
            filled
            class="select"
            bg-color="grey-3"
            v-model="charName"
            label="Your character's name *"
            lazy-rules
            label-color="primary"
            @update:model-value="$emit('charName', this.charName)"
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
            v-model="concept"
            label="Character Concept *"
            autogrow
            hint="Who or what is this kindred?"
            hide-hint
            lazy-rules
            label-color="primary"
            @update:model-value="$emit('concept', this.concept)"
            :rules="[
              (val) =>
                (typeof val === 'string' &&
                  val.length <= 2000 &&
                  val.length >= 1) ||
                'Please keep this field between 50 and 2000 characters',
            ]"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="ambition"
            class="select"
            label="Ambition *"
            hint="Long term goals"
            hide-hint
            autogrow
            lazy-rules
            label-color="primary"
            @update:model-value="$emit('ambition', this.ambition)"
            :rules="[
              (val) =>
                (typeof val === 'string' && val.length <= 2000) ||
                'Please keep this field under 2000 characters',
            ]"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="desire"
            class="select"
            label="Desire *"
            hint="Specific, short-term goal"
            hide-hint
            autogrow
            label-color="primary"
            lazy-rules
            @update:model-value="$emit('desire', this.desire)"
            :rules="[
              (val) =>
                (typeof val === 'string' && val.length <= 2000) ||
                'Please keep this field under 2000 characters',
            ]"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="archetype"
            label="Archetype *"
            hint="Regain willpower when you fulfill your purpose. Examples: Judge, Guru, Gambler, Masochist "
            hide-hint
            autogrow
            class="select"
            label-color="primary"
            lazy-rules
            @update:model-value="this.$emit('archetype', this.archetype)"
            :rules="[
              (val) =>
                (typeof val === 'string' && val.length <= 2000) ||
                'Please keep this field under 2000 characters',
            ]"
          />
          <q-select
            v-model="sect"
            :options="sectOptions"
            label="Sect"
            label-color="primary"
            bg-color="grey-3"
            filled
            @update:model-value="this.$emit('sect', this.sect)"
          />
          <q-input
            filled
            bg-color="grey-3"
            v-model="chronicle"
            label="Chronicle *"
            class="select q-mt-md"
            label-color="primary"
            lazy-rules
            @update:model-value="this.$emit('chronicle', this.chronicle)"
            :rules="[
              (val) =>
                (typeof val === 'string' && val.length <= 100) ||
                'Please keep this field under 100 characters',
            ]"
          />
        </q-tab-panel>

        <q-tab-panel name="touchstones">
          <div class="q-mb-sm">
            Must have 1-3 convictions and as many touchstones as convictions.
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
                this.convictions.push(this.convictionInput);
                this.convictionInput = '';
                this.$emit('convictions', this.convictions);
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
                this.touchstones.push(this.touchStoneInput);
                this.touchStoneInput = '';
                this.$emit('touchstones', this.touchstones);
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
              v-for="(conviction, key) in convictions"
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
              v-for="(touchstone, key) in touchstones"
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
            Specialties remaining: {{ specialtiesRemaining }}
          </div>
          <q-input
            filled
            bg-color="grey-3"
            v-model="specialtyInput"
            label="Specialty *"
            hint="Write your specialty (Press enter to confirm)"
            hide-hint
            autogrow
            class="select"
            label-color="primary"
            lazy-rules
            v-on:keydown.enter.prevent="
              () => {
                this.specialtyInput = '';
                this.$emit('specialties', this.specialties);
              }
            "
            :rules="[
              (val) =>
                (typeof val === 'string' && val.length <= 2000) ||
                'Please keep this field under 2000 characters',
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
                >{{ specialty }}
                <q-tooltip class="bg-dark text-body2"
                  >Click to delete</q-tooltip
                >
              </q-item-section>
            </q-item>
          </q-list>
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

export default defineComponent({
  name: "v5-tabs",
  props: ["specialtiePoints", "specials"],
  setup() {
    return {
      tab: ref("coreConcept"),
    };
  },
  data(props) {
    return {
      ambition: "",
      archetype: "",
      charName: "",
      convictionInput: "",
      touchStoneInput: "",
      convictions: [],
      touchstones: [],
      chronicle: "",
      desire: "",
      concept: "",
      sect: "Camarilla",
      sectOptions: ["Anarch", "Camarilla", "Independent", "Sabbat", "Clanless"],
      specialtiesRemaining: props.specialtiePoints,
      specialtyInput: "",
      specialties: props.specials,
    };
  },
  methods: {
    removeConviction(event) {
      this.convictions.splice(event, 1);
    },
    removeTouchstone(event) {
      this.touchstones.splice(event, 1);
    },
    removeSpecialty(event) {
      this.specialties.splice(event, 1);
    },
  },
});
</script>
