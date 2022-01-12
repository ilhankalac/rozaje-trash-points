<template>
    <div class="container">
        <h2>Akcije</h2>
        <v-timeline dense>
            <v-timeline-item v-for="item in markerLatLng" :key="item.key">
                <h3 style="text-align:left">{{item.placeName.toUpperCase()}} ({{item.date}})</h3>
            </v-timeline-item>
        </v-timeline>
    </div>
</template>

<script>
import { landfillPointsRef } from '../firebase/firebase';
export default {
       data() {
        return {
            markerLatLng: []
        };
    },
    firebase:{
        markerLatLng: landfillPointsRef 
    },
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

/* Optional: show position indicator in red */


</style>