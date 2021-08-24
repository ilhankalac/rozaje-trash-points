<template>
<div>
  <l-map style="height: 300px" :zoom="zoom" :center="center">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker :lat-lng="markerLatLng"></l-marker>
  </l-map>
  <button @click="test()"></button>

</div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";

export default {
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
            zoom: 15,
            center: [51.505, -0.159],
            markerLatLng: [51.504, -0.159],
        };
    },
    created() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const { latitude } = position.coords;
                const { longitude } = position.coords;

                console.log(latitude);
                console.log(longitude);
            });
        }
    },
    methods: {
        test() {
            this.center = [42.8415336, 20.176009099999998];
        },
    },
};
</script>