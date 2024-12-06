<template>
  <q-card class="card q-pa-sm">
    <q-card-section>
      <div class="text-h6 head" style="font-family: TMUnicorn">
        Create a Game
      </div>
    </q-card-section>

    <q-card-section class="q-pa-sm">
      <q-input
        filled
        label="Game Title"
        bg-color="grey-3"
        maxlength="75"
        class="select"
        label-color="primary"
        v-model="game_title"
        counter
      />

      <q-select
        v-model="game_line"
        :options="[
          { label: 'Vampire: the Masquerade', value: 1 },
          { label: 'Werewolf: the Apocalypse', value: 2 },
          { label: 'Hunter: the Reckoning', value: 3 },
        ]"
        label="Which Game Line?"
        label-color="primary"
        bg-color="grey-3"
        filled
        style="margin-bottom: 10px"
        color="secondary"
        popup-content-style="background-color:#222831; color:white"
      />
      <q-select
        v-model="game_style"
        :options="style_options"
        label="How Will This Game Be Played?"
        label-color="primary"
        map-options
        option-label="style"
        option-value="style_id"
        emit-value
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
        min="1"
      />
      <q-input
        filled
        type="number"
        label="Maximum Number of Players"
        bg-color="grey-3"
        class="select"
        label-color="primary"
        v-model="max_players"
        min="2"
        max="99"
      />

      <q-input
        filled
        type="textarea"
        label="Describe Your Game"
        bg-color="grey-3"
        class="select"
        label-color="primary"
        v-model="game_description"
        counter
        maxlength="900"
        bottom-slots
        counter-color="white"
      />
      <div>Include how you would like potential players to contact you</div>
    </q-card-section>

    <q-card-actions
      class="text-primary"
      style="display: flex; flex-direction: column"
    >
      <q-btn
        style="color: white; background-color: #0e1012"
        flat
        label="Create Game"
        :disable="!validateCreate"
        @click="create_game()"
        v-close-popup
      >
        <q-tooltip v-if="!validateCreate"
          >Please fill out all required fields.</q-tooltip
        >
      </q-btn>
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

.head {
  font-family: TMUnicorn;
  text-shadow: 3px 2px 3px black;
  color: red;
  font-size: 2em;

  @media (max-width: 768px) {
    font-size: 2em;
  }

  @media (max-width: 480px) {
    font-size: 1.5em; /* Further adjust font size for even smaller screens */
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
    const styleReq = await this.$api.get("/game_finder/styles");
    this.style_options = styleReq.data;
    console.log(this.style_options);
  },
  data() {
    return {
      game_title: "",
      game_style: "",
      min_players: 1,
      max_players: 2,
      game_line: "",
      game_description: "",
      style_options: [],
    };
  },

  methods: {
    async create_game() {
      try {
        this.$q.loading.show();
        const new_game = {
          title: this.game_title,
          style: this.game_style,
          min: this.min_players,
          max: this.max_players,
          game_line: this.game_line,
          desc: this.game_description,
        };
        await this.$api.post("/games/new_game", new_game);
      } catch (err) {
        console.log(err);
      } finally {
        this.$q.loading.hide();
      }
    },
  },
  computed: {
    validateCreate() {
      if (
        this.game_title.trim() === "" ||
        !this.game_style ||
        this.min_players === null ||
        this.max_players === null ||
        this.game_line === "" ||
        this.game_description.trim() === ""
      ) {
        console.log(this.min_players);
        console.log(this.max_players);
        return false;
      } else {
        return true;
      }
    },
  },
});
</script>

<style scoped>
.q-field__counter {
  color: white !important;
  background-color: white;
}

.q-field__bottom row {
  color: white;
  background-color: white;
}
</style>
