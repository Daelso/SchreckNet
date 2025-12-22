<template>
  <div v-if="this.hunter === null || this.hunter.length === 0" class="banner">
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
        class="q-my-md"
        label="Delete Selected"
        color="primary"
        @click="deleteConfirm()"
      ></q-btn>
    </div>
    <q-card
      v-for="hunt in this.filteredHunters"
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
            this.$router.push({ name: 'hunter5eView', params: { id: hunt.id } })
          "
        >
          View Full Character
        </q-btn>
        <q-checkbox
          v-model="hunt.checked"
          label="Select"
          @click="update_selected(hunt)"
        />
      </q-card-actions>
    </q-card>
  </div>
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

.banner {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
  font-family: TMUnicorn;
  text-shadow: 3px 2px 3px black;
  font-size: 35px;
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
export default {
  props: ["currentUser"],
  async created() {
    let id = window.location.href.split("/")[6];
    this.hunter = await this.$api
      .get("/hunters/myHunter/" + id, {
        withCredentials: true,
      })
      .then((resp) => {
        return resp.data;
      })
      .catch((err) => {
        console.log(err);
        return "Not found!";
      });
    this.hunter.forEach((hunt) => {
      hunt.checked = false;
    });

    // build unique folder list
    const seen = new Map();
    this.hunter.forEach((v) => {
      (v.folders || []).forEach((f) => {
        if (!seen.has(f.folder_id)) {
          seen.set(f.folder_id, f);
        }
      });
    });

    this.folderOptions = [...seen.values()];
  },

  data() {
    return {
      hunter: [],
      selected: [],
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
    update_selected(hunt) {
      if (hunt.checked) {
        if (!this.selected.includes(hunt.id)) {
          this.selected.push(hunt.id);
        }
      } else {
        this.selected = this.selected.filter((id) => id !== hunt.id);
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
              await this.$api.delete("/hunters/delete/" + id, {
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
        game_id: 2,
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
  },
  computed: {
    is_selected() {
      if (this.selected.length > 0) {
        return true;
      }
      return false;
    },
    filteredHunters() {
      if (!this.selectedFolder) {
        return this.hunter || [];
      }

      return (this.hunter || []).filter((v) =>
        (v.folders || []).some((f) => f.folder_id === this.selectedFolder)
      );
    },
  },
};
</script>
