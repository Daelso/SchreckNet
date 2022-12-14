<template>
  <div class="container">
    <q-card
      v-for="vamp in this.kindred"
      :key="vamp"
      class="my-card q-my-lg"
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
                  >Archetype</q-item-label
                >
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
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
  async setup() {
    const router = useRouter();

    return {
      router,
    };
  },

  data() {
    return {
      kindred: null,
    };
  },

  async mounted() {
    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }
    let kindredId = window.location.href.split("/")[6];

    this.$q.loading.show({
      delay: 450, // ms
    });

    this.kindred = await this.$axios
      .get(baseUrl + "/vampires/myVampire/" + kindredId, {
        withCredentials: true,
      })
      .then((resp) => {
        this.$q.loading.hide();
        return resp.data;
      })
      .catch((err) => {
        console.log(err);
        return "Not found!";
      });

    console.log(this.kindred);
  },

  methods: {
    truncate(value, length) {
      if (value.length > length) {
        return value.substring(0, length) + "...";
      } else {
        return value;
      }
    },
  },
};
</script>
