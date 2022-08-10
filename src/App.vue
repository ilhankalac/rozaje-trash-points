


<template>
  <v-app id="app">
    <div class="topnav">
      <h4 class="topNavH">Lokalizovanje deponija Rožajske teritorije</h4>
      <v-btn v-if="$store.state.user" style="float:right; margin: 20px;" @click="logout">Odjavi se</v-btn>
    </div>
    <router-view/>
  </v-app>
</template>

<script>

import firebase from 'firebase'

export default {
    name: "App",
    components: {
    },
    methods:{
      openDialog(){
        this.dialog = true;
      },
      logout(){
        firebase
        .auth()
        .signOut()
        .then(() => {
          this.$store.state.user = null;
          this.$router.push({
            name: "Login"
          });
        });

      }
    }
};
</script>

<style>
.topnav{
  width: 100%;
}


</style>
