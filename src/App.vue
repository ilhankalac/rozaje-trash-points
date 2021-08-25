<template>
  <div id="app">
    <v-container>
       <v-row class="mb-6">
        <v-col>
          <GeoLocation msg="Welcome to Your Vue.js App"/>
        </v-col>
        <v-col>
          <TrashContainer />
        </v-col>
      </v-row>
    </v-container>
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
    margin-top: 0;
}
</style>
