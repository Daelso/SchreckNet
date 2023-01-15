<template>
  <div class="q-pa-md">
    <Suspense>
      <searchBox
        v-model:splat="splat"
        v-model:user="user"
        v-model:clan="clan"
        v-model:predator="predator"
        v-model:drive="drive"
        v-model:creed="creed"
        v-model:kindred="kindred"
        v-model:hunter="hunter"
        v-model:loader="loader"
      />
    </Suspense>
    <div
      v-if="
        this.kindred.length === 0 &&
        this.hunter.length === 0 &&
        this.wolves.length === 0
      "
      class="banner q-my-md"
    >
      No Results
    </div>
    <div class="cards" v-if="this.kindred.length > 0">
      <q-card
        v-for="vamp in this.kindred"
        :key="vamp"
        class="my-card"
        flat
        bordered
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
                  <q-item-label>{{
                    truncate(vamp.archetype, 50)
                  }}</q-item-label>
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
            flat
            color="white"
            :to="{
              name: 'vampire5eView',
              params: { id: vamp.id },
            }"
            target="_blank"
          >
            View Full Character
          </q-btn>
          <q-btn
            @click="this.favoriteChar(vamp.id, vamp.charName)"
            style="margin: auto"
            flat
            v-if="
              this.currentUser !== false &&
              vamp.created_by !== this.currentUser.id
            "
            >Favorite</q-btn
          >
        </q-card-actions>
      </q-card>
    </div>
    <div class="cards">
      <q-card
        v-for="hunt in this.hunter"
        :key="hunt"
        class="my-card"
        flat
        bordered
      >
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <q-icon color="secondary" name="app:hunter" style="scale: 170%" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ hunt.charName }}</q-item-label>
            <q-item-label style="color: white" caption>
              {{ hunt.creed.name }} ({{ hunt.drive.name }}) - {{ hunt.cell }}
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
                            hunt.attributes
                          ).sort()"
                          :key="key"
                          class="backgroundDefault"
                        >
                          <div class="attribute">
                            {{ attribute }} - {{ hunt.attributes[attribute] }}
                          </div>
                        </q-card-section>
                      </q-card>
                    </q-expansion-item></q-item-section
                  >
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-expansion-item expand-separator label="Edges/Perks" dark>
                      <q-card>
                        <q-card-section class="backgroundDefault">
                          Edges:
                          <div
                            v-for="(edge, key) in hunt.edges.edges"
                            :key="key"
                          >
                            <div>{{ edge.category }} - {{ edge.edge }}</div>
                          </div>
                          <br />
                          Perks:
                          <div
                            v-for="(perk, key) in hunt.edges.perks"
                            :key="key"
                          >
                            {{ perk.category }} - {{ perk.perk }}
                          </div>
                        </q-card-section>
                      </q-card>
                    </q-expansion-item></q-item-section
                  >
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-expansion-item expand-separator label="Touchstones" dark>
                      <q-card>
                        <q-card-section
                          v-for="(touchstone, key) in hunt.touchstones"
                          :key="key"
                          class="backgroundDefault"
                        >
                          {{ touchstone }}
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
                  <q-item-label>{{ truncate(hunt.concept, 50) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item>
                <q-item-section>
                  <q-item-label style="color: white" overline
                    >Ambition</q-item-label
                  >
                  <q-item-label>{{ truncate(hunt.ambition, 50) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label style="color: white" overline
                    >Desire</q-item-label
                  >
                  <q-item-label>{{ truncate(hunt.desire, 50) }}</q-item-label>
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
            :to="{
              name: 'hunter5eView',
              params: { id: hunt.id },
            }"
            target="_blank"
          >
            View Full Character
          </q-btn>
          <q-btn
            @click="this.favoriteChar(hunt.id, hunt.charName)"
            style="margin: auto"
            flat
            v-if="
              this.currentUser !== false &&
              hunt.created_by !== this.currentUser.id
            "
            >Favorite</q-btn
          >
        </q-card-actions>
      </q-card>
    </div>
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

.banner {
  display: flex;
  justify-content: center;
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
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import searchBox from "../../components/search/searchBox.vue";

export default defineComponent({
  components: { searchBox },
  name: "searchPage",
  setup() {
    const $q = useQuasar();
    const axios = require("axios");
    const router = useRouter();
    let currentUser = ref(false);

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }
    return {
      router,
      currentUser,
    };
  },

  data() {
    return {
      splat: "",
      user: "",
      clan: "",
      predator: "",
      drive: "",
      creed: "",
      kindred: [],
      wolves: [],
      hunter: [],
      loader: false,
    };
  },
  methods: {
    truncate(value, length) {
      if (value.length > length) {
        return value.substring(0, length) + "...";
      } else {
        return value;
      }
    },

    showLoading() {
      if (this.loader === true) {
        this.$q.loading.show({
          delay: 5, // ms
        });
      } else {
        this.$q.loading.hide();
      }
    },

    favoriteChar(sheet_id, charName) {
      let baseUrl = "";
      if (window.location.href.includes("localhost")) {
        baseUrl = "http://localhost:5000";
      } else {
        baseUrl = window.location.origin;
      }
      const payload = {
        game_id: 1,
        sheet_id: sheet_id,
      };
      this.$axios
        .post(baseUrl + "/favorites/add", payload, {
          withCredentials: true,
        })
        .then((res) => {
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: `Favorited ${charName}`,
          });
        })
        .catch((err) => {
          if (err.response.status === 409) {
            return this.$q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: "You have already favorited this character!",
            });
          }
          this.$q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: err.message,
          });
        });
    },
  },
  async mounted() {
    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }
    this.currentUser = await this.$axios
      .get(baseUrl + "/user/currentUser", {
        withCredentials: true,
      })
      .then((resp) => {
        return resp.data;
      });
  },
});
</script>
