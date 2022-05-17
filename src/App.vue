


<template>
  <v-app id="app">
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
