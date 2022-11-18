<template>
  <div class="q-pa-md row justify-center text-center">
    <q-card class="bg-primary">
      <q-tabs
        v-model="tab"
        class="bg-primary"
        active-color="secondary"
        indicator-color="secondary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="coreConcept" label="Core Concept" />
        <q-tab name="touchstones" label="Touchstones/Convictions" />
        <q-tab name="movies" label="Movies" />
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
        </q-tab-panel>

        <q-tab-panel name="touchstones">
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
              <q-item-section :id="key">{{ conviction }}</q-item-section>
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
              <q-item-section :id="key">{{ touchstone }}</q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="movies">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";

export default defineComponent({
  name: "v5-tabs",
  setup() {
    return {
      tab: ref("coreConcept"),
    };
  },
  data() {
    return {
      ambition: "",
      charName: "",
      convictionInput: "",
      touchStoneInput: "",
      convictions: ["poop"],
      touchstones: [],
      chronicle: "",
      desire: "",
      concept: "",
    };
  },
  methods: {
    removeConviction(event) {
      this.convictions.splice(event, 1);
    },
    removeTouchstone(event) {
      this.touchstones.splice(event, 1);
    },
  },
});
</script>
