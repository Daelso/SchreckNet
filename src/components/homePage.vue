<template>
  <div class="q-pa-md" style="max-width: 1200px">
    <div class="banner">Elysium's Newest Kindred</div>
    <Suspense>
      <div class="vamps">
        <vampCards />
      </div>
    </Suspense>
  </div>
</template>

<style>
.banner {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
  font-family: TMUnicorn;
  text-shadow: 3px 2px 3px black;
  font-size: 35px;
}
.vamps {
  display: flex;
  flex-direction: row;
}
@media (max-width: 800px) {
  .vamps {
    flex-direction: column;
  }
  .banner {
    font-size: 20px;
  }
}
</style>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import nosImage from "../assets/images/Nosfer_logo.png";
import vampCards from "./character_creator/vtm/vampireCards.vue";

export default {
  components: { vampCards },
  setup() {
    const $q = useQuasar();
    const axios = require("axios");
    let currentUser = ref(false);

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    return {
      currentUser,

      async onSubmit() {
        let meme = await axios
          .get(baseUrl + "/user/currentUser", {
            withCredentials: true,
          })
          .then((resp) => {
            return resp.data;
          });
        console.log(meme);
      },
    };
  },
  async mounted() {
    const axios = require("axios");
    const $q = useQuasar();

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }
    this.currentUser = await axios
      .get(baseUrl + "/user/currentUser", {
        withCredentials: true,
      })
      .then((resp) => {
        if (resp.data.activated != 1) {
          $q.notify({
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
                      $q.notify({
                        color: "green-4",
                        textColor: "white",
                        icon: "cloud_done",
                        message: "Email resent!",
                      })
                    )
                    .catch((err) => {
                      console.log(err);
                      $q.notify({
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
