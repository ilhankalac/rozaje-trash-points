<template>
    <div class="points-panel">
        <div class="panel-header">
            <div class="panel-heading">
                <v-icon small color="primary" class="mr-2">mdi-format-list-bulleted</v-icon>
                <span>Lista deponija</span>
                <v-chip v-if="$store.state.markerLatLng" x-small class="ml-2" color="rgba(255,255,255,0.08)">
                    {{ $store.state.markerLatLng.length }}
                </v-chip>
            </div>
            <div class="search-row">
                <v-text-field
                    v-model="search.global"
                    @keyup="filter(false)"
                    clearable
                    @click:clear="filter(true)"
                    dark
                    dense
                    hide-details
                    outlined
                    rounded
                    placeholder="Pretraži po nazivu mjesta"
                    prepend-inner-icon="mdi-magnify"
                ></v-text-field>
                <v-btn
                    icon
                    class="filter-btn"
                    :color="showPanel ? 'primary' : ''"
                    @click="openAndClosePanel(0)"
                >
                    <v-icon>mdi-filter-variant</v-icon>
                </v-btn>
            </div>
        </div>

        <v-expand-transition>
            <div v-if="showPanel" class="filter-card">
                <h4 class="filter-title">
                    <v-icon small color="primary" class="mr-1">mdi-calendar-range</v-icon>
                    Pretraga po datumu
                </h4>
                <v-date-picker
                    v-model="search.date"
                    clearable
                    dark
                    full-width
                    color="primary"
                    :range="true"
                ></v-date-picker>
                <v-btn color="primary" depressed rounded block class="mt-3 text-none" @click="createReport">
                    <v-icon left small>mdi-magnify</v-icon> Pretraži
                </v-btn>
            </div>
        </v-expand-transition>

        <div class="list-scroll">
            <div v-if="$store.state.markerLatLng === undefined" class="loading-state">
                <v-progress-circular indeterminate :size="46" color="primary"></v-progress-circular>
                <span class="mt-3">Učitavanje deponija…</span>
            </div>

            <div
                v-else-if="$store.state.markerLatLng.length === 0"
                class="empty-state"
            >
                <v-icon size="42" color="#475569">mdi-map-marker-off-outline</v-icon>
                <span class="mt-2">Nema rezultata</span>
            </div>

            <v-timeline
                v-else
                dense
                dark
            >
                <v-timeline-item
                    v-for="item in $store.state.markerLatLng"
                    :key="item.key"
                    small
                    fill-dot
                    :color="item.isCleaned ? 'success' : 'error'"
                    @click.native="selectItem(item)"
                >
                    <div class="point-card">
                        <div class="point-name">{{ item.placeName.toUpperCase() }}</div>
                        <div class="point-meta">
                            <span class="point-status" :class="item.isCleaned ? 'is-clean' : 'is-dirty'">
                                {{ item.isCleaned ? 'Očišćeno' : 'Nesređeno' }}
                            </span>
                            <span class="point-date">
                                <v-icon x-small color="#64748b">mdi-calendar</v-icon>
                                {{ item.date | formatDate }}
                            </span>
                        </div>
                    </div>
                </v-timeline-item>
            </v-timeline>
        </div>
    </div>
</template>

<script>
import { landfillPointsRef } from '../firebase/firebase';
import {eventBus} from "../main.js";
import moment from 'moment'

export default {
    data() {
      return {
          markerLatLng: [],
          tempMarkerLatLng: [],
          openedPanel: null,
          showPanel: false,
          search: {
            global: "",
            placeName: "",
            description: "",
            date: [new Date().toISOString().substr(0, 10)],
          },
      };
    },
    firebase:{
        markerLatLng: landfillPointsRef 
    },
    created(){
      this.tempMarkerLatLng = this.markerLatLng;
    },
    methods:{
      selectItem(item){
        this.$store.state.selectedPoint = item;
        eventBus.$emit('fireMethod');
      },
      filter(clear = false){
        clear ? this.search.global = "" : null;
        this.$store.state.markerLatLng  = this.tempMarkerLatLng.filter(element => element.placeName.toLowerCase().includes(this.search.global.toLowerCase()))
      },
      openAndClosePanel (index) {
        this.showPanel = !this.showPanel;
        this.openedPanel = this.openedPanel === null ? index : null;
      },
      createReport(){
        let date1, date2;


        console.log(this.search.date);
        [date1, date2] = this.search.date;


        date1 = moment(date1).valueOf();

        if(date2)
          date2 = moment(date2).valueOf();
        else 
          date2 = date1;

        let temp;
        
        if(date1 < date2){
          temp = date1;
          date1 = date2;
          date2 = temp;
        }
        // Filtering array by date range
        this.$store.state.markerLatLng = this.tempMarkerLatLng.filter(element => element.date <= date1 && element.date >= date2)
  
      },
    }
}
</script>

<style scoped>
.points-panel {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 72px);
    background: var(--v-surface-base);
    color: #e2e8f0;
}

.panel-header {
    padding: 16px 16px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.panel-heading {
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 0.95rem;
    color: #f1f5f9;
    margin-bottom: 12px;
}
.search-row {
    display: flex;
    align-items: center;
    gap: 8px;
}
.filter-btn {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    flex-shrink: 0;
}

.filter-card {
    margin: 12px 16px 4px;
    padding: 16px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
}
.filter-title {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    font-weight: 600;
    color: #cbd5e1;
    margin-bottom: 10px;
}

.list-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 8px 4px 24px;
}

.loading-state,
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #94a3b8;
    font-size: 0.9rem;
}

.point-card {
    padding: 10px 14px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: background 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
}
.point-card:hover {
    background: rgba(16, 185, 129, 0.08);
    border-color: rgba(16, 185, 129, 0.28);
    transform: translateX(2px);
}
.point-name {
    text-align: left;
    font-size: 0.9rem;
    font-weight: 700;
    color: #f1f5f9;
    margin-bottom: 4px;
}
.point-meta {
    display: flex;
    align-items: center;
    gap: 10px;
}
.point-status {
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    padding: 2px 8px;
    border-radius: 999px;
}
.point-status.is-clean { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
.point-status.is-dirty { background: rgba(244, 63, 94, 0.15); color: #fb7185; }
.point-date {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 0.75rem;
    color: #94a3b8;
}

.points-panel >>> .v-timeline-item {
    cursor: pointer;
    padding-bottom: 14px;
}

/* Slim modern scrollbar */
.list-scroll::-webkit-scrollbar { width: 8px; }
.list-scroll::-webkit-scrollbar-track { background: transparent; }
.list-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 8px;
}
.list-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.22); }
</style>