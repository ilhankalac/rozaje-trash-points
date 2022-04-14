<template>
    <div class="container">
        <h2>Akcije</h2>
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="9" dark>
            <v-text-field 
              v-model="searchText" 
              @keyup="filter(false)"
              clearable
              @click:clear="filter(true)"
              dark label="Pretraži" 
            ></v-text-field>
          </v-col>
          <v-col cols="2" style="margin-top:7px;">
            <div class="text-center">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    depressed
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-filter</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in items"
                    :key="index"
                  >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
          </div>
          </v-col>
        </v-row>
        <v-timeline dense dark color="dark">
            <div
              v-for="item in markerLatLng"
              :key="item.key"
              @click="selectItem(item)"
              class="timeline-item"
            >
              <v-timeline-item 
                style="padding-top: 20px;"
                :color="item.isCleaned ? 'green' : 'red'"
              >
                  <h3 style="text-align:left; padding-top: 5px">{{item.placeName.toUpperCase()}} ({{item.date}})</h3>
              </v-timeline-item>
            </div>
        </v-timeline>
    </div>
</template>

<script>
import { landfillPointsRef } from '../firebase/firebase';
import {eventBus} from "../main.js";


export default {
    data() {
      return {
          markerLatLng: [],
          searchText: "",
          items: [
            { title: 'Click Me' },
            { title: 'Click Me' },
            { title: 'Click Me' },
            { title: 'Click Me 2' },
          ],
      tempMarkerLatLng: []
    };
    },
    firebase:{
        markerLatLng: landfillPointsRef 
    },
    created(){
      this.tempMarkerLatLng = this.markerLatLng;
    },
    methods:{
      selectItem(item){
        this.$store.state.selectedPoint = item;
        eventBus.$emit('fireMethod');
      },
      filter(clear = false){
        clear ? this.searchText = "" : null;
        this.markerLatLng = this.tempMarkerLatLng.filter(element => element.placeName.toLowerCase().includes(this.searchText.toLowerCase()))
      },
    }
}
</script>

<style>
.container{
    overflow:scroll;
    overflow-x: hidden;
    max-height:94vh;
    background-color:#2c3e50;
    color:#e6e6e6;
}
::-webkit-scrollbar {
  width: 12px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #2c3e50; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #1b2631; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}

.timeline-item:hover{
  background: #243342;
  cursor: pointer;
  border-radius: 5px;
}

.theme--light.v-timeline:before {
    background: white;
}



/* Optional: show position indicator in red */


</style>