<template>
<div class="map-wrapper">
    <l-map
        class="leaflet-canvas"
        :zoom="zoom"
        :center="center"
        @click="addMarker"
        :style="$vuetify.breakpoint.smAndDown ? 'height: 460px' : 'height: calc(100vh - 72px)'"
    >
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

    <div class="stat-panel" v-if="$store.state.markerLatLng">
        <div class="stat-tile total">
            <span class="stat-value">{{$store.state.markerLatLng.length}}</span>
            <span class="stat-label">Ukupno</span>
        </div>
        <div class="stat-tile dirty">
            <span class="stat-dot"></span>
            <div class="stat-meta">
                <span class="stat-value">{{$store.state.markerLatLng.filter(item => !item.isCleaned).length}}</span>
                <span class="stat-label">Nesređene</span>
            </div>
        </div>
        <div class="stat-tile clean">
            <span class="stat-dot"></span>
            <div class="stat-meta">
                <span class="stat-value">{{$store.state.markerLatLng.filter(item => item.isCleaned).length}}</span>
                <span class="stat-label">Sređene</span>
            </div>
        </div>
    </div>

    <v-chip v-if="$store.state.user" class="map-hint" color="primary" small label>
        <v-icon left x-small>mdi-gesture-tap</v-icon>
        Klikni na mapu da dodaš deponiju
    </v-chip>

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
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
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
        LIcon
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
}
.leaflet-canvas {
    width: 100%;
    z-index: 1;
}

/* Floating glass stats */
.stat-panel {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 500;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    width: 180px;
    border-radius: 16px;
    background: rgba(15, 23, 42, 0.82);
    backdrop-filter: saturate(160%) blur(12px);
    -webkit-backdrop-filter: saturate(160%) blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}
.stat-tile {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 12px;
}
.stat-tile.total {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(20, 184, 166, 0.12));
    border: 1px solid rgba(16, 185, 129, 0.3);
}
.stat-tile.dirty { background: rgba(244, 63, 94, 0.10); }
.stat-tile.clean { background: rgba(34, 197, 94, 0.10); }
.stat-meta { display: flex; flex-direction: column; line-height: 1.1; }
.stat-value {
    font-size: 1.25rem;
    font-weight: 800;
    color: #f8fafc;
}
.stat-tile.total .stat-value { font-size: 1.7rem; }
.stat-label {
    font-size: 0.7rem;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    color: #94a3b8;
}
.stat-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
}
.stat-tile.dirty .stat-dot { background: #f43f5e; box-shadow: 0 0 0 4px rgba(244, 63, 94, 0.15); }
.stat-tile.clean .stat-dot { background: #22c55e; box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15); }

.map-hint {
    position: absolute;
    left: 16px;
    bottom: 26px;
    z-index: 500;
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.35);
}

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