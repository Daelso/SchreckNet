// meta.title feeds the tab title (App.vue). Pages that know more, like a
// character sheet, override it with their own useMeta.
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "home",
        path: "",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        name: "register",
        meta: { title: "Register" },
        path: "/register",
        component: () => import("pages/registry/registerPage.vue"),
      },
      {
        name: "login",
        meta: { title: "Log In" },
        path: "/login",
        component: () => import("pages/registry/loginPage.vue"),
      },
      {
        name: "passwordForgot",
        meta: { title: "Forgot Password" },
        path: "passwordForgot",
        component: () => import("pages/registry/passwordForgot.vue"),
      },
      {
        name: "passwordReset",
        meta: { title: "Reset Password" },
        path: "passwordReset/:user",
        component: () => import("pages/registry/passwordReset.vue"),
      },
      {
        name: "activateAccount",
        meta: { title: "Activate Account" },
        path: "activateAccount",
        component: () => import("pages/registry/activateAccount.vue"),
      },
      {
        name: "privacyPolicy",
        meta: { title: "Privacy Policy" },
        path: "privacy",
        component: () => import("pages/policy/privacyPolicy.vue"),
      },
      {
        name: "termsofuse",
        meta: { title: "Terms of Use" },
        path: "terms",
        component: () => import("pages/policy/termsOfUse.vue"),
      },
      {
        name: "contact",
        meta: { title: "Contact" },
        path: "contact",
        component: () => import("pages/policy/contact.vue"),
      },
      {
        name: "darkpack",
        meta: { title: "Dark Pack" },
        path: "darkpack",
        component: () => import("pages/policy/darkpack.vue"),
      },
      {
        name: "vampire5e",
        meta: { title: "VtM 5e Creator" },
        path: "vampire/5e",
        component: () => import("pages/character_creator/vtm/vamp5e.vue"),
      },
      {
        name: "hunter5e",
        meta: { title: "HtR 5e Creator" },
        path: "hunter/5e",
        component: () =>
          import("pages/character_creator/hunter/5eHunterView.vue"),
      },
      {
        name: "vampire5eView",
        meta: { title: "VtM 5e Character" },
        path: "vampire/5e/:id",
        component: () => import("pages/character_creator/vtm/5eVampView.vue"),
      },
      {
        name: "editVampire",
        meta: { title: "Edit Vampire" },
        path: "vampire/5e/edit/:id",
        component: () => import("pages/character_creator/vtm/editVamp.vue"),
      },
      {
        name: "hunter5eView",
        meta: { title: "HtR 5e Character" },
        path: "hunter/5e/:id",
        component: () => import("pages/character_creator/hunter/hunter.vue"),
      },
      {
        name: "garou5eView",
        meta: { title: "WtA 5e Character" },
        path: "werewolf/5e/:id",
        component: () =>
          import("pages/character_creator/werewolf/5eWerewolfView.vue"),
      },
      {
        name: "editHunter",
        meta: { title: "Edit Hunter" },
        path: "hunter/5e/edit/:id",
        component: () =>
          import("pages/character_creator/hunter/editHunter.vue"),
      },
      {
        name: "myVamps",
        meta: { title: "My Vampires" },
        path: "vampire/5e/profile/:id",
        component: () => import("pages/character_creator/vtm/myChars.vue"),
      },
      {
        name: "myHunts",
        meta: { title: "My Hunters" },
        path: "hunter/5e/profile/:id",
        component: () => import("pages/character_creator/hunter/myChars.vue"),
      },
      {
        name: "myGarou",
        meta: { title: "My Werewolves" },
        path: "garou/5e/profile/:id",
        component: () => import("pages/character_creator/werewolf/myChars.vue"),
      },
      {
        name: "myFavs",
        meta: { title: "My Favorites" },
        path: "/myFavorites",
        component: () => import("pages/myFavs.vue"),
      },
      {
        name: "baseSearch",
        meta: { title: "Search Characters" },
        path: "/search",
        component: () => import("pages/search/baseSearch.vue"),
      },
      {
        name: "garou5e",
        meta: { title: "WtA 5e Creator" },
        path: "werewolf/5e",
        component: () =>
          import("pages/character_creator/werewolf/werewolf.vue"),
      },
      {
        name: "editGarou",
        meta: { title: "Edit Werewolf" },
        path: "werewolf/5e/edit/:id",
        component: () =>
          import("pages/character_creator/werewolf/editGarou.vue"),
      },
      {
        name: "findGame",
        meta: { title: "Find a Game" },
        path: "game/find",
        component: () => import("pages/game_finder/find_a_game.vue"),
      },
      {
        name: "myGames",
        meta: { title: "My Games" },
        path: "game/my",
        component: () => import("pages/game_finder/my_games.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    name: "notFound",
    meta: { title: "Page Not Found" },
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
