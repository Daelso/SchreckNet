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
        path: "/register",
        component: () => import("pages/registry/registerPage.vue"),
      },
      {
        name: "login",
        path: "/login",
        component: () => import("pages/registry/loginPage.vue"),
      },
      {
        name: "passwordForgot",
        path: "passwordForgot",
        component: () => import("pages/registry/passwordForgot.vue"),
      },
      {
        name: "passwordReset",
        path: "passwordReset/:user",
        component: () => import("pages/registry/passwordReset.vue"),
      },
      {
        name: "activateAccount",
        path: "activateAccount",
        component: () => import("pages/registry/activateAccount.vue"),
      },
      {
        name: "privacyPolicy",
        path: "privacy",
        component: () => import("pages/policy/privacyPolicy.vue"),
      },
      {
        name: "termsofuse",
        path: "terms",
        component: () => import("pages/policy/termsOfUse.vue"),
      },
      {
        name: "contact",
        path: "contact",
        component: () => import("pages/policy/contact.vue"),
      },
      {
        name: "darkpack",
        path: "darkpack",
        component: () => import("pages/policy/darkpack.vue"),
      },
      {
        name: "vampire5e",
        path: "vampire/5e",
        component: () => import("pages/character_creator/vtm/vamp5e.vue"),
      },
      {
        name: "hunter5e",
        path: "hunter/5e",
        component: () =>
          import("pages/character_creator/hunter/5eHunterView.vue"),
      },
      {
        name: "vampire5eView",
        path: "vampire/5e/:id",
        component: () => import("pages/character_creator/vtm/5eVampView.vue"),
      },
      {
        name: "editVampire",
        path: "vampire/5e/edit/:id",
        component: () => import("pages/character_creator/vtm/editVamp.vue"),
      },
      {
        name: "hunter5eView",
        path: "hunter/5e/:id",
        component: () => import("pages/character_creator/hunter/hunter.vue"),
      },
      {
        name: "garou5eView",
        path: "werewolf/5e/:id",
        component: () =>
          import("pages/character_creator/werewolf/5eWerewolfView.vue"),
      },
      {
        name: "editHunter",
        path: "hunter/5e/edit/:id",
        component: () =>
          import("pages/character_creator/hunter/editHunter.vue"),
      },
      {
        name: "myVamps",
        path: "vampire/5e/profile/:id",
        component: () => import("pages/character_creator/vtm/myChars.vue"),
      },
      {
        name: "myHunts",
        path: "hunter/5e/profile/:id",
        component: () => import("pages/character_creator/hunter/myChars.vue"),
      },
      {
        name: "myGarou",
        path: "garou/5e/profile/:id",
        component: () => import("pages/character_creator/werewolf/myChars.vue"),
      },
      {
        name: "myFavs",
        path: "/myFavorites",
        component: () => import("pages/myFavs.vue"),
      },
      {
        name: "baseSearch",
        path: "/search",
        component: () => import("pages/search/baseSearch.vue"),
      },
      {
        name: "garou5e",
        path: "werewolf/5e",
        component: () =>
          import("pages/character_creator/werewolf/werewolf.vue"),
      },
      {
        name: "editGarou",
        path: "werewolf/5e/edit/:id",
        component: () =>
          import("pages/character_creator/werewolf/editGarou.vue"),
      },
      {
        name: "findGame",
        path: "game/find",
        component: () => import("pages/game_finder/find_a_game.vue"),
      },
      {
        name: "myGames",
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
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
