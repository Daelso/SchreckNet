<template>
  <router-view />
</template>
<style>
body {
  background-color: #171a1e;
  color: #c4171d;
  font-family: monospace;
}
</style>

<script>
import { defineComponent } from "vue";
import axios from "axios";

let baseUrl = "";
if (window.location.href.includes("localhost")) {
  baseUrl = "http://localhost:5000";
} else {
  baseUrl = window.location.origin;
}

//Generates a new access token on every page from existing refresh token
axios.post(
  baseUrl + "/user/token",
  {},
  {
    withCredentials: true,
  }
);

export default defineComponent({
  name: "App",
});
</script>
