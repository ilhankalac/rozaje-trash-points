<template>
    <div class="container">
        <v-row style="margin-top:4px;">
          <v-col cols="10" dark>
            <v-text-field 
              v-model="searchText" 
              @keyup="filter(false)"
              clearable
              @click:clear="filter(true)"
              dark label="Pretraži" 
            ></v-text-field>
          </v-col>
          <v-col cols="2" style="margin-top:7px;">
            <v-btn
              depressed
              @click="openAndClosePanel(0)"
            >
              <v-icon>mdi-filter</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row style="margin-top:-20px;">
          <v-expansion-panels flat v-model="openedPanel"> 
            <v-expansion-panel style="background: #2C3E50; color: white;">
              <v-expansion-panel-header hide-actions>
                
              </v-expansion-panel-header>
              <v-expansion-panel-content style="margin-top:-30px;">
                Lorem ipsum dolor sait amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
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
            { title: 'Očišćeno' },
            { title: 'Click Me' },
            { title: 'Click Me 2' },
          ],
          tempMarkerLatLng: [],
          openedPanel: null
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
      openAndClosePanel (index) {
        this.openedPanel = this.openedPanel === null ? index : null;
      }
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