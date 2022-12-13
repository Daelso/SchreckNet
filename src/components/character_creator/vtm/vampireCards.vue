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
              <q-item-label style="color: white" overline>Concept</q-item-label>
              <q-item-label>{{ vamp.concept.slice(0, 50) }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item>
            <q-item-section>
              <q-item-label style="color: white" overline
                >Archetype</q-item-label
              >
              <q-item-label>{{ vamp.archetype.slice(0, 50) }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item>
            <q-item-section>
              <q-item-label style="color: white" overline
                >Ambition</q-item-label
              >
              <q-item-label>{{ vamp.ambition.slice(0, 50) }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label style="color: white" overline>Desire</q-item-label>
              <q-item-label>{{ vamp.desire.slice(0, 50) }}</q-item-label>
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
    </q-card-actions>
  </q-card>
</template>
<style scoped>
.my-card {
  width: 100%;
  max-width: 450px;
  margin-right: 15px;
  color: white;
  background-color: #222831;
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
  .my-card {
    margin-bottom: 15px;
  }
}
</style>
<script>
import { useRouter } from "vue-router";

export default {
  async setup() {
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

    console.log(kindred);

    return {
      kindred,
      router,
      lorem:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    };
  },

  computed: {
    filter: function (text, length, clamp) {
      clamp = clamp || "...";
      var node = document.createElement("div");
      node.innerHTML = text;
      var content = node.textContent;
      return content.length > length
        ? content.slice(0, length) + clamp
        : content;
    },
  },
};
</script>
