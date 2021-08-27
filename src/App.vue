<template>
  <div id="app">
      <v-row>
        <v-col md="6" sm="12">
          <GeoLocation msg="Welcome to Your Vue.js App"/>
        </v-col>
        <v-col md="6" sm="12">
          <TrashContainer />
        </v-col>
      </v-row>
  </div>
</template>

<script>
import GeoLocation from "./components/GeoLocation.vue";
import TrashContainer from "./components/TrashContainer.vue";

export default {
    name: "App",
    components: {
        GeoLocation,
        TrashContainer,
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
