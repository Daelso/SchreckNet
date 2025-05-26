<template>
  <q-card class="card q-pa-sm scroll">
    <q-card-section class="q-ma-xl">
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
        style="margin-bottom: 10px; width: 100%"
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
        @update:model-value="validatePlayerRange()"
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
        @update:model-value="validatePlayerRange()"
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
      <q-separator size="0.2em" class="q-my-md" />
      <q-input
        filled
        label="Optional Link"
        bg-color="grey-3"
        class="select"
        label-color="primary"
        v-model="optional_link"
      />
    </q-card-section>
    <q-card-section>
      <div class="checkboxes">
        <q-checkbox v-model="new_player" label="New Player Friendly?">
          <q-tooltip class="bg-dark text-body2"
            >Check this box to indicate that your game is open to new players
            and you are willing to teach!</q-tooltip
          >
        </q-checkbox>
        <q-checkbox v-model="paid_game" label="Paid Game?">
          <q-tooltip class="bg-dark text-body2"
            >Check this box if your game will require players to pay</q-tooltip
          >
        </q-checkbox>
      </div>
    </q-card-section>

    <q-card-actions
      class="text-primary"
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: auto;
      "
    >
      <q-btn
        style="color: white; background-color: #0e1012; margin: auto"
        flat
        :label="this.selectedGame ? 'Update Game' : 'Create Game'"
        :disable="!validateCreate"
        @click="create_game()"
        v-close-popup
      >
        <q-tooltip v-if="!validateCreate" class="bg-dark text-body2"
          >Please fill out all required fields.</q-tooltip
        >
      </q-btn>
      <q-btn flat style="color: white" label="Cancel" v-close-popup />
      <q-btn
        v-if="this.selectedGame"
        flat
        style="color: white"
        label="Delete Game"
        @click="confirmDeleteDialog = true"
      />
    </q-card-actions>
  </q-card>

  <!-- Confirm delete -->
  <q-dialog v-model="confirmDeleteDialog" persistent>
    <q-card class="card">
      <q-card-section class="q-pa-md">
        <div class="text-h6">Confirm Deletion</div>
        <div>Are you sure you want to delete this game?</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="white" v-close-popup />
        <q-btn
          flat
          label="Delete"
          color="negative"
          @click="handleDelete()"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
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

.checkboxes {
  display: flex;
  flex-direction: column;
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
    font-size: 0.5em; /* Further adjust font size for even smaller screens */
  }
}

.q-input.select {
  width: 35em;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    width: 100%;
    font-size: 1em;
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 1em;
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
import nosImage from "../../assets/images/Nosfer_logo.png";

export default defineComponent({
  name: "createAGame",
  props: {
    selectedGame: Object,
  },
  async created() {
    const styleReq = await this.$api.get("/game_finder/styles");
    this.style_options = styleReq.data;

    if (this.selectedGame) {
      this.game_title = this.selectedGame.game_title;
      this.game_style = this.selectedGame.game_style;
      this.min_players = this.selectedGame.minimum_players;
      this.max_players = this.selectedGame.maximum_players;
      this.game_line = this.which_game();
      this.game_description = this.selectedGame.description;
      this.optional_link = this.selectedGame.optional_link;
      this.new_player = this.selectedGame.new_player;
      this.paid_game = this.selectedGame.paid_game;
    }
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
      confirmDeleteDialog: false,
      new_player: false,
      paid_game: false,
      optional_link: "",
    };
  },

  methods: {
    which_game() {
      switch (this.selectedGame.game_line) {
        case 1:
          return { label: "Vampire: the Masquerade", value: 1 };
        case 2:
          return { label: "Werewolf: the Apocalypse", value: 2 };
        case 3:
          return { label: "Hunter: the Reckoning", value: 3 };

        default:
          return { label: "Vampire: the Masquerade", value: 1 };
      }
    },
    handleDelete() {
      this.deleteGame(); // run your deletion logic
      this.$emit("close-parent");
    },
    validatePlayerRange() {
      if (this.min_players > this.max_players) {
        this.$q.notify({
          color: "primary",
          avatar: nosImage,
          textColor: "white",
          message: "Minimum players cannot be greater than maximum players.",
        });

        this.min_players = this.max_players;
      }
    },
    sanitizeLink(link) {
      if (!link) return "";

      const trimmed = link.trim();

      // Only allow http or https links
      const isValid = /^(https?:\/\/)/i.test(trimmed);
      return isValid ? trimmed : "";
    },
    async deleteGame() {
      try {
        this.$q.loading.show();

        await this.$api.put(`/games/${this.selectedGame.game_id}/delete`);
        this.$q.notify({
          color: "primary",
          avatar: nosImage,
          textColor: "white",
          message: `Game deleted successfully!`,
        });
      } catch (err) {
        console.log(err);
        this.$q.notify({
          color: "primary",
          avatar: nosImage,
          textColor: "white",
          message: `Failed to delete game, try again...`,
        });
      } finally {
        this.$q.loading.hide();
      }
    },
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
          new_player: this.new_player,
          paid_game: this.paid_game,
          optional_link: this.sanitizeLink(this.optional_link),
        };
        if (this.selectedGame) {
          await this.$api.put(
            `/games/${this.selectedGame.game_id}/edit`,
            new_game
          );

          this.$q.notify({
            color: "primary",
            avatar: nosImage,
            textColor: "white",
            message: `Game updated successfully!`,
          });
          return;
        }
        await this.$api.post("/games/new_game", new_game);
        this.$q.notify({
          color: "primary",
          avatar: nosImage,
          textColor: "white",
          message: `Game created successfully!`,
        });
      } catch (err) {
        console.log(err);
        this.$q.notify({
          color: "primary",
          avatar: nosImage,
          textColor: "white",
          message: `Failed to create game, try again...`,
        });
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
        return false;
      } else {
        return true;
      }
    },
  },
});
</script>
