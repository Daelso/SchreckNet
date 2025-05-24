<template>
  <div class="top-box">
    <h2 class="banner">Find Your Next Game</h2>
    <div>
      <q-btn
        label="Create a Game"
        @click="createDialog = true"
        style="background-color: #222831; color: white"
      />
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
      console.log(this.currentUser);
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
    };
  },
  methods: {
    async goToPage(page) {
      this.currentPage = page;
      await this.doSearch();
    },
    async doSearch() {
      this.loading = true;
      this.$q.loading.show({
        delay: 400,
      });

      try {
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
        this.$q.loading.hide();
      }
    },
    handleChange() {
      this.totalPages = null;
    },
  },
});
</script>
