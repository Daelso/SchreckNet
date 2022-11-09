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

        <q-toolbar-title style="font-family: TMUnicorn">
          <router-link to="/">SchreckNet</router-link>
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
      show-if-above
      style="background-color: #171a1e; border-color: red"
    >
      <q-list>
        <q-item-label header> Create a Character </q-item-label>
        <EssentialLink />
        <q-item-label header> Coming Soon </q-item-label>
        <q-item style="color: red">
          <q-item-section avatar>
            <q-icon color="secondary" name="app:ankh" style="scale: 180%" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Vampire: The Masquerade</q-item-label>
            <q-item-label caption style="color: white">20th</q-item-label>
          </q-item-section>
        </q-item>
        <q-item style="color: red">
          <q-item-section avatar>
            <q-icon color="secondary" name="app:claws" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Werewolf the Apocalypse</q-item-label>
            <q-item-label caption style="color: white">20th/5E</q-item-label>
          </q-item-section>
        </q-item>
        <q-item style="color: red">
          <q-item-section avatar>
            <q-icon color="secondary" name="app:hunter" style="scale: 145%" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Hunter the Reckoning</q-item-label>
            <q-item-label caption style="color: white">1E/5E</q-item-label>
          </q-item-section>
        </q-item>
        <q-item style="color: red">
          <q-item-section avatar>
            <q-icon color="secondary" name="app:mage" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Mage the Ascension</q-item-label>
            <q-item-label caption style="color: white">20th/5E</q-item-label>
          </q-item-section>
        </q-item>
        <q-item style="color: red">
          <q-item-section avatar>
            <q-icon
              color="secondary"
              name="app:changeling"
              style="scale: 150%"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>Changeling: The Dreaming</q-item-label>
            <q-item-label caption style="color: white">20th</q-item-label>
          </q-item-section>
        </q-item>
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
import EssentialLink from "components/EssentialLink.vue";
import ProfileLinks from "components/profileLinks.vue";
import ankh from "../assets/images/ankh.png";
import claws from "../assets/images/claws.png";
import mage from "../assets/images/mage.png";
import hunter from "../assets/images/hunter.png";
import changeling from "../assets/images/changeling.png";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
    ProfileLinks,
  },

  setup() {
    const $q = useQuasar();
    const myIcons = {
      "app:ankh": `img:${ankh}`,
      "app:claws": `img:${claws}`,
      "app:mage": `img:${mage}`,
      "app:hunter": `img:${hunter}`,
      "app:changeling": `img:${changeling}`,
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
