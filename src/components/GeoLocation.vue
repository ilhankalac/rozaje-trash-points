<template>
<div>
    <div>
        <l-map class="leaflet-canvas" :zoom="zoom" :center="center" @click="addMarker">
            <div class="box"> 
                <v-card style="padding: 5px;">
                    <h3>Nesređene deponije: {{$store.state.markerLatLng.length}} </h3>
                    <h3>Sređene deponije: {{$store.state.markerLatLng.filter(item => item.isCleaned).length}}  </h3>
                    <h2>Ukupno: {{$store.state.markerLatLng.filter(item => !item.isCleaned).length}}  </h2>
                </v-card>
            </div>
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker v-for="item in $store.state.markerLatLng" :lat-lng="[item.coords.latitude, item.coords.longitude]" :key="item.key">
                <l-popup>
                    <div>
                        <h3>{{item.placeName}} - {{item.date}}</h3>
                        <img style="max-width: 200px; text-align:center" 
                            :src="item.post.photo" 
                            alt="Italian Trulli"
                            @click="openPhotoDialog(item.post.photo)"
                        >
                    </div>
                </l-popup>
                <l-icon
                    :icon-url="`https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${item.markerColor}.png`"
                />
            </l-marker>
        </l-map>
        <v-dialog v-model="dialog" width="500px" :key="Math.random()">
            <TrashContainer @saveData="saveData($event)"/>
        </v-dialog>
         <v-dialog v-model="photoDialog" width="80%">
            <img :src="selectedPhoto" alt="">
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
import {eventBus} from "../main.js";


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
            selectedCoords: [],
            photoDialog: false,
            selectedPhoto: "",
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
            this.$store.state.markerLatLng = this.markerLatLng;
        },
        centerOnSelectedPoint(){
            const selectedItem = this.$store.state.selectedPoint;
            this.center = [selectedItem.coords.latitude,  selectedItem.coords.longitude]
        },
        openPhotoDialog(url){
            this.selectedPhoto = url;
            this.photoDialog = true;
        },
    },

    async created() {

        eventBus.$on('fireMethod', () => {
            this.centerOnSelectedPoint();
        })

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
            this.$store.state.markerLatLng = this.markerLatLng;

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
.box{
    position: absolute;
    top: 0;
    z-index: 9999;
    text-align: center;
    width: 200px;
    right: 0%;
    margin-left: -75x; /* half of the width */
    text-align: left;
}
</style>