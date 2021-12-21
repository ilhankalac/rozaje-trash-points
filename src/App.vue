<template>
  <v-app id="app">
    <div>
        <v-row>
          <v-col md="6" sm="12">
            <GeoLocation :openDialog="openDialog" msg="Welcome to Your Vue.js App"/>
          </v-col>
          <v-col>
            <ListOfPoints style="max-width: 100%"></ListOfPoints>
          </v-col>
        </v-row>
    </div>
  </v-app>
</template>

<script>
import GeoLocation from "./components/GeoLocation.vue";
import ListOfPoints from "./components/ListOfPoints.vue";


export default {
    name: "App",
    components: {
        GeoLocation,
        ListOfPoints
    },
    methods:{
      openDialog(){
        this.dialog = true;
      }
    }
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
