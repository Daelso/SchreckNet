<template>
  <div class="q-pa-md" style="max-width: 1400px">
    <a
      href="https://philadelphiabynight.net"
      target="_blank"
      rel="noopener noreferrer"
      class="pbn-ad"
    >
      <div class="pbn-ad__fog"></div>
      <div class="pbn-ad__accent"></div>
      <div class="pbn-ad__badge">
        <span aria-hidden="true">✦ </span>The City Hungers<span aria-hidden="true"> ✦</span>
      </div>
      <div class="pbn-ad__title">Philadelphia by Night</div>
      <div class="pbn-ad__hook">
        Three sects share these streets — bound by tradition, torn by ambition,
        and watching each other from every shadow.
      </div>
      <div class="pbn-ad__body">
        A free, browser-based V20 MUSH — step into a living world of deep
        immersive roleplay, sect politics, and stories shaped entirely by the
        players who inhabit them.
      </div>
      <div class="pbn-ad__cta">Enter the Night</div>
    </a>

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
.pbn-ad {
  display: block;
  background: linear-gradient(180deg, #1a0000 0%, #0d0d0d 100%);
  border: 1px solid rgba(227, 28, 37, 0.6);
  border-radius: 8px;
  padding: 28px 32px;
  text-align: center;
  position: relative;
  margin-bottom: 1.5em;
  text-decoration: none;
  overflow: hidden;
  animation: pbn-border-breathe 4s ease-in-out infinite;
}

.pbn-ad:hover,
.pbn-ad:focus-visible {
  border-color: #e31c25;
  animation: none;
  transition: border-color 0.4s ease;
}

.pbn-ad:focus-visible {
  outline: 2px solid #e31c25;
  outline-offset: 2px;
}

.pbn-ad__fog {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(227, 28, 37, 0.1) 0%,
    transparent 65%
  );
  pointer-events: none;
}

.pbn-ad__accent {
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #e31c25, transparent);
  animation: pbn-accent-shimmer 3s ease-in-out infinite;
}

.pbn-ad__badge {
  font-size: 11px;
  color: #e31c25;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 12px;
  font-weight: bold;
}

.pbn-ad__title {
  font-family: Georgia, serif;
  font-size: 22px;
  color: #e8d5b5;
  letter-spacing: 1px;
  margin-bottom: 6px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
}

.pbn-ad__hook {
  font-family: Georgia, serif;
  font-size: 14px;
  color: #997755;
  font-style: italic;
  margin-bottom: 14px;
}

.pbn-ad__body {
  font-size: 12px;
  color: #999;
  margin-bottom: 16px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.pbn-ad__cta {
  display: inline-block;
  background: linear-gradient(135deg, #b01020, #e31c25);
  color: white;
  padding: 10px 32px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  box-shadow: 0 4px 15px rgba(227, 28, 37, 0.3);
  transition: box-shadow 0.3s ease, transform 0.15s ease;
}

.pbn-ad:hover .pbn-ad__cta {
  box-shadow: 0 6px 25px rgba(227, 28, 37, 0.5);
  transform: translateY(-1px);
}

@keyframes pbn-border-breathe {
  0%,
  100% {
    border-color: rgba(227, 28, 37, 0.35);
  }
  50% {
    border-color: rgba(227, 28, 37, 0.7);
  }
}

@keyframes pbn-accent-shimmer {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pbn-ad,
  .pbn-ad__accent {
    animation: none;
  }
}

@media (max-width: 800px) {
  .pbn-ad {
    padding: 20px 16px;
  }
  .pbn-ad__title {
    font-size: 18px;
  }
  .pbn-ad__hook {
    font-size: 13px;
  }
}

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
