<template>
  <div class="points-panel">
    <div class="panel-header">
      <div class="ph-top">
        <span class="ph-title">Deponije</span>
        <span class="ph-count">{{ visibleCount }} / {{ counts.all }}</span>
      </div>

      <div class="search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <input
          type="text"
          v-model="search.global"
          @input="applyFilters"
          placeholder="Pretraži po naselju…"
        />
        <button v-if="search.global" class="search-clear" @click="clearSearch" aria-label="Očisti pretragu">×</button>
      </div>

      <div class="chips">
        <button class="chip all" :aria-pressed="statusFilter === 'all'" @click="setStatus('all')">Sve · {{ counts.all }}</button>
        <button class="chip dirty" :aria-pressed="statusFilter === 'dirty'" @click="setStatus('dirty')">
          <span class="dot" style="background:var(--rust)"></span>Nesređeno · {{ counts.dirty }}
        </button>
        <button class="chip clean" :aria-pressed="statusFilter === 'clean'" @click="setStatus('clean')">
          <span class="dot" style="background:var(--moss)"></span>Očišćeno · {{ counts.clean }}
        </button>
        <button class="chip icon" :aria-pressed="showDate" @click="showDate = !showDate" aria-label="Filter po datumu">
          <v-icon small>mdi-calendar-range</v-icon>
        </button>
      </div>

      <v-expand-transition>
        <div v-if="showDate" class="date-panel">
          <v-date-picker
            v-model="search.date"
            range
            dark
            no-title
            full-width
            color="primary"
          ></v-date-picker>
          <div class="date-actions">
            <button class="mini-btn primary" @click="applyDate">Primijeni</button>
            <button class="mini-btn" @click="clearDate">Reset</button>
          </div>
        </div>
      </v-expand-transition>
    </div>

    <div class="list-scroll">
      <div v-if="$store.state.markerLatLng === undefined" class="state">
        <v-progress-circular indeterminate :size="42" color="primary"></v-progress-circular>
        <span>Učitavanje deponija…</span>
      </div>

      <div v-else-if="visibleList.length === 0" class="state">
        <v-icon size="40" color="#6E8177">mdi-map-marker-off-outline</v-icon>
        <span>Nema rezultata</span>
      </div>

      <div
        v-else
        v-for="item in visibleList"
        :key="item['.key'] || item.key"
        class="card"
        @click="selectItem(item)"
      >
        <div
          class="thumb"
          :style="item.post && item.post.photo ? { backgroundImage: 'url(' + item.post.photo + ')' } : {}"
        >
          <span v-if="!(item.post && item.post.photo)" class="thumb-ph">
            <v-icon small color="#6E8177">mdi-image-off-outline</v-icon>
          </span>
        </div>
        <div class="meta">
          <div class="name">{{ item.placeName }}</div>
          <div class="coord" v-if="item.coords">◈ {{ fmtCoord(item.coords.latitude) }}, {{ fmtCoord(item.coords.longitude) }}</div>
          <div class="row">
            <span class="pill" :class="item.isCleaned ? 'clean' : 'dirty'">{{ item.isCleaned ? 'Očišćeno' : 'Nesređeno' }}</span>
            <span class="date">{{ item.date | formatDate }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { landfillPointsRef } from '../firebase/firebase';
import { eventBus } from "../main.js";
import moment from 'moment'

export default {
  data() {
    return {
      markerLatLng: [],
      statusFilter: 'all',
      showDate: false,
      dateRange: null,
      search: {
        global: "",
        date: [],
      },
    };
  },
  firebase: {
    markerLatLng: landfillPointsRef
  },
  computed: {
    counts() {
      const b = Array.isArray(this.markerLatLng) ? this.markerLatLng : [];
      return {
        all: b.length,
        dirty: b.filter((e) => !e.isCleaned).length,
        clean: b.filter((e) => e.isCleaned).length,
      };
    },
    visibleList() {
      return Array.isArray(this.$store.state.markerLatLng) ? this.$store.state.markerLatLng : [];
    },
    visibleCount() {
      return this.visibleList.length;
    },
  },
  methods: {
    selectItem(item) {
      this.$store.state.selectedPoint = item;
      eventBus.$emit('fireMethod');
    },
    fmtCoord(v) {
      return (typeof v === 'number' ? v : parseFloat(v) || 0).toFixed(3);
    },
    setStatus(s) {
      this.statusFilter = s;
      this.applyFilters();
    },
    clearSearch() {
      this.search.global = "";
      this.applyFilters();
    },
    applyDate() {
      const d = this.search.date;
      if (d && d.length) {
        const vals = d.map((x) => moment(x).valueOf()).sort((a, b) => a - b);
        this.dateRange = [vals[0], vals[vals.length - 1]];
      } else {
        this.dateRange = null;
      }
      this.applyFilters();
    },
    clearDate() {
      this.search.date = [];
      this.dateRange = null;
      this.applyFilters();
    },
    applyFilters() {
      const base = Array.isArray(this.markerLatLng) ? this.markerLatLng : [];
      let res = base.slice();

      if (this.statusFilter === 'dirty') res = res.filter((e) => !e.isCleaned);
      else if (this.statusFilter === 'clean') res = res.filter((e) => e.isCleaned);

      const q = (this.search.global || "").trim().toLowerCase();
      if (q) res = res.filter((e) => e.placeName && e.placeName.toLowerCase().includes(q));

      if (this.dateRange && this.dateRange.length === 2) {
        res = res.filter((e) => e.date >= this.dateRange[0] && e.date <= this.dateRange[1]);
      }

      this.$store.state.markerLatLng = res;
    },
  },
};
</script>

<style scoped>
.points-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--surface);
  color: var(--ink);
}

