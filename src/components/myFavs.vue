<template>
  <div class="q-pa-md" style="max-width: 1400px">
    <div class="banner">Favorite Vampires</div>

    <div
      class="vamps"
      v-if="this.vampireFavorites !== null && this.vampireFavorites.length > 0"
    >
      <q-card
        v-for="vamp in this.vampireFavorites"
        :key="vamp"
        class="my-card"
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
              {{
                ["Giovanni", "Lamiae", "Nagaraja", "Samedi"].includes(vamp.clan)
                  ? vamp.clan + " [Hecata]"
                  : vamp.clan
              }}
              ({{ vamp.sect }}) - {{ vamp.predator_type }}
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
        <q-card-actions
          style="display: flex; justify-content: center; align-items: center"
        >
          <q-btn
            flat
            color="white"
            @click="
              this.router.push({
                name: 'vampire5eView',
                params: { id: vamp.id },
              })
            "
          >
            View Full Character
          </q-btn>
          <q-btn
            @click="this.unfavoriteChar(vamp.favId)"
            style="margin: auto"
            flat
            >Unfavorite</q-btn
          >
        </q-card-actions>
      </q-card>
    </div>
    <div class="banner2" v-else>No vampires favorited</div>

    <div class="banner q-my-md">Favorite Garou</div>

    <div
      class="vamps"
      v-if="this.garouFavorites !== null && this.garouFavorites.length > 0"
    >
      <q-card
        v-for="wolf in this.garouFavorites"
        :key="wolf"
        class="my-card"
        flat
        bordered
        :id="wolf.favId"
      >
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <q-icon color="secondary" name="app:claws" style="scale: 170%" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ wolf.charName }}</q-item-label>
            <q-item-label style="color: white" caption>
              {{ wolf.tribe.tribe_name }} ({{ wolf.auspice.auspice_name }})
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
                            wolf.attributes
                          ).sort()"
                          :key="key"
                          class="backgroundDefault"
                        >
                          <div class="attribute">
                            {{ attribute }} - {{ wolf.attributes[attribute] }}
                          </div>
                        </q-card-section>
                      </q-card>
                    </q-expansion-item></q-item-section
                  >
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-expansion-item expand-separator label="Gifts/Rites" dark>
                      <q-card>
                        <q-card-section class="backgroundDefault">
                          Gifts:
                          <div
                            v-for="(gift, key) in this.combineGifts(wolf)"
                            :key="key"
                          >
                            <div>
                              {{ gift.gift_name ? gift.gift_name : "" }}
                            </div>
                          </div>
                          <br />
                          Rites:
                          <div
                            v-for="(gift, key) in this.combineGifts(wolf)"
                            :key="key"
                          >
                            {{ gift.rite_name ? gift.rite_name : "" }}
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
                          v-for="(touchstone, key) in wolf.touchstones"
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
                  <q-item-label>{{ truncate(wolf.concept, 50) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item>
                <q-item-section>
                  <q-item-label style="color: white" overline
                    >Patron</q-item-label
                  >
                  <q-item-label>{{ wolf.tribe.patron }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label style="color: white" overline
                    >Total Renown
                  </q-item-label>
                  <q-item-label>{{ this.renownSum(wolf) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label style="color: white" overline
                    >Loresheet
                  </q-item-label>
                  <q-item-label>{{
                    wolf.advantages.loresheets.advantages.length > 0
                      ? wolf.advantages.loresheets.advantages[0].name
                      : "None"
                  }}</q-item-label>
                </q-item-section>
              </q-item>

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
              this.router.push({ name: 'garou5eView', params: { id: wolf.id } })
            "
          >
            View Full Character
          </q-btn>
          <q-btn
            @click="this.unfavoriteChar(wolf.favId)"
            style="margin: auto"
            flat
            >Unfavorite</q-btn
          >
        </q-card-actions>
      </q-card>
    </div>
    <div class="banner2" v-else>No garou favorited</div>

    <div class="banner q-my-md">Favorite Hunters</div>
    <div
      class="vamps"
      v-if="this.hunterFavorites !== null && this.hunterFavorites.length > 0"
    >
      <q-card
        v-for="hunt in this.hunterFavorites"
        :key="hunt"
        class="my-card"
        flat
        bordered
        :id="hunt.favId"
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
            @click="
              this.router.push({
                name: 'hunter5eView',
                params: { id: hunt.id },
              })
            "
          >
            View Full Character
          </q-btn>
          <q-btn
            @click="this.unfavoriteChar(hunt.favId)"
            style="margin: auto"
            flat
            >Unfavorite</q-btn
          >
        </q-card-actions>
      </q-card>
    </div>
    <div class="banner2" v-else>No hunters favorited</div>
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
  font-size: 2.5rem;
}
.banner2 {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
  font-family: TMUnicorn;
  text-shadow: 3px 2px 3px black;
  font-size: 1rem;
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
.vamps {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
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
  .vamps {
    flex-direction: column;
  }
  .banner {
    font-size: 1.5em;
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
      vampireFavorites: null,
      garouFavorites: null,
      hunterFavorites: null,
      currentUser: false,
      game: { label: "Vampire: The Masquerade", game_id: 1 },
      gameOptions: [{ label: "Vampire: The Masquerade", game_id: 1 }],
    };
  },

  async mounted() {
    this.$q.loading.show({
      delay: 450, // ms
    });

    await this.$axios
      .get(this.baseUrl + "/favorites/my", {
        withCredentials: true,
      })
      .then((resp) => {
        this.$q.loading.hide();
        this.currentUser = resp.data[3];
        this.vampireFavorites = resp.data[0];
        this.hunterFavorites = resp.data[1];
        this.garouFavorites = resp.data[2];
      })
      .catch((err) => {
        console.log(err);
        return "Not found!";
      });
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

    combineGifts() {
      let gifts = { native: [], tribe: [], auspice: [], rite: [] };

      for (let key in this.garouFavorites.tribe_gifts) {
        if (this.garouFavorites.tribe_gifts[key] !== null) {
          gifts[key].push(this.garouFavorites.tribe_gifts[key]);
        }
      }

      for (let key in this.garouFavorites.purchased_gifts) {
        if (this.garouFavorites.purchased_gifts[key].length > 0) {
          gifts[key] = [
            ...gifts[key],
            ...this.garouFavorites.purchased_gifts[key],
          ];
        }
      }

      return gifts;
    },

    renownTotal(wolf) {
      const trueRenown = { glory: 0, honor: 0, wisdom: 0 };

      for (const key in trueRenown) {
        if (Object.prototype.hasOwnProperty.call(trueRenown, key)) {
          trueRenown[key] = wolf.tribe_renown[key] + wolf.purchased_renown[key];
        }
      }

      return trueRenown;
    },

    renownSum(wolf) {
      const totalRenown = this.renownTotal(wolf);
      const sum = Object.values(totalRenown).reduce(
        (acc, value) => acc + value,
        0
      );

      return sum;
    },
  },
};
</script>
