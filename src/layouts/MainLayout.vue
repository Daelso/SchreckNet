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
          <router-link to="/">SchreckNet (Alpha)</router-link>
        </q-toolbar-title>

        <q-item v-if="!logInCheck" clickable>
          <router-link to="/login">Login</router-link>
        </q-item>

        <q-item v-if="!logInCheck" clickable>
          <router-link to="/register">Register</router-link>
        </q-item>

        <q-item v-if="logInCheck" clickable>
          <q-avatar @click="toggleRightDrawer">
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

        <ProfileLinks />
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
</style>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/links/EssentialLink.vue";
import ProfileLinks from "components/links/profileLinks.vue";
import comingSoonLinks from "components/links/comingSoonLinks.vue";
import socialLinks from "components/links/socialLinks.vue";
import ankh from "../assets/images/ankh.png";
import claws from "../assets/images/claws.png";
import mage from "../assets/images/mage.png";
import hunter from "../assets/images/hunter.png";
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
      "app:claws": `img:${claws}`,
      "app:mage": `img:${mage}`,
      "app:hunter": `img:${hunter}`,
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
    const axios = require("axios");

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
        return resp.data;
      });
  },
});
</script>
