<template>
  <v-card style="padding:5%">
    <h2>Unesi informacije o deponiji</h2>
    <v-text-field label="Naziv mjesta" v-model="trash.placeName"/>
    <v-text-field label="Datum" v-model="trash.date"/>
    <v-text-field label="Detaljan opis" v-model="trash.description"/>
    <v-btn @click="save()">Sačuvaj</v-btn>
  </v-card>
</template>

<script>
import firebase from 'firebase'

import { landfillPointsRef } from "../firebase/firebase"

export default {
  props:[
    "coords",
  ],
  data() {
    return {
      trash:{
        placeName: "",
        date: "",
        description: "",
      },
      database: firebase.database()
  };
  },
  methods:{
    save(){
      this.trash["coords"] = { latitude: this.coords.lat, longitude: this.coords.lng }
      landfillPointsRef.push(this.trash)
    }
  }
};
</script>