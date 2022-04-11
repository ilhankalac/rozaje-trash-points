<template>
    <div class="container">
        <h2>Akcije</h2>
        <v-timeline dense>
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
export default {
    data() {
      return {
          markerLatLng: [],
    };
    },
    firebase:{
        markerLatLng: landfillPointsRef 
    },

    methods:{
      selectItem(item){
        console.log(item);
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

/* Optional: show position indicator in red */


</style>