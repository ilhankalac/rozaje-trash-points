<template>
<div>
  <l-map style="height: 900px; width:100%; z-index:1;" :zoom="zoom" :center="center" @click="addMarker">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker v-for="item in markerLatLng" :lat-lng="item" :key="item.key">
        <l-popup>Test</l-popup>
    </l-marker>
  </l-map>
  <v-dialog v-model="dialog" width="500px">
    <TrashContainer :coords="markerLatLng[markerLatLng.length - 1]"/>
  </v-dialog>
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
            attribution:
                '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            zoom: 13,
            center: [51.505, -0.159],
            markerLatLng: [

            ],
            location: null,
            gettingLocation: false,
            errorStr: null,
            dialog: false,
            landFillsRef: firebase.database().ref("landfillPoints")
        };
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
            this.markerLatLng.push(event.latlng);
            this.dialog = true;
        },
        // getLandFills(){
        //     this.landFillsRef.on('value', (snapshot) => {
        //             for(const data in snapshot.val()){
        //                 const coords = snapshot.val()[data].coords;
        //                 this.markerLatLng.push({ lat: coords.latitude, lng: coords.longitude });
        //             }
        //         }, (errorObject) => {
        //             console.log('The read failed: ' + errorObject.name);
        //     }); 

        // }
    },

    async created() {
        this.gettingLocation = true;
        try {
            // this.getLandFills()
            this.gettingLocation = false;
            this.location = await this.getLocation();
            this.center = [
                this.location.coords.latitude,
                this.location.coords.longitude,
            ];
            // The center mark when the app starts
            // this.markerLatLng = [
            //     this.location.coords.latitude,
            //     this.location.coords.longitude,
            // ];
        } catch (e) {
            this.gettingLocation = false;
            this.errorStr = e.message;
        }
    },
    
};
</script>