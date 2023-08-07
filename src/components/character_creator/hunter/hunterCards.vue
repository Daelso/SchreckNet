<template>
  <q-card v-for="hunt in this.hunter" :key="hunt" class="my-card" flat bordered>
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
                      <div v-for="(edge, key) in hunt.edges.edges" :key="key">
                        <div>{{ edge.category }} - {{ edge.edge }}</div>
                      </div>
                      <br />
                      Perks:
                      <div v-for="(perk, key) in hunt.edges.perks" :key="key">
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
              <q-item-label style="color: white" overline>Concept</q-item-label>
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
              <q-item-label style="color: white" overline>Desire</q-item-label>
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
          this.router.push({ name: 'hunter5eView', params: { id: hunt.id } })
        "
      >
        View Full Character
      </q-btn>
      <q-btn
        @click="this.favoriteChar(hunt.id, hunt.charName)"
        style="margin: auto"
        flat
        v-if="
          this.currentUser !== false && hunt.created_by !== this.currentUser.id
        "
        >Favorite</q-btn
      >
    </q-card-actions>
  </q-card>
</template>
<style scoped>
.my-card {
  width: 100%;
  max-width: 650px;
  margin-right: 15px;
  display: flex;
  flex-flow: row wrap;
  color: white;
  background-color: #222831;
  align-items: flex-start;
  justify-content: center;
  min-height: 27em;
}
.backgroundDefault {
  background-color: #171a1e;
}
.base-info {
  display: flex;
  justify-content: center;
  align-content: flex-start;
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
  .my-card {
    margin-bottom: 15px;
  }
}
</style>
<script>
import { useRouter } from "vue-router";

export default {
  props: ["currentUser"],
  async setup(props) {
    const router = useRouter();

    const axios = require("axios");
    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    let hunter = await axios
      .get(baseUrl + "/hunters/card", {
        withCredentials: true,
      })
      .then((resp) => {
        return resp.data;
      })
      .catch((err) => {
        console.log(err);
        return "Not found!";
      });

    return {
      hunter,
      router,
      lorem:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
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

    favoriteChar(sheet_id, charName) {
      let baseUrl = "";
      if (window.location.href.includes("localhost")) {
        baseUrl = "http://localhost:5000";
      } else {
        baseUrl = window.location.origin;
      }
      const payload = {
        game_id: 2,
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
};
</script>