/* header */
.panel-header {
  padding: 14px 14px 12px;
  border-bottom: 1px solid var(--line);
}
.ph-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}
.ph-title { font-family: var(--font-grotesk); font-weight: 800; letter-spacing: -0.01em; font-size: 15px; color: var(--ink); }
.ph-count { font-family: var(--font-mono); font-size: 12px; color: var(--ink-faint); font-variant-numeric: tabular-nums; }

.search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--paper);
  border: 1px solid var(--line-strong);
  border-radius: 10px;
  padding: 8px 10px;
  color: var(--ink-faint);
}
.search svg { width: 16px; height: 16px; flex: none; }
.search input {
  flex: 1;
  min-width: 0;
  background: none;
  border: none;
  outline: none;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 14px;
}
.search input::placeholder { color: var(--ink-faint); }
.search-clear { background: none; border: none; color: var(--ink-faint); cursor: pointer; font-size: 18px; line-height: 1; padding: 0 2px; }
.search-clear:hover { color: var(--ink); }

.chips { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 10px; }
.chip {
  font-family: var(--font-sans);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 999px;
  padding: 6px 11px;
  border: 1px solid var(--line-strong);
  background: var(--surface);
  color: var(--ink-soft);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.14s ease;
}
.chip .dot { width: 8px; height: 8px; border-radius: 50%; }
.chip.icon { padding: 6px 9px; }
.chip[aria-pressed="true"] { border-color: transparent; }
.chip.all[aria-pressed="true"] { background: var(--ink); color: var(--paper); }
.chip.dirty[aria-pressed="true"] { background: var(--rust); color: #fff; }
.chip.clean[aria-pressed="true"] { background: var(--moss); color: #0c1c07; }
.chip.icon[aria-pressed="true"] { background: var(--surface-2); border-color: var(--moss); color: var(--moss); }
.chip:focus-visible { outline: 2px solid var(--river); outline-offset: 2px; }

.date-panel { margin-top: 10px; }
.date-actions { display: flex; gap: 8px; margin-top: 8px; }
.mini-btn {
  flex: 1;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 9px;
  padding: 8px;
  border: 1px solid var(--line-strong);
  background: var(--surface);
  color: var(--ink);
}
.mini-btn.primary { background: var(--moss); color: #0c1c07; border-color: transparent; }

/* list */
.list-scroll { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 6px; }
.state { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 54px 20px; color: var(--ink-faint); font-size: 0.9rem; }

.card {
  display: flex;
  gap: 12px;
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.14s ease;
}
.card:hover { background: var(--surface-2); }
.thumb {
  width: 62px;
  height: 62px;
  border-radius: 10px;
  flex: none;
  background-color: var(--surface-2);
  background-size: cover;
  background-position: center;
  border: 1px solid var(--line);
  position: relative;
}
.thumb-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.meta { min-width: 0; flex: 1; }
.name { font-family: var(--font-grotesk); font-weight: 700; font-size: 14.5px; letter-spacing: -0.01em; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.coord { font-family: var(--font-mono); font-size: 11.5px; color: var(--ink-faint); margin-top: 2px; letter-spacing: 0.02em; }
.row { display: flex; align-items: center; gap: 8px; margin-top: 7px; flex-wrap: wrap; }
.pill {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 999px;
}
.pill.dirty { background: rgba(217, 118, 78, 0.16); color: var(--rust-deep); }
.pill.clean { background: rgba(147, 195, 77, 0.18); color: var(--moss-deep); }
.date { font-family: var(--font-mono); font-size: 11.5px; color: var(--ink-soft); }

.list-scroll::-webkit-scrollbar { width: 8px; }
.list-scroll::-webkit-scrollbar-track { background: transparent; }
.list-scroll::-webkit-scrollbar-thumb { background: var(--line-strong); border-radius: 8px; }
.list-scroll::-webkit-scrollbar-thumb:hover { background: var(--ink-faint); }
</style>
