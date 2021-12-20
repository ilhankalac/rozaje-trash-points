<template>
  <v-card style="padding:5%">
    <h2>Unesi informacije o deponiji</h2>

    <div v-if="imageData != null">
      <img class="preview" height="268" width="356" :src="img1" />
    </div>
    <v-text-field label="Naziv mjesta" v-model="trash.placeName" />
    <v-text-field label="Datum" v-model="trash.date" />
    <v-text-field label="Detaljan opis" v-model="trash.description" />
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
    <v-btn color="pink" :disabled="!img1" @click="create">Save</v-btn>
  </v-card>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      caption: "",
      img1: "",
      imageData: null,
      trash: {
        placeName: "",
        date: "",
        description: "",
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
      this.$emit("saveData", this.trash);
      this.trash = {};
    },
    click1() {
      this.$refs.input1.click();
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
