<template>
<div class="map-wrapper">
    <l-map
        class="leaflet-canvas"
        :zoom="zoom"
        :center="center"
        :options="{ zoomControl: false }"
        @click="addMarker"
        style="height: 100%"
    >
        <l-control-zoom position="topright"></l-control-zoom>
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker v-for="item in $store.state.markerLatLng" :lat-lng="[item.coords.latitude, item.coords.longitude]" :key="item.key">
            <l-popup>
                <div class="marker-popup">
                    <div class="popup-head">
                        <span class="popup-title">{{item.placeName}}</span>
                        <span class="popup-badge" :class="item.isCleaned ? 'is-clean' : 'is-dirty'">
                            {{ item.isCleaned ? 'Očišćeno' : 'Nesređeno' }}
                        </span>
                    </div>
                    <div class="popup-date">
                        <v-icon x-small color="#64748b">mdi-calendar</v-icon>
                        {{item.date | formatDate}}
                    </div>
                    <v-checkbox
                        v-if="$store.state.user"
                        class="mt-1"
                        hide-details
                        dense
                        label="Označi kao očišćeno"
                        color="success"
                        v-model="item.isCleaned"
                        @change="changeStatus(item, $event)"
                    ></v-checkbox>
                    <img class="popup-photo"
                        :src="item.post.photo"
                        alt="Fotografija deponije"
                        @click="openPhotoDialog(item.post.photo)"
                    >
                </div>
            </l-popup>
            <l-icon
                :icon-url="`https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${item.markerColor}.png`"
            />
        </l-marker>
    </l-map>

    <div class="map-hud">SEKTOR IBAR · zoom {{ zoom }}</div>

    <div class="map-legend">
        <span><span class="lg-dot" style="background:#D9764E"></span>Nesređeno</span>
        <span><span class="lg-dot" style="background:#93C34D"></span>Očišćeno</span>
    </div>

    <button v-if="$store.state.user" class="map-fab" @click="addAtCenter" title="Prijavi deponiju na centru mape">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0c1c07" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
    </button>

    <v-dialog v-model="dialog" width="520px" :key="Math.random()">
        <TrashContainer @saveData="saveData($event)"/>
    </v-dialog>
    <v-dialog v-model="photoDialog" width="80%">
        <div class="photo-dialog">
            <img :src="selectedPhoto" class="dialog-image" >
        </div>
    </v-dialog>
</div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LControlZoom } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import TrashContainer from "./TrashContainer.vue";
// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;



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
        LIcon,
        LControlZoom
    },
    data() {
        return {
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution: '<a target="_blank" href="https://www.facebook.com/ocistimorozaje">Zajednica Očistimo Rožaje</a>',
            zoom: 12,
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
            tempData: []
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

            if (!this.$store.state.user) return;

            this.selectedCoords = {
                latitude: event.latlng.lat,
                longitude: event.latlng.lng
            }

            this.dialog = true;
        },
        addAtCenter() {
            if (!this.$store.state.user) return;

            this.selectedCoords = {
                latitude: this.center[0],
                longitude: this.center[1]
            }

            this.dialog = true;
        },
        saveData(data){
            data["coords"] = this.selectedCoords;
            landfillPointsRef.push(data);
            this.dialog = false;
            this.$store.state.markerLatLng = this.markerLatLng;
        },
        changeStatus(item, event) {
            landfillPointsRef.child(item['.key']).update({
                isCleaned: event,
                markerColor: event ? 'green' : 'red'
            })
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
            setTimeout(() => {
                this.$store.state.markerLatLng = this.markerLatLng;
                this.tempData = this.$store.state.markerLatLng;
            }, 1000);

        } catch (e) {
            this.gettingLocation = false;
            this.errorStr = e.message;
        }
    },
    lastMonthData() {
        // this.$store.state.markerLatLng = this.tempData.filter(element => element.date > )
    }
   
    
};
</script>
<style scoped>
.map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}
.leaflet-canvas {
    width: 100%;
    height: 100%;
    z-index: 1;
}

/* Coordinate HUD */
.map-hud {
    position: absolute;
    top: 14px;
    left: 14px;
    z-index: 600;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-soft);
    background: rgba(18, 32, 25, 0.82);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 6px 10px;
    letter-spacing: 0.04em;
}

/* Legend */
.map-legend {
    position: absolute;
    bottom: 14px;
    left: 14px;
    z-index: 600;
    display: flex;
    gap: 14px;
    background: rgba(18, 32, 25, 0.82);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 12px;
    color: var(--ink-soft);
}
.map-legend span { display: inline-flex; align-items: center; gap: 6px; }
.map-legend .lg-dot { width: 9px; height: 9px; border-radius: 50%; }

/* Add FAB */
.map-fab {
    position: absolute;
    right: 18px;
    bottom: 18px;
    z-index: 600;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: var(--moss);
    display: grid;
    place-items: center;
    box-shadow: 0 12px 28px -6px rgba(147, 195, 77, 0.6);
    transition: transform 0.14s ease;
}
.map-fab:hover { transform: translateY(-2px) scale(1.03); }
.map-fab:focus-visible { outline: 2px solid var(--river); outline-offset: 2px; }

/* Marker popup */
.marker-popup { min-width: 200px; }
.popup-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 4px;
}
.popup-title { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
.popup-badge {
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    padding: 2px 8px;
    border-radius: 999px;
    white-space: nowrap;
}
.popup-badge.is-clean { background: #dcfce7; color: #15803d; }
.popup-badge.is-dirty { background: #ffe4e6; color: #be123c; }
.popup-date { font-size: 0.78rem; color: #64748b; margin-bottom: 2px; }
.popup-photo {
    display: block;
    width: 100%;
    max-width: 220px;
    margin-top: 8px;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.15s ease;
}
.popup-photo:hover { transform: scale(1.02); }

.photo-dialog {
    position: relative;
    min-height: 300px;
    max-height: 80vh;
    background: #0b1220;
    border-radius: 16px;
}
.dialog-image {
    display: block;
    max-height: 80vh;
    max-width: 100%;
    margin: 0 auto;
    border-radius: 16px;
}
</style>