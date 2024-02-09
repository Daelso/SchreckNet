<template>
  <div class="q-pa-md">tn island</div>
</template>

<style>
.my-card {
  width: 450px;
  max-width: 450px;
  display: flex;
  flex-flow: row wrap;
  color: white;
  background-color: #222831;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
  margin-right: 25px;
}

.banner {
  display: flex;
  justify-content: center;
  font-family: TMUnicorn;
  text-shadow: 3px 2px 3px black;
  font-size: 35px;
}

.backgroundDefault {
  background-color: #171a1e;
}
.base-info {
  display: flex;
  justify-content: center;
  align-content: center;
  margin: auto;
}

.right-side {
  max-width: 180px;
  overflow-wrap: break-word;
  color: white;
}

.attribute::first-letter {
  text-transform: capitalize;
}
.cards {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 800px) {
  .my-card {
    margin-bottom: 15px;
  }
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  components: {},
  name: "findAGame",
  async created() {
    if (window.location.href.includes("localhost")) {
      this.baseUrl = "http://localhost:5000";
    } else {
      this.baseUrl = window.location.origin;
    }
    return {
      baseUrl,
      router,
      currentUser,
    };
  },

  data() {
    return {
      baseUrl: "",
      currentUser,
    };
  },
  methods: {},
});
</script>
