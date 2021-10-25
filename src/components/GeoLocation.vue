<template>
<div>
  <l-map style="height: 900px; width:100%; z-index:1;" :zoom="zoom" :center="center" @click="addMarker">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker v-for="item in markerLatLng" :lat-lng="item" :key="item.key">
        <l-popup>Test</l-popup>
    </l-marker>
  </l-map>
  <v-dialog v-model="dialog" width="500px">
    <TrashContainer />
  </v-dialog>
</div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import TrashContainer from "./TrashContainer.vue";
import firebase from 'firebase'
// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});


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
                [42.8415336, 20.1760091],
                [42.841, 20.18],
            ],
            location: null,
            gettingLocation: false,
            errorStr: null,
            dialog: false,
            database: firebase.database()
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
            this.database.ref("names").push({test: "velika"})
        },
    },

    async created() {
        this.gettingLocation = true;
        try {
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