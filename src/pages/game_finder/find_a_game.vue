<template>
  <div class="top-box">
    <h2 class="banner">Find Your Next Game</h2>
    <div class="actions-container">
      <div class="action">
        <q-btn
          label="Create a Game"
          @click="createDialog = true"
          style="background-color: #222831; color: white"
        />
      </div>
      <q-separator size="2em" color="red" />
      <div class="filter-options">
        <div class="select">
          <q-select
            v-model="game_line"
            :options="[
              { label: 'Vampire: the Masquerade', value: 1 },
              { label: 'Werewolf: the Apocalypse', value: 2 },
              { label: 'Hunter: the Reckoning', value: 3 },
            ]"
            label="Which Game Line?"
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
  <div class="game-container"></div>
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
    <q-dialog v-model="createDialog" persistent style="height: 1800px">
      <create_a_game />
    </q-dialog>
  </div>
</template>

<style>
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
  height: 220px;
  justify-content: start;
  align-items: center;
  border-radius: 5px;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 400px;
    height: 220px;
  }

  @media (max-width: 480px) {
    width: 280px;
    height: 220px;
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
}
</style>

<script>
import { defineComponent } from "vue";
import nosImage from "../../assets/images/Nosfer_logo.png";
import create_a_game from "../../components/game_finder/create_a_game.vue";

export default defineComponent({
  components: { create_a_game },
  name: "findAGame",
  async created() {
    try {
      const curUser = await this.$api.get("/user/currentUser");
      this.currentUser = curUser.data;

      await this.doSearch();
      console.log(this.totalPages);
      console.log(this.filtered_games);
    } catch (err) {
      this.$q.notify({
        message: "Log in to create or join a game!",
        color: "primary",
        position: "top",
        avatar: nosImage,
        timeout: 20000,
      });
    }
  },

  data() {
    return {
      currentUser: null,
      nosImage,
      createDialog: false,
      games: null,
      currentPage: 1,
      totalPages: null,
      new_player: true,
      paid_game: true,
      game_line: "Any",
      game_type: null,
      filtered_games: [],
    };
  },
  methods: {
    async goToPage(page) {
      this.currentPage = page;
      await this.doSearch();
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
        console.log(this.filtered_games);
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
        return matchesNewPlayer && matchesPaidGame;
      });
    },

    handleChange() {
      this.totalPages = null;
    },
  },
});
</script>
