<template>
  <div class="top-box">
    <h2 class="banner">Find Your Next Game</h2>
    <div><q-btn label="Create a Game" @click="createDialog = true" /></div>

    <!-- Dialog -->
    <q-dialog v-model="createDialog" persistent>
      <create_a_game />
    </q-dialog>
  </div>
</template>

<style>
.my-card {
  width: 450px;
  max-width: 450px;
  display: flex;
  flex-flow: row wrap;
  color: white;
  background-color: #222831;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
  margin-right: 25px;
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
    font-size: 1.5em; /* Further adjust font size for even smaller screens */
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

@media (max-width: 800px) {
  .my-card {
    margin-bottom: 15px;
  }
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
    };
  },
  methods: {},
});
</script>
