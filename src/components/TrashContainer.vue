<template>
  <v-card class="trash-card">
    <div class="trash-header">
      <v-icon color="primary" class="mr-2">mdi-map-marker-plus</v-icon>
      <span>Unesi informacije o deponiji</span>
    </div>

    <input
      type="file"
      ref="input1"
      style="display: none"
      @change="previewImage"
      accept="image/*"
    />

    <div
      class="upload-zone"
      :class="{ 'has-image': img1 }"
      @click="click1"
    >
      <img v-if="img1" class="preview" :src="img1" />
      <div v-else-if="imageData != null" class="upload-placeholder">
        <v-progress-circular indeterminate color="primary" size="34"></v-progress-circular>
        <span class="mt-2">Otpremanje fotografije…</span>
      </div>
      <div v-else class="upload-placeholder">
        <v-icon size="40" color="primary">mdi-camera-plus-outline</v-icon>
        <span class="mt-2">Izaberi fotografiju deponije</span>
      </div>
    </div>

    <v-text-field
      label="Naziv mjesta"
      v-model="trash.placeName"
      outlined dense rounded hide-details
      prepend-inner-icon="mdi-map-marker-outline"
      class="mt-4"
    />
    <v-text-field
      label="Detaljan opis"
      v-model="trash.description"
      outlined dense rounded hide-details
      prepend-inner-icon="mdi-text"
      class="mt-3"
    />

    <div class="picker-label mt-4">Datum</div>
    <v-date-picker
      label="Datum"
      v-model="trash.date"
      color="primary"
      full-width
      class="trash-picker"
    ></v-date-picker>

    <v-checkbox
      label="Deponija je očišćena"
      v-model="trash.isCleaned"
      color="success"
      hide-details
      class="mt-2"
    />

    <v-btn
      color="primary"
      depressed
      rounded
      block
      large
      class="text-none font-weight-medium mt-5"
      :disabled="!img1"
      @click="create"
    >
      <v-icon left small>mdi-content-save</v-icon>
      Sačuvaj deponiju
    </v-btn>
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

<style scoped>
.trash-card {
  padding: 24px;
  border-radius: 20px !important;
  background: var(--v-surface-base) !important;
}
.trash-header {
  display: flex;
  align-items: center;
  font-size: 1.15rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 18px;
}
.upload-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  border-radius: 16px;
  border: 2px dashed rgba(147, 195, 77, 0.4);
  background: rgba(147, 195, 77, 0.06);
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.upload-zone:hover {
  border-color: rgba(147, 195, 77, 0.7);
  background: rgba(147, 195, 77, 0.1);
}
.upload-zone.has-image {
  border-style: solid;
  border-color: var(--line, rgba(255, 255, 255, 0.08));
  background: #0b1712;
}
.preview {
  width: 100%;
  max-height: 260px;
  object-fit: cover;
  display: block;
}
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #94a3b8;
  font-size: 0.85rem;
}
.picker-label {
  font-size: 0.75rem;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 6px;
}
.trash-picker {
  border-radius: 14px;
  overflow: hidden;
}
</style>
