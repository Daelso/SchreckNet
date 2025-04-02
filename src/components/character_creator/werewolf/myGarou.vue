<template>
  <div v-if="this.garou === null || this.garou.length === 0" class="banner">
    No characters created yet!
  </div>
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 10px;
      height: 100%;
    "
  >
    <div>
      <q-btn
        v-if="this.is_selected"
        label="Delete Selected"
        color="primary"
        @click="deleteConfirm()"
      ></q-btn>
    </div>

    <div class="card-container">
      <q-card
        v-for="wolf in this.garou"
        :key="wolf"
        class="my-card"
        flat
        bordered
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
          <q-checkbox
            v-model="wolf.checked"
            label="Select"
            @click="update_selected(wolf)"
          />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>
<style scoped>
.card-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-gap: 20px;
  padding: 10px;
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
export default {
  props: ["currentUser"],
  async created() {
    let id = window.location.href.split("/")[6];

    this.garou = await this.$api
      .get("/garou/myGarou/" + id, {
        withCredentials: true,
      })
      .then((resp) => {
        return resp.data;
      })
      .catch((err) => {
        return "Not found!";
      });
  },

  data() {
    return { selected: [], garou: [] };
  },
  async mounted() {
    let kindredId = window.location.href.split("/")[6];

    this.$q.loading.show({
      delay: 150, // ms
    });

    this.garou = await this.$api
      .get("/garou/myGarou/" + kindredId, {
        withCredentials: true,
      })
      .then((resp) => {
        this.$q.loading.hide();
        return resp.data;
      })
      .catch((err) => {
        return "Not found!";
      });
    this.garou.forEach((wolf) => {
      wolf.checked = false;
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
    update_selected(wolf) {
      if (wolf.checked) {
        if (!this.selected.includes(wolf.id)) {
          this.selected.push(wolf.id);
        }
      } else {
        this.selected = this.selected.filter((id) => id !== wolf.id);
      }
    },

    deleteConfirm() {
      if (this.selected.length === 0) {
        return;
      }
      this.$q
        .dialog({
          title: "Confirm Deletion",
          dark: true,
          color: "red",
          message: `Are you sure you wish to delete ${this.selected.length} characters? This cannot be undone!`,
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          try {
            this.selected.forEach(async (id) => {
              await this.$api.delete("/garou/delete/" + id, {
                withCredentials: true,
              });
            });
          } catch (err) {
            this.$q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: "Failed to delete! Try again later!",
            });
            console.log(err);
            return;
          } finally {
            this.$q.notify({
              color: "green-5",
              textColor: "white",
              icon: "check",
              message: "Character deleted!",
            });
            setTimeout(async () => {
              window.location.reload();
            }, "4 second");
          }
        })
        .onCancel(() => {
          return;
        });
    },

    favoriteChar(sheet_id, charName) {
      const payload = {
        game_id: 3,
        sheet_id: sheet_id,
      };
      this.$api
        .post("/favorites/add", payload, {
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

    combineGifts(wolf) {
      let gifts = [];

      for (let key in wolf.tribe_gifts) {
        if (wolf.tribe_gifts[key] !== null) {
          gifts.push(wolf.tribe_gifts[key]);
        }
      }

      for (let key in wolf.purchased_gifts) {
        if (wolf.purchased_gifts[key].length > 0) {
          gifts = [...gifts, ...wolf.purchased_gifts[key]];
        }
      }
      return gifts;
    },

    getGiftAmount(wolf) {
      const gifts = this.combineGifts(wolf);

      return Object.keys(gifts)
        .filter((key) => key !== "rite") // Filter out the "rite" key
        .reduce((sum, key) => sum + gifts[key].length, 0);
    },
  },
  computed: {
    is_selected() {
      if (this.selected.length > 0) {
        return true;
      }
      return false;
    },
  },
};
</script>
