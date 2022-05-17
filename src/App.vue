


<template>
  <v-app id="app">
    <div class="topnav">
      <h4 class="topNavH">Lokalizovanje deponija Rožajske teritorije</h4>
    </div>
    <router-view/>
  </v-app>
</template>

<script>



export default {
    name: "App",
    components: {
    },
    methods:{
      openDialog(){
        this.dialog = true;
      }
    }
};
</script>

<style>


</style>
