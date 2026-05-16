<template>
  <div class="q-pa-md" style="max-width: 1400px">
    <div class="banner">Elysium's Newest Kindred</div>

    <div class="vamps">
      <Suspense>
        <template #default>
          <vampCards :currentUser="currentUser" />
        </template>

        <template #fallback>
          <div class="row q-col-gutter-md">
            <q-skeleton
              type="rect"
              width="250px"
              height="350px"
              v-for="n in 3"
              :key="n"
            />
          </div>
        </template>
      </Suspense>
    </div>

    <div class="banner q-my-md">Recent Lupine Sightings</div>

    <div class="vamps">
      <Suspense>
        <template #default>
          <garouCards :currentUser="currentUser" />
        </template>

        <template #fallback>
          <div class="row q-col-gutter-md">
            <q-skeleton
              type="rect"
              width="250px"
              height="350px"
              v-for="n in 3"
              :key="n"
            />
          </div>
        </template>
      </Suspense>
    </div>

    <div class="banner q-my-md">Beware these Hunters</div>

    <div class="vamps">
      <Suspense>
        <template #default>
          <huntCards :currentUser="currentUser" />
        </template>

        <template #fallback>
          <div class="row q-col-gutter-md">
            <q-skeleton
              type="rect"
              width="250px"
              height="350px"
              v-for="n in 3"
              :key="n"
            />
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script>
import nosImage from "../assets/images/Nosfer_logo.png";
import vampCards from "./character_creator/vtm/vampireCards.vue";
import huntCards from "./character_creator/hunter/hunterCards.vue";
import garouCards from "./character_creator/werewolf/garouCards.vue";

import { useMeta } from "quasar";

export default {
  components: { vampCards, huntCards, garouCards },

  created() {
    useMeta({
      title: "SchreckNet",
      titleTemplate: (title) => `${title}`,
      meta: {
        keywords: {
          name: "keywords",
          content:
            "vtm, character creator, vtm5e, vampire the masquerade, schrecknet, WoD, world of darkness, w5, werewolf the apocalypse, hunter the reckoning, htr",
        },
      },
    });
  },
  data() {
    return { currentUser: false };
  },
  async mounted() {
    try {
      const resp = await this.$api.get("/user/currentUser", {
        withCredentials: true,
      });

      this.currentUser = resp.data;

      if (resp.data.activated != 1) {
        this.$q.notify({
          message:
            "Account not yet activated! It may be closed in 60 days if not made active.",
          color: "primary",
          avatar: nosImage,
          timeout: 25000,
          actions: [
            {
              label: "Re-send email",
              color: "secondary",
              handler: this.resendActivation,
            },
            { label: "Dismiss", color: "white" },
          ],
        });
      }
    } catch (err) {
      console.error("Failed to fetch current user", err);
    }
  },
  methods: {
    async resendActivation() {
      try {
        await this.$api.post(
          "/user/resendActivation",
          {},
          { withCredentials: true }
        );
        this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Email resent!",
        });
      } catch (err) {
        console.log(err);
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: `Failed to send email, please try again later.`,
        });
      }
    },
  },
};
</script>

<style>
.vamps {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  min-height: 300px;
}
@media (max-width: 800px) {
  .vamps {
    flex-direction: column;
    min-height: 200px;
  }
  .banner {
    font-size: 1.5em;
  }
}
.placeholder-card {
  width: 250px;
  height: 350px;
  background: #333;
  margin-right: 1em;
  border-radius: 12px;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
</style>
