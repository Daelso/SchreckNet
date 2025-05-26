<template>
  <div class="top-box">
    <h2 class="banner">Find Your Next Game</h2>
    <div class="action">
      <q-btn
        label="Create a Game"
        @click="createDialog = true"
        style="background-color: #222831; color: white"
      />
    </div>
    <div class="actions-container">
      <div class="options-banner q-ma-sm">Filter Options</div>

      <div class="filter-options">
        <div class="select">
          <q-select
            v-model="game_line"
            :options="[
              { label: 'Vampire: the Masquerade', value: 1 },
              { label: 'Werewolf: the Apocalypse', value: 2 },
              { label: 'Hunter: the Reckoning', value: 3 },
            ]"
            label="Which Game Line"
            label-color="primary"
            map-options
            option-label="label"
            option-value="value"
            emit-value
            bg-color="grey-3"
            filled
            style="margin-bottom: 10px; width: 100%"
            color="secondary"
            popup-content-style="background-color:#222831; color:white"
            @update:model-value="doSearch()"
          />
          <q-select
            v-model="game_style"
            :options="style_options"
            label="Game Type"
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
            @update:model-value="doSearch()"
          />
        </div>

        <div class="checkboxes">
          <q-checkbox
            v-model="new_player"
            label="New Player Friendly?"
            @update:model-value="doSearch()"
          >
            <q-tooltip class="bg-dark text-body2"
              >Check this box to include new player friendly games</q-tooltip
            >
          </q-checkbox>
          <q-checkbox
            v-model="paid_game"
            label="Paid Game?"
            @update:model-value="doSearch()"
          >
            <q-tooltip class="bg-dark text-body2"
              >Check this box to include paid games</q-tooltip
            >
          </q-checkbox>
        </div>
      </div>
    </div>
  </div>
  <div class="q-gutter-md q-pa-md games-container q-pa-lg">
    <div class="row q-col-gutter-md">
      <div
        class="col-12 col-sm-6 col-md-4"
        v-for="game in filtered_games"
        :key="game.game_id"
      >
        <q-card class="my-card" flat bordered>
          <q-card-section>
            <div class="text-h6">
              {{ game.game_title }} -
              <q-icon
                color="secondary"
                :name="showIcon(game.line_title)"
                style="scale: 170%"
              />
            </div>
            <div class="text-subtitle2 text-grey">
              Players: {{ game.minimum_players }} - {{ game.maximum_players }}
            </div>
            <div class="text-caption q-mt-xs">
              Game Line: {{ game.line_title }}<br />
              Style ID: {{ game.style.style }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-body2">
              {{ game.description }}
            </div>
          </q-card-section>

          <q-card-section>
            <q-chip
              color="green-3"
              text-color="black"
              icon="person_add"
              v-if="game.new_player === 1"
              >New Player Friendly</q-chip
            >
            <q-chip
              color="orange-3"
              text-color="black"
              icon="attach_money"
              v-if="game.paid_game === 1"
              >Paid Game</q-chip
            >
          </q-card-section>

          <q-separator />

          <q-card-actions class="justify-between items-center">
            <div class="text-caption text-grey-7">
              Last bumped:
              {{
                date.formatDate(new Date(game.updated_at), "MM-DD-YY h:mm A")
              }}
            </div>

            <q-btn
              v-if="game.optional_link"
              :href="game.optional_link"
              target="_blank"
              flat
              icon="link"
              label="View Link"
              color="secondary"
              rel="noreferrer noopener"
            />
            <div v-if="currentUser && game.created_by === currentUser.id">
              <q-btn
                flat
                icon="edit"
                label="Edit Game"
                color="secondary"
                @click="
                  () => {
                    this.selectedGame = game;
                    this.createDialog = true;
                  }
                "
              />
              <q-btn
                flat
                icon="arrow_upward"
                label="Bump Game"
                color="secondary"
                :disable="can_bump(game.updated_at)"
                @click="bump_game(game)"
              >
                <q-tooltip
                  v-if="can_bump(game.updated_at)"
                  class="bg-dark text-body2"
                  >You can only bump a game once per hour.</q-tooltip
                >
              </q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
  <!-- Pagination Buttons -->
  <div
    class="flex flex-center q-pa-sm"
    style="flex-direction: column"
    v-if="totalPages"
  >
    <div class="q-pa-md flex flex-center" style="gap: 10px">
      <q-btn
        label="First Page"
        color="primary"
        @click="goToPage(1)"
        :disable="currentPage === 1"
      />
      <q-btn
        label="Previous"
        color="secondary"
        @click="goToPage(currentPage - 1)"
        :disable="currentPage === 1"
      />
      <q-btn
        label="Next"
        color="secondary"
        @click="goToPage(currentPage + 1)"
        :disable="currentPage === totalPages"
      />
      <q-btn
        label="Last Page"
        color="primary"
        @click="goToPage(totalPages)"
        :disable="currentPage === totalPages"
      />
    </div>
    <!-- Displaying Current Page and Total Pages -->
    <div class="q-pa-md flex flex-center">
      <p>Page {{ currentPage }} of {{ totalPages }}</p>
    </div>
  </div>
  <div>
    <!-- Dialog -->
    <q-dialog v-model="createDialog" persistent @hide="doSearch()">
      <create_a_game :selectedGame="selectedGame" />
    </q-dialog>
  </div>
</template>

<style>
.my-card {
  width: 100%;
  max-width: 650px;
  margin-right: 15px;
  color: white;
  background-color: #222831;
  padding: 10px;
}
.top-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 2em;
  }

  @media (max-width: 480px) {
    font-size: 1.5em;
  }
}

