<template>
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
              <q-item-label style="color: white" overline>Concept</q-item-label>
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
              <q-item-label style="color: white" overline>Desire</q-item-label>
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
          this.router.push({ name: 'vampire5eView', params: { id: vamp.id } })
        "
      >
        View Full Character
      </q-btn>
      <q-btn
        @click="this.favoriteChar(vamp.id, vamp.charName)"
        style="margin: auto"
        flat
        v-if="
          this.currentUser !== false && vamp.created_by !== this.currentUser.id
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
  min-height: 35em;
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

    let kindred = await axios
      .get(baseUrl + "/vampires/card", {
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
      kindred,
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
};
</script>
