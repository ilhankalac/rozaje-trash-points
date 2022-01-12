<template>
  <v-app id="app">
    <div>
      <div class="topnav">
        <h2 class="topNavH">Lokalizovanje deponija Rožajske teritorije</h2>
      </div>
        <v-row style="background-color:#2c3e50">
          <v-col md="8" sm="12">
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
.topnav {
  background-color: #486684;
  overflow: hidden;
  height: 80px;
  position: relative;
}
.topNavH{
  color:white;
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
