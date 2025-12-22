<template>
  <div v-if="this.kindred === null || this.kindred.length === 0" class="banner">
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
    <q-select
      v-model="selectedFolder"
      :options="folderOptions"
      option-label="folder_name"
      option-value="folder_id"
      bg-color="grey-3"
      filled
      color="secondary"
      label-color="primary"
      clearable
      map-options
      emit-value
      dense
      popup-content-style="background-color:#222831; color:white"
      label="Filter by folder"
      class="q-mb-md"
      style="min-width: 250px"
    />

    <div>
      <q-btn
        v-if="this.is_selected"
        label="Delete Selected"
        color="primary"
        @click="deleteConfirm()"
      ></q-btn>
    </div>

    <div class="container">
      <q-card
        v-for="vamp in filteredKindred"
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
          style="display: flex; flex-direction: column; margin: auto"
        >
          <q-btn
            flat
            color="white"
            label="View Full Character"
            @click="
              this.$router.push({
                name: 'vampire5eView',
                params: { id: vamp.id },
              })
            "
          >
          </q-btn>
          <q-checkbox
            v-model="vamp.checked"
            label="Select"
            @click="update_selected(vamp)"
          />
        </q-card-actions>
      </q-card>
    </div>
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 450px;
  min-height: 500px; /* Adjust this value based on your needs */
  margin-right: 15px;
  color: white;
  background-color: #222831;
}

.card-content {
  flex-grow: 1; /* Ensures the content fills the available space */
  display: flex;
  flex-direction: column;
}

.card-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 0;
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
  async created() {
    this.kindred_id = window.location.href.split("/")[6];

    await this.load_kindred();
  },

  data() {
    return {
      kindred: null,
      selected: [],
      kindred_id: 0,
      selectedFolder: null,
      folderOptions: [],
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

    async load_kindred() {
      try {
        const kindred_req = await this.$api.get(
          "/vampires/myVampire/" + this.kindred_id,
          {
            withCredentials: true,
          }
        );

        this.kindred = kindred_req.data;
        this.kindred.forEach((vamp) => {
          vamp.checked = false;
        });

        // build unique folder list
        const seen = new Map();
        this.kindred.forEach((v) => {
          (v.folders || []).forEach((f) => {
            if (!seen.has(f.folder_id)) {
              seen.set(f.folder_id, f);
            }
          });
        });

        this.folderOptions = [...seen.values()];
      } catch (err) {
        console.log(err);
      }
    },
    update_selected(vamp) {
      if (vamp.checked) {
        if (!this.selected.includes(vamp.id)) {
          this.selected.push(vamp.id);
        }
      } else {
        this.selected = this.selected.filter((id) => id !== vamp.id);
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
              await this.$api.delete("/vampires/delete/" + id, {
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
  },
  computed: {
    is_selected() {
      if (this.selected.length > 0) {
        return true;
      }
      return false;
    },

    filteredKindred() {
      if (!this.selectedFolder) {
        return this.kindred || [];
      }

      return (this.kindred || []).filter((v) =>
        (v.folders || []).some((f) => f.folder_id === this.selectedFolder)
      );
    },
  },
};
</script>
