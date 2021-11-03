<template>
<div>
  <l-map style="height: 900px; width:100%; z-index:1;" :zoom="zoom" :center="center" @click="addMarker">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker v-for="item in markerLatLng" :lat-lng="[item.coords.latitude, item.coords.longitude]" :key="item.key">
        <l-popup>Test</l-popup>
    </l-marker>
  </l-map>
  <v-dialog v-model="dialog" width="500px">
    <TrashContainer :coords="markerLatLng[markerLatLng.length - 1]"/>
  </v-dialog>
  <p v-for="item in markerLatLng" :key="item.key">{{item}}</p>
</div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import TrashContainer from "./TrashContainer.vue";
// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

import firebase from 'firebase'
import { landfillPointsRef } from '../firebase/firebase';

export default {
    name: "GeoLocation",
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        TrashContainer
    },
    data() {
        return {
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            zoom: 13,
            center: [51.505, -0.159],
            markerLatLng: [

            ],
            location: null,
            gettingLocation: false,
            errorStr: null,
            dialog: false,
        };
    },
    firebase:{
        markerLatLng: landfillPointsRef 
    },
    methods: {
        async getLocation() {
            return new Promise((resolve, reject) => {
                if (!("geolocation" in navigator)) {
                    reject(new Error("Geolocation is not available."));
                }
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        resolve(pos);
                    },
                    (err) => {
                        reject(err);
                    }
                );
            });
        },
        addMarker(event) {
            const trash = { 
                placeName: "",
                date: "",
                description: "", 
                coords:{
                    latitude: event.latlng.lat, 
                    longitude: event.latlng.lng
                }
            }
            landfillPointsRef.push(trash)
        },
    },

    async created() {
        this.gettingLocation = true;
        try {
            // this.getLandFills()
            this.gettingLocation = false;
            this.location = await this.getLocation();
            // Centering the map in current location, this will be changed to Rozaje center
            this.center = [
                this.location.coords.latitude,
                this.location.coords.longitude,
            ];
        } catch (e) {
            this.gettingLocation = false;
            this.errorStr = e.message;
        }
    },
    
};
</script>