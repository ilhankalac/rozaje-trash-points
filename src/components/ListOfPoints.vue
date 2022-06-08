<template>
    <div class="container">
        <v-row style="margin-top:4px;">
          <v-col cols="10" dark>
            <v-text-field 
              v-model="search.global" 
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
        <v-progress-circular
            v-if="$store.state.markerLatLng.length === 0"
            indeterminate
            :size="50"
            color="green"
        ></v-progress-circular>
        <v-row 
          v-if="showPanel"
          style="margin-top:-20px; background:#243342; padding: 20px; margin-bottom: 2px;" 
        >
          <v-col>
            <h4>Napredna pretraga</h4>
            <v-text-field 
                v-model="search.placeName" 
                clearable
                dark label="Naziv mjesta" 
            ></v-text-field>
            <v-text-field 
                v-model="search.description" 
                clearable
                dark label="Opis" 
            ></v-text-field>
            <v-row>
              <v-col cols="6"></v-col>
              <v-col>
                <v-date-picker 
                    v-model="search.date" 
                    clearable
                    dark label="Datum" 
                    style="text-align:center;"
                    :range="true"
                ></v-date-picker>
              </v-col>
            </v-row> <br>
            <v-btn @click="createReport">Pretraži <v-icon>mdi-magnify</v-icon></v-btn>

          </v-col>
          
        </v-row>
        <v-timeline 
          v-if="$store.state.markerLatLng.length > 0"
          dense dark 
          color="dark"
        >
            <div
              v-for="item in $store.state.markerLatLng "
              :key="item.key"
              @click="selectItem(item);"
              class="timeline-item"
            >
              <v-timeline-item 
                style="padding-top: 20px;"
                :color="item.isCleaned ? 'green' : 'red'"
              >
                  <h3 style="text-align:left; padding-top: 5px">{{item.placeName.toUpperCase()}} ({{ item.date | formatDate }})</h3>
              </v-timeline-item>
            </div>
        </v-timeline>
    </div>
</template>

<script>
import { landfillPointsRef } from '../firebase/firebase';
import {eventBus} from "../main.js";
import moment from 'moment'

export default {
    data() {
      return {
          markerLatLng: [],
          tempMarkerLatLng: [],
          openedPanel: null,
          showPanel: false,
          search: {
            global: "",
            placeName: "",
            description: "",
            date: [new Date().toISOString().substr(0, 10)],
          },
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
        clear ? this.search.global = "" : null;
        this.$store.state.markerLatLng  = this.tempMarkerLatLng.filter(element => element.placeName.toLowerCase().includes(this.search.global.toLowerCase()))
      },
      openAndClosePanel (index) {
        this.showPanel = !this.showPanel;
        this.openedPanel = this.openedPanel === null ? index : null;
      },
      createReport(){
        let date1, date2;


        console.log(this.search.date);
        [date1, date2] = this.search.date;


        date1 = moment(date1).valueOf();

        if(date2)
          date2 = moment(date2).valueOf();
        else 
          date2 = date1;

        let temp;
        
        if(date1 < date2){
          temp = date1;
          date1 = date2;
          date2 = temp;
        }
        // Filtering array by date range
        this.$store.state.markerLatLng = this.tempMarkerLatLng.filter(element => element.date <= date1 && element.date >= date2)
  
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