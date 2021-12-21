<template>
    <div>
        <v-timeline>
            <v-timeline-item v-for="item in markerLatLng" :key="item.key">{{item.placeName}} - {{item.date}}</v-timeline-item>
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