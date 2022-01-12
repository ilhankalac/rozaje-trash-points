<template>
    <div>
        <v-timeline dense>
            <v-timeline-item v-for="item in markerLatLng" :key="item.key">
                <h2 style="text-align:left">{{item.placeName}} ({{item.date}})</h2>
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

</style>