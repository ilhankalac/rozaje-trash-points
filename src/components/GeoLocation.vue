<template>
<div>
  <l-map style="height: 900px; width:100%" :zoom="zoom" :center="center">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker :lat-lng="markerLatLng"></l-marker>
  </l-map>
  <button @click="test()"></button>

</div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

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
    },
    data() {
        return {
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution:
                '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            zoom: 13,
            center: [51.505, -0.159],
            markerLatLng: [51.504, -0.159],
            location: null,
            gettingLocation: false,
            errorStr: null,
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
            this.markerLatLng = [
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