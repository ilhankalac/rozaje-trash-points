<template>
  <v-card style="padding:5%">
    <h2>Unesi informacije o deponiji </h2>
    <div>
      <v-btn @click="click1">Choose photo</v-btn>
      <input
        type="file"
        ref="input1"
        style="display: none"
        @change="previewImage"
        accept="image/*"
      />
    </div>
    <br />
    <div v-if="imageData != null">
      <img class="preview" height="268" width="356" :src="img1" />
    </div>
    <v-text-field label="Naziv mjesta" v-model="trash.placeName" />
    <v-date-picker label="Datum" v-model="trash.date" color="green lighten-1" value=""></v-date-picker>
    <v-text-field label="Detaljan opis" v-model="trash.description" />
    <v-checkbox label="Očišćen?" v-model="trash.isCleaned" />
  
    <v-btn color="pink" :disabled="!img1" @click="create">Save</v-btn>
  </v-card>
</template>


<script>


import firebase from "firebase";
import moment from 'moment'


export default {
  data() {
    return {
      caption: "",
      img1: "",
      imageData: null,
      trash: {
        placeName: "",
        date: new Date().toISOString().substr(0, 10),
        description: "",
        isCleaned: false
      },
    };
  },
  methods: {
    create() {
      const post = {
        photo: this.img1,
        caption: this.caption,
      };
      this.trash.post = post;

      // Reformatting date
      // const ddmmyyy = this.trash.date.split("-")
      // this.trash.date = `${ddmmyyy[2]}.${ddmmyyy[1]}.${ddmmyyy[0]}.`;
      this.trash.date = moment(this.trash.date).valueOf()

      // Marking point if is cleaned or not (red, green)
      this.trash.isCleaned ? this.trash.markerColor = "green" : this.trash.markerColor = "red";

      this.$emit("saveData", this.trash);
      this.trash = {};
      this.img1 = "";
      this.imageData = null;
    },
    click1() {
      this.$refs.input1.click();
    },
    currentDateTime() {
      return moment().toDate()
    },
    previewImage(event) {
      this.uploadValue = 0;
      this.img1 = null;
      this.imageData = event.target.files[0];
      this.onUpload();
    },
    onUpload() {
      this.img1 = null;
      const storageRef = firebase
        .storage()
        .ref(`${this.imageData.name}`)
        .put(this.imageData);
      storageRef.on(
        `state_changed`,
        (snapshot) => {
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          this.uploadValue = 100;
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            this.img1 = url;
            console.log(this.img1);
          });
        }
      );
    },
  },
};
</script>
