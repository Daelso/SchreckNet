<template>
  <q-layout view="hhh lpR lfr">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title
          style="font-family: TMUnicorn; text-shadow: 3px 2px 3px black"
          class="text-secondary"
        >
          <router-link to="/" class="titleLogo">SchreckNet</router-link>
        </q-toolbar-title>

        <q-item
          v-if="!logInCheck"
          clickable
          to="/login"
          style="align-items: center"
        >
          <q-item-section>Login</q-item-section>
        </q-item>

        <q-item
          v-if="!logInCheck"
          clickable
          to="/register"
          style="align-items: center"
        >
          <q-item-section>Register</q-item-section>
        </q-item>

        <q-item
          v-if="logInCheck"
          clickable
          style="align-items: center"
          @click="toggleRightDrawer"
        >
          <q-avatar>
            <img src="../assets/images/Nosfer_logo.png" />
          </q-avatar>
        </q-item>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      overlay
      style="background-color: #171a1e; border-color: red"
    >
      <q-list>
        <q-item-label header> Create a Character </q-item-label>
        <EssentialLink />
        <comingSoonLinks />
        <!-- <q-item-label header> Play the World of Darkness </q-item-label> -->
        <!-- <q-item clickable style="color: red" :to="{ name: 'findGame' }">
          <q-item-section avatar>
            <q-icon color="secondary" name="casino" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Find/Create a Game</q-item-label>
            <q-item-label caption style="color: white"
              >Find a group to play with or host a game of your
              own</q-item-label
            >
          </q-item-section>
        </q-item> -->
        <q-item-label header> Search Characters and Games </q-item-label>
        <q-item clickable style="color: red" :to="{ name: 'baseSearch' }">
          <q-item-section avatar>
            <q-icon color="secondary" name="search" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Search all Characters</q-item-label>
            <q-item-label caption style="color: white"
              >Find a character for your next game</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-item clickable style="color: red" :to="{ name: 'findGame' }">
          <q-item-section avatar>
            <q-icon color="secondary" name="groups" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Find and Create Games</q-item-label>
            <q-item-label caption style="color: white"
              >Find your next World of Darkness game</q-item-label
            >
          </q-item-section>
        </q-item>

        <socialLinks />
      </q-list>
    </q-drawer>

    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      overlay
      style="background-color: #171a1e; border-color: red"
    >
      <q-list>
        <q-item-label header> Profile Links </q-item-label>
        <suspense>
          <ProfileLinks />
        </suspense>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer
      class="bg-transparent text-white text-center"
      style="opacity: 35%"
    >
      <router-link to="/privacy">Privacy</router-link> |
      <router-link to="/terms">Terms of Use</router-link> |
      <router-link to="/contact">Contact</router-link> |
      <router-link to="/darkpack">Dark Pack</router-link>
    </q-footer>
  </q-layout>
</template>

<style>
a,
a:visited,
a:hover,
a:active {
  color: inherit;
  text-decoration: none;
}
@media only screen and (max-width: 600px) {
  .titleLogo {
    font-size: smaller;
  }
}
</style>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/links/EssentialLink.vue";
import ProfileLinks from "components/links/profileLinks.vue";
import comingSoonLinks from "components/links/comingSoonLinks.vue";
import socialLinks from "components/links/socialLinks.vue";
import ankh from "../assets/images/ankh.png";
import whiteAnkh from "../assets/images/ankhWhite.png";
import claws from "../assets/images/claws.png";
import whiteClaws from "../assets/images/whiteClaws.png";

import mage from "../assets/images/mage.png";
import hunter from "../assets/images/hunter.png";
import whiteHunter from "../assets/images/whiteHunter.png";

import changeling from "../assets/images/changeling.png";
import wod from "../assets/images/WoDLogo.png";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
    ProfileLinks,
    comingSoonLinks,
    socialLinks,
  },

  setup() {
    const $q = useQuasar();
    const myIcons = {
      "app:ankh": `img:${ankh}`,
      "app:whiteankh": `img:${whiteAnkh}`,
      "app:claws": `img:${claws}`,
      "app:whiteClaws": `img:${whiteClaws}`,
      "app:mage": `img:${mage}`,
      "app:hunter": `img:${hunter}`,
      "app:whiteHunter": `img:${whiteHunter}`,
      "app:changeling": `img:${changeling}`,
      "app:wod": `img:${wod}`,
    };
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    let currentUser = ref(false);
    let loggedIn = ref(false);

    $q.iconMapFn = (iconName) => {
      const icon = myIcons[iconName];
      if (icon !== void 0) {
        return { icon: icon };
      }
    };

    return {
      currentUser,
      loggedIn,
      ankh,
      claws,
      mage,
      hunter,
      changeling,
      wod,
      whiteAnkh,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      },
    };
  },

  computed: {
    logInCheck() {
      if (this.currentUser != false) {
        return true;
      } else {
        return false;
      }
    },
  },

  async mounted() {
    this.currentUser = await this.$api
      .get("/user/currentUser", {
        withCredentials: true,
      })
      .then((resp) => {
        return resp.data;
      });
  },

  watch: {
    $route() {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    },
  },
});
</script>
