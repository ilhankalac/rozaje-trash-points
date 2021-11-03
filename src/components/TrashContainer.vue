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
  };
  },
  methods:{
    save(){
      this.$emit("saveData", this.trash)
      this.trash = {};
    }
  }
};
</script>