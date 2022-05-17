<template>
  <div>
    <div class="topnav">
      <router-link :to="'login'"> Login</router-link>
      <h4 class="topNavH">Lokalizovanje deponija Rožajske teritorije</h4>
    </div>
    <v-row style="background-color:#2c3e50">
      <v-col md="8" cols="12" xs="12">
        <GeoLocation
          :openDialog="openDialog"
          msg="Welcome to Your Vue.js App"
        />
      </v-col>
      <v-col>
        <ListOfPoints style="max-width: 100%"></ListOfPoints>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src

import GeoLocation from "../components/GeoLocation.vue";
import ListOfPoints from "../components/ListOfPoints.vue";

export default {
  name: "Home",
  components: {
    GeoLocation,
    ListOfPoints,
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #2c3e50;
}
.topnav {
  background-color: #486684;
  overflow: hidden;
  height: 80px;
  position: relative;
}
.topNavH {
  color: white;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
body::-webkit-scrollbar {
  display: none;
}
</style>
