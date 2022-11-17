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
        <q-tab name="alarms" label="Alarms" />
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

        <q-tab-panel name="alarms">
          <div class="text-h6">Alarms</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
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
      chronicle: "",
      desire: "",
      concept: "",
    };
  },
});
</script>