.banner {
  font-family: TMUnicorn;
  text-shadow: 3px 2px 3px black;
  font-size: 2.5em;

  @media (max-width: 768px) {
    font-size: 2em;
  }

  @media (max-width: 480px) {
    font-size: 1.2em; /* Further adjust font size for even smaller screens */
  }
}

.options-banner {
  font-family: TMUnicorn;
  text-shadow: 3px 2px 3px black;
  font-size: 1.4em;
  @media (max-width: 768px) {
    font-size: 1em;
  }

  @media (max-width: 480px) {
    font-size: 1em;
  }
}

.backgroundDefault {
  background-color: #171a1e;
}
.base-info {
  display: flex;
  justify-content: center;
  align-content: center;
  margin: auto;
}

.right-side {
  max-width: 180px;
  overflow-wrap: break-word;
  color: white;
}

.attribute::first-letter {
  text-transform: capitalize;
}
.cards {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.actions-container {
  display: flex;
  background-color: #222831;
  margin: auto;
  width: 400px;
  height: 245px;
  justify-content: start;
  align-items: center;
  border-radius: 3%;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 320px;
    height: 260px;
    font-size: 0.7em;
  }

  @media (max-width: 480px) {
    width: 320px;
    height: 260px;
    font-size: 0.7em;
  }
}
.action {
  padding: 10px;
}

.filter-options {
  flex-direction: row;
  width: 250px;
  @media (max-width: 768px) {
    width: 240px;
  }

  @media (max-width: 480px) {
    width: 220px;
  }
}

.checkboxes {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding: 5px;
  font-family: monospace;
}
</style>

<script>
import { defineComponent } from "vue";
import { date } from "quasar";
import nosImage from "../../assets/images/Nosfer_logo.png";
import create_a_game from "../../components/game_finder/create_a_game.vue";

export default defineComponent({
  components: { create_a_game },
  name: "findAGame",
  async created() {
    try {
      try {
        const curUser = await this.$api.get("/user/currentUser");
        this.currentUser = curUser.data;
      } catch (err) {
        this.currentUser = null;
        console.warn("User not logged in");
      }

      const styleReq = await this.$api.get("/game_finder/styles");
      this.style_options = styleReq.data;
      this.style_options.push({ style: "Any", style_id: 100 });

      await this.doSearch();
    } catch (err) {
      this.$q.notify({
        color: "primary",
        avatar: nosImage,
        textColor: "white",
        position: "top",
        timeout: 5000,
      });
      console.error(err);
    }
  },

  data() {
    return {
      currentUser: null,
      selectedGame: null,
      nosImage,
      date,
      createDialog: false,
      games: null,
      currentPage: 1,
      totalPages: null,
      new_player: true,
      paid_game: true,
      game_line: "Any",
      game_style: 100,
      filtered_games: [],
      style_options: [],
    };
  },
  methods: {
    can_bump(updated_at) {
      const lastUpdated = new Date(updated_at);
      const now = new Date();
      const diffInMs = now - lastUpdated;
      const diffInHours = diffInMs / (1000 * 60 * 60);
      return diffInHours < 1; // disable if updated within the last hour
    },
    async bump_game(game) {
      try {
        await this.$api.post(`games/${game.game_id}/bump`);
        this.$q.notify({
          message: "Game bumped successfully!",
          color: "primary",
          avatar: nosImage,
          textColor: "white",
          position: "top",
        });

        game.updated_at = new Date().toISOString();
        await this.doSearch();
      } catch (err) {
        console.error(err);
        this.$q.notify({
          message: "Failed to bump the game.",
          color: "primary",
          avatar: nosImage,
          textColor: "white",
          position: "top",
        });
      }
    },
    async goToPage(page) {
      this.currentPage = page;
      await this.doSearch();
    },
    showIcon(game) {
      switch (game) {
        case "Vampire: the Masquerade":
          return "app:ankh";
        case "Werewolf: the Apocalypse":
          return "app:claws";
        case "Hunter: the Reckoning":
          return "app:hunter";
        default:
          return "app:ankh";
      }
    },
    async doSearch() {
      this.loading = true;
      this.$q.loading.show({ delay: 400 });

      try {
        const query = {};

        if (this.game_line !== null && this.game_line !== undefined) {
          query.game_line = this.game_line;
        }

        if (this.page) {
          query.page = this.page;
        }

        const response = await this.$api.get("game_finder/all_games", {
          params: query,
        });
        this.games = response.data.games;
        this.totalPages = response.data.total_pages;
        this.filter_games();
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
        this.$q.loading.hide();
      }
    },
    filter_games() {
      this.filtered_games = this.games.filter((game) => {
        const matchesNewPlayer = this.new_player ? true : game.new_player === 0;
        const matchesPaidGame = this.paid_game ? true : game.paid_game === 0;

        const matchesStyle =
          this.game_style > 10 ? true : game.game_style === this.game_style;

        return matchesNewPlayer && matchesPaidGame && matchesStyle;
      });
    },

    handleChange() {
      this.totalPages = null;
    },
  },
});
</script>
