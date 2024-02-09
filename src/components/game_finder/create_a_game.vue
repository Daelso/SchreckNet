<template>
  <q-card class="card q-pa-sm">
    <q-card-section>
      <div class="text-h6">Create a Game</div>
    </q-card-section>

    <q-card-section class="q-pa-sm">
      <q-input
        filled
        label="Game Title"
        bg-color="grey-3"
        class="select"
        label-color="primary"
        v-model="game_title"
      />

      <q-select
        v-model="game_line"
        :options="[
          { label: 'Vampire: The Masquerade', value: 1 },
          { label: 'Werewolf: The Apocalypse', value: 2 },
          { label: 'Hunter: The Reckoning', value: 3 },
        ]"
        label="Which Game Line?"
        label-color="primary"
        bg-color="grey-3"
        filled
        style="margin-bottom: 10px"
        color="secondary"
        popup-content-style="background-color:#222831; color:white"
      />
      <q-input
        filled
        type="number"
        label="Minimum Number of Players"
        bg-color="grey-3"
        class="select"
        label-color="primary"
        v-model="min_players"
      />
      <q-input
        filled
        type="number"
        label="Maximum Number of Players"
        bg-color="grey-3"
        class="select"
        label-color="primary"
        v-model="max_players"
      />

      <q-input
        filled
        type="textarea"
        label="Describe your Game"
        bg-color="grey-3"
        class="select"
        label-color="primary"
        v-model="game_description"
      />
      <div>Include how you would like potential players to contact you</div>
    </q-card-section>

    <q-card-actions
      class="text-primary"
      style="display: flex; flex-direction: column"
    >
      <q-btn style="color: white" flat label="Create Game" v-close-popup />
      <q-btn flat style="color: white" label="Cancel" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<style scoped>
.card {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  width: 750px;

  background-color: #222831;

  @media (max-width: 768px) {
    min-width: 2em;
  }

  @media (max-width: 480px) {
    min-width: 1.5em;
  }
}

.q-input.select {
  width: 35em;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    width: 50px;
  }

  @media (max-width: 480px) {
    width: 45px;
  }
}

.q-select.select {
  width: 35em;
  margin-top: 80px;

  @media (max-width: 768px) {
    width: 50px;
  }

  @media (max-width: 480px) {
    width: 45px;
  }
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "createAGame",
  async created() {
    if (window.location.href.includes("localhost")) {
      this.baseUrl = "http://localhost:5000";
    } else {
      this.baseUrl = window.location.origin;
    }
  },
  data() {
    return {
      baseUrl: null,
      game_title: "",
      min_players: 1,
      max_players: 2,
      game_line: "",
    };
  },

  methods: {},
});
</script>
