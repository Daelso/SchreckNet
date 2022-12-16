<template>
  <div
    v-if="this.favorites === null || this.favorites.length === 0"
    class="banner"
  >
    No characters favorited yet!
  </div>
  <div class="container">
    <!-- <div class="">
      <q-select
        filled
        class="game-select"
        bg-color="grey-3"
        v-model="game"
        :options="gameOptions"
        label="Select your Game"
      />
    </div> -->
    <q-card
      v-for="vamp in this.favorites"
      :key="vamp"
      class="my-card q-my-lg"
      flat
      bordered
      :id="vamp.favId"
    >
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <q-icon color="secondary" name="app:ankh" style="scale: 180%" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ vamp.charName }}</q-item-label>
          <q-item-label style="color: white" caption>
            {{ vamp.clan }} ({{ vamp.sect }}) - {{ vamp.predator_type }}
          </q-item-label>
          <q-item-label style="color: white" caption>
            Generation: {{ vamp.generation }} ({{ vamp.age }})
          </q-item-label>
          <q-item-label style="color: white" caption>
            Cult: {{ vamp.cult }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />
      <div class="row">
        <q-card-section horizontal class="col">
          <q-card-section class="base-info">
            <q-list bordered separator>
              <q-item>
                <q-item-section>
                  <q-expansion-item expand-separator label="Attributes" dark>
                    <q-card>
                      <q-card-section
                        v-for="(attribute, key) in Object.keys(
                          vamp.attributes
                        ).sort()"
                        :key="key"
                        class="backgroundDefault"
                      >
                        <div class="attribute">
                          {{ attribute }} - {{ vamp.attributes[attribute] }}
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item></q-item-section
                >
              </q-item>
              <q-item>
                <q-item-section>
                  <q-expansion-item expand-separator label="Disciplines" dark>
                    <q-card>
                      <q-card-section
                        v-for="(discipline, key) in vamp.disciplines"
                        :key="key"
                        class="backgroundDefault"
                      >
                        {{ key }} - {{ discipline }} dots
                      </q-card-section>
                    </q-card>
                  </q-expansion-item></q-item-section
                >
              </q-item>
              <q-item>
                <q-item-section>
                  <q-expansion-item expand-separator label="Convictions" dark>
                    <q-card>
                      <q-card-section
                        v-for="(conviction, key) in vamp.convictions"
                        :key="key"
                        class="backgroundDefault"
                      >
                        {{ conviction }}
                      </q-card-section>
                    </q-card>
                  </q-expansion-item></q-item-section
                >
              </q-item>
            </q-list>
          </q-card-section>
        </q-card-section>
        <!-- Right side of card -->
        <div class="right-side">
          <q-list separator>
            <q-item>
              <q-item-section>
                <q-item-label style="color: white" overline
                  >Concept</q-item-label
                >
                <q-item-label>{{ truncate(vamp.concept, 50) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item>
              <q-item-section>
                <q-item-label style="color: white" overline
                  >Archetype
                </q-item-label>
                <q-item-label>{{ truncate(vamp.archetype, 50) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item>
              <q-item-section>
                <q-item-label style="color: white" overline
                  >Ambition</q-item-label
                >
                <q-item-label>{{ truncate(vamp.ambition, 50) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label style="color: white" overline
                  >Desire</q-item-label
                >
                <q-item-label>{{ truncate(vamp.desire, 50) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-separator />
          </q-list>
        </div>
      </div>
      <q-separator />
      <q-card-actions>
        <q-btn
          style="margin: auto"
          flat
          color="white"
          @click="
            this.router.push({ name: 'vampire5eView', params: { id: vamp.id } })
          "
        >
          View Full Character
        </q-btn>
        <q-btn
          @click="this.unfavoriteChar(vamp.favId)"
          style="margin: auto"
          flat
          v-if="this.currentUser !== false"
          >Unfavorite</q-btn
        >
      </q-card-actions>
    </q-card>
  </div>
</template>
<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-gap: 20px;
}
.my-card {
  width: 100%;
  max-width: 450px;
  margin-right: 15px;
  color: white;
  background-color: #222831;
  height: auto;
}

.banner {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
  font-family: TMUnicorn;
  text-shadow: 3px 2px 3px black;
  font-size: 35px;
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
.game-select {
  display: flex;
}

@media (max-width: 800px) {
  .container {
    display: flex;
    flex-direction: column;
    max-width: 375px;
  }
  .my-card {
    margin-bottom: 15px;
  }
}
</style>
<script>
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
  async setup() {
    let baseUrl = ref("");
    if (window.location.href.includes("localhost")) {
      baseUrl.value = "http://localhost:5000";
    } else {
      baseUrl.value = window.location.origin;
    }
    const router = useRouter();

    return {
      router,
      baseUrl,
    };
  },

  data() {
    return {
      favorites: null,
      currentUser: false,
      game: { label: "Vampire: The Masquerade", game_id: 1 },
      gameOptions: [{ label: "Vampire: The Masquerade", game_id: 1 }],
    };
  },

  async mounted() {
    this.$q.loading.show({
      delay: 450, // ms
    });

    this.favorites = await this.$axios
      .get(this.baseUrl + "/favorites/my", {
        withCredentials: true,
      })
      .then((resp) => {
        this.$q.loading.hide();
        this.currentUser = resp.data[1];
        return resp.data[0];
      })
      .catch((err) => {
        console.log(err);
        return "Not found!";
      });

    console.log(this.favorites);
  },

  methods: {
    truncate(value, length) {
      if (value.length > length) {
        return value.substring(0, length) + "...";
      } else {
        return value;
      }
    },
    async unfavoriteChar(favId) {
      const payload = { favId: favId };
      const elem = document.getElementById(favId);
      elem.style.display = "none"; //ye olde school JS

      await this.$axios
        .post(this.baseUrl + "/favorites/remove", payload, {
          withCredentials: true,
        })
        .then((resp) => {
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: `Unfavorited`,
          });
        })
        .catch((err) => {
          console.log(err);
          return "Not found!";
        });
    },
  },
};
</script>
