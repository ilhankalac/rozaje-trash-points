<template>
<div>
    <div>
        <l-map class="leaflet-canvas" :zoom="zoom" :center="center" @click="addMarker">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker v-for="item in markerLatLng" :lat-lng="[item.coords.latitude, item.coords.longitude]" :key="item.key">
                <l-popup>
                    <div>
                        <h3>{{item.placeName}} - {{item.date}}</h3>
                        <img style="max-width: 200px; text-align:center" :src="item.post.photo" alt="Italian Trulli">
                    </div>
                </l-popup>
                <l-icon
                    :icon-url="`https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${item.markerColor}.png`"
                />
            </l-marker>
        </l-map>
        <v-dialog v-model="dialog" width="500px">
            <TrashContainer @saveData="saveData($event)"/>
        </v-dialog>
        <!-- <p v-for="item in markerLatLng" :key="item.key">{{item}}</p> -->
    </div>
    
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






import firebase from 'firebase'
import { landfillPointsRef } from '../firebase/firebase';
import { LIcon } from "vue2-leaflet";
export default {
    name: "GeoLocation",
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        TrashContainer,
        LIcon
    },
    data() {
        return {
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            zoom: 14,
            center: [42.842649, 20.166717],
            markerLatLng: [

            ],
            location: null,
            gettingLocation: false,
            errorStr: null,
            dialog: false,
            selectedCoords: []
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
            this.selectedCoords = {
                latitude: event.latlng.lat, 
                longitude: event.latlng.lng
            }

            this.dialog = true;
        },
        saveData(data){
            data["coords"] = this.selectedCoords;
            landfillPointsRef.push(data);
            this.dialog = false;
        },
    },

    async created() {

        this.gettingLocation = true;
        try {
            // this.getLandFills()
            this.gettingLocation = false;
            // this.location = await this.getLocation();
            // Centering the map in current location, this will be changed to Rozaje center
            this.center = [
                // this.location.coords.latitude,
                // this.location.coords.longitude,

                // Coordinates of Rozaje
                42.842649, 20.166717
            ];
        } catch (e) {
            this.gettingLocation = false;
            this.errorStr = e.message;
        }
    },
   
    
};
</script>
<style scoped>
.leaflet-canvas{
    height: 900px; 
    margin-top:30px;
    width:100%;
    z-index:1;
    padding-left:10px;
    border-radius: 5px;
}
</style>