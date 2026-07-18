<template>
  <div class="home">
    <v-row no-gutters class="home-row">
      <v-col md="8" cols="12" class="map-col">
        <GeoLocation
          :openDialog="openDialog"
          msg="Welcome to Your Vue.js App"
        />
      </v-col>
      <v-col md="4" cols="12" class="list-col">
        <ListOfPoints></ListOfPoints>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src

import GeoLocation from "../components/GeoLocation.vue";
import ListOfPoints from "../components/ListOfPoints.vue";

export default {
  name: "Home",
  components: {
    GeoLocation,
    ListOfPoints,
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
  },
};
</script>

<style scoped>
.home {
  min-height: calc(100vh - 72px);
}

.list-col {
  border-left: 1px solid rgba(255, 255, 255, 0.06);
}

@media (max-width: 959px) {
  .list-col {
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }
}
</style>
