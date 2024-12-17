<template>
  <div class="q-pa-md" style="max-width: 1400px">
    <AdSense
      ad-client="ca-pub-2718109649710977"
      ad-slot="1234567890"
      :style="{ display: 'block', width: '100%', height: '200px' }"
    />
    <div class="banner">Elysium's Newest Kindred</div>

    <Suspense>
      <div class="vamps">
        <vampCards :currentUser="this.currentUser" />
      </div>
    </Suspense>

    <div class="banner q-my-md">Recent Lupine Sightings</div>
    <Suspense>
      <div class="vamps">
        <garouCards :currentUser="this.currentUser" />
      </div>
    </Suspense>

    <div class="banner q-my-md">Beware these Hunters</div>
    <Suspense>
      <div class="vamps">
        <huntCards :currentUser="this.currentUser" />
      </div>
    </Suspense>
  </div>
</template>

<style>
.banner {
  display: flex;
  justify-content: center;
  margin-bottom: 1em;
  font-family: TMUnicorn;
  text-shadow: 3px 2px 3px black;
  font-size: 2.8em;
}
.vamps {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}
@media (max-width: 800px) {
  .vamps {
    flex-direction: column;
  }
  .banner {
    font-size: 1.5em;
  }
}
</style>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import nosImage from "../assets/images/Nosfer_logo.png";
import vampCards from "./character_creator/vtm/vampireCards.vue";
import huntCards from "./character_creator/hunter/hunterCards.vue";
import garouCards from "./character_creator/werewolf/garouCards.vue";
import AdSense from "components/adsense/AdSense.vue";

import { useMeta } from "quasar";

const metaData = {
  title: "SchreckNet",
  titleTemplate: (title) => `${title}`,

  // meta tags
  meta: {
    keywords: {
      name: "keywords",
      content:
        "vtm, character creator, vtm5e, vampire the masquerade, schrecknet, WoD, world of darkness, w5, werewolf the apocalypse, hunter the reckoning, htr",
    },
  },
};

export default {
  components: { vampCards, huntCards, garouCards, AdSense },
  setup() {
    useMeta(metaData);

    const $q = useQuasar();
    const axios = require("axios");
    let currentUser = ref(false);

    return {
      currentUser,
    };
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
                handler: async () => {
                  let resend = await axios
                    .post(
                      baseUrl + "/user/resendActivation",
                      {},
                      {
                        withCredentials: true,
                      }
                    )
                    .then(() =>
                      this.$q.notify({
                        color: "green-4",
                        textColor: "white",
                        icon: "cloud_done",
                        message: "Email resent!",
                      })
                    )
                    .catch((err) => {
                      console.log(err);
                      this.$q.notify({
                        color: "red-5",
                        textColor: "white",
                        icon: "warning",
                        message: `Failed to send email, please try again later.`,
                      });
                    });
                },
              },
              {
                label: "Dismiss",
                color: "white",
              },
            ],
          });
        }
        return resp.data;
      });
  },
};
</script>
