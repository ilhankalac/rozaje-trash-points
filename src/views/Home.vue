<template>
  <div class="home">
    <!-- ============ HERO ============ -->
    <section class="hero">
      <canvas ref="topoHero" class="topo" aria-hidden="true"></canvas>
      <div class="wrap hero-inner">
        <span class="eyebrow">Rožaje · 42.84° N, 20.16° E</span>
        <h1 class="hero-title">
          Svaka deponija <span class="accent">mapirana</span> je pola puta do <span class="accent">očišćene</span>.
        </h1>
        <p class="hero-lead">
          Zajednica prijavljuje divlje deponije, mi ih pratimo na terenu, a volonteri ih čiste.
          Ovdje se vidi cijela slika — gdje je problem, šta je riješeno i koliko je Rožaje bliže čistom.
        </p>
        <div class="hero-cta">
          <button class="hbtn hbtn-primary hero-btn" @click="reportCta">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Prijavi deponiju
          </button>
          <button class="hbtn hbtn-ghost hero-btn" @click="scrollTo('mapa')">Otvori mapu</button>
        </div>

        <div class="impact">
          <div class="stat">
            <div class="k">Mapirano ukupno</div>
            <div class="v">{{ total }}</div>
            <div class="u">divljih deponija</div>
          </div>
          <div class="stat">
            <div class="k"><span class="dot" style="background:var(--rust)"></span>Nesređeno</div>
            <div class="v" style="color:var(--rust)">{{ dirty }}</div>
            <div class="u">čeka akciju</div>
          </div>
          <div class="stat">
            <div class="k"><span class="dot" style="background:var(--moss)"></span>Očišćeno</div>
            <div class="v" style="color:var(--moss)">{{ clean }}</div>
            <div class="u">vraćeno prirodi</div>
          </div>
          <div class="stat">
            <div class="k">Naselja</div>
            <div class="v">{{ areasCount }}</div>
            <div class="u">pod monitoringom</div>
          </div>
        </div>

        <div class="goal">
          <div class="goal-top">
            <span class="lab">Cilj: čisto Rožaje</span>
            <span class="pct">{{ rate }}%</span>
          </div>
          <div class="gbar"><i :style="{ width: rate + '%' }"></i></div>
        </div>
      </div>
    </section>

    <!-- ============ MAP CONSOLE ============ -->
    <section class="block" id="mapa">
      <div class="wrap">
        <div class="sec-head">
          <span class="eyebrow">Operativni alat</span>
          <h2>Jedna mapa za cijelu teritoriju</h2>
          <p>Filtriraj po statusu, pretraži po naselju, otvori deponiju i označi je kao očišćenu kada je akcija gotova.</p>
        </div>

        <div class="console">
          <div class="console-bar">
            <span class="console-title">Mapa deponija</span>
            <span class="console-sub">{{ dirty }} nesređenih · {{ clean }} očišćenih</span>
            <span class="cbar-spacer"></span>
            <button v-if="user" class="hbtn hbtn-primary cbar-btn" @click="reportAtCenter">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Prijavi na centru
            </button>
            <span v-else class="cbar-hint">Prijavi se da dodaješ deponije</span>
          </div>
          <div class="console-body">
            <ListOfPoints class="console-list" />
            <div class="console-map">
              <GeoLocation ref="geo" :openDialog="openDialog" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ STATISTICS ============ -->
    <section class="block" id="statistika">
      <div class="wrap">
        <div class="sec-head">
          <span class="eyebrow">Uticaj zajednice</span>
          <h2>Napredak koji se mjeri, ne osjeća</h2>
          <p>Koliko čistimo iz mjeseca u mjesec i koja naselja traže najviše pažnje.</p>
        </div>
        <div class="stats-grid">
          <div class="panel">
            <div class="panel-sub">Kumulativno očišćeno</div>
            <h3 class="panel-h">{{ clean }} deponija do sada</h3>
            <div class="chart-wrap">
              <svg v-if="chartGeom" :viewBox="'0 0 ' + chartGeom.w + ' ' + chartGeom.h" role="img" aria-label="Kumulativno očišćene deponije po mjesecima">
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="var(--moss)" stop-opacity="0.32"/>
                    <stop offset="1" stop-color="var(--moss)" stop-opacity="0"/>
                  </linearGradient>
                </defs>
                <g>
                  <template v-for="(g, gi) in chartGeom.grid">
                    <line :key="'gl' + gi" :x1="chartGeom.pad.l" :y1="g.y" :x2="chartGeom.w - chartGeom.pad.r" :y2="g.y" stroke="var(--line)" stroke-width="1"/>
                    <text :key="'gt' + gi" class="axis" :x="chartGeom.pad.l - 8" :y="g.y + 3" text-anchor="end">{{ g.v }}</text>
                  </template>
                </g>
                <path :d="chartGeom.area" fill="url(#ag)"/>
                <path :d="chartGeom.line" fill="none" stroke="var(--moss)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
                <circle :cx="chartGeom.endX" :cy="chartGeom.endY" r="5" fill="var(--moss)" stroke="var(--surface)" stroke-width="2.5"/>
                <text :x="chartGeom.endX" :y="chartGeom.endY - 12" text-anchor="end" class="axis-strong">{{ chartGeom.endV }}</text>
                <text v-for="(l, li) in chartGeom.labels" :key="'xl' + li" class="axis" :x="l.x" :y="chartGeom.h - 8" text-anchor="middle">{{ l.t }}</text>
              </svg>
              <div v-else class="chart-empty">
                <v-icon color="#6E8177" size="34">mdi-chart-line</v-icon>
                <span>Nema dovoljno podataka za grafik</span>
              </div>
            </div>
          </div>

          <div class="panel">
            <div class="panel-sub">Nesređeno po naselju</div>
            <h3 class="panel-h">Gdje treba akcija</h3>
            <div class="bars" v-if="byArea.length">
              <div v-for="(b, bi) in byArea" :key="'b' + bi" class="barrow">
                <span class="pl">{{ b.p }}</span>
                <span class="track"><i :style="{ width: (b.n / byAreaMax * 100) + '%' }"></i></span>
                <span class="n">{{ b.n }}</span>
              </div>
            </div>
            <div v-else class="chart-empty">
              <v-icon color="#6E8177" size="34">mdi-check-circle-outline</v-icon>
              <span>Nema nesređenih deponija</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ FLOW ============ -->
    <section class="block" id="kako">
      <div class="wrap">
        <div class="sec-head">
          <span class="eyebrow">Tok prijave</span>
          <h2>Od fotografije do očišćenog terena</h2>
          <p>Tri koraka koliko treba građaninu da prijavi deponiju. Ostalo je na zajednici.</p>
        </div>
        <div class="steps">
          <div class="step">
            <div class="num">KORAK 01</div>
            <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--moss)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
            <h3>Slikaj deponiju</h3>
            <p>Fotografija je dokaz i poziv na akciju. Jedan snimak dovoljan je da se deponija zavede u sistem.</p>
          </div>
          <div class="step">
            <div class="num">KORAK 02</div>
            <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--moss)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg></div>
            <h3>Označi lokaciju</h3>
            <p>Klikni tačno mjesto na mapi. Koordinate se pamte automatski — tim zna kuda da ide.</p>
          </div>
          <div class="step">
            <div class="num">KORAK 03</div>
            <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--moss)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7Z"/></svg></div>
            <h3>Pošalji prijavu</h3>
            <p>Deponija se pojavljuje na mapi kao nesređena i ulazi u statistiku zajednice.</p>
          </div>
        </div>
        <div class="flow-tail"><span class="dot"></span>Volonteri je čiste na terenu i označavaju kao sređenu — crveno postaje zeleno.</div>
      </div>
    </section>

    <!-- ============ CTA ============ -->
    <section class="block cta">
      <canvas ref="topoCta" class="topo" aria-hidden="true"></canvas>
      <div class="wrap cta-inner">
        <span class="eyebrow">Pridruži se</span>
        <h2>Rožaje čistimo zajedno.</h2>
        <p>Prijavi deponiju koju znaš ili se javi za sljedeću akciju čišćenja. Svaka tačka na mapi je manje jedna kada nas je više.</p>
        <button class="hbtn hbtn-primary cta-btn" @click="reportCta">Prijavi deponiju</button>
      </div>
    </section>

    <footer class="site-footer">
      <div class="wrap footer-inner">
        <span>Očistimo Rožaje · civilna inicijativa</span>
        <span class="mono">42.84°N 20.16°E</span>
      </div>
    </footer>
  </div>
</template>

<script>
import GeoLocation from "../components/GeoLocation.vue";
import ListOfPoints from "../components/ListOfPoints.vue";
import { landfillPointsRef } from "../firebase/firebase";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"];

function areaOf(name) {
  if (!name) return "Nepoznato";
  const parts = name.split(/[—–-]/);
  return parts[0].trim() || name.trim();
}

export default {
  name: "Home",
  components: { GeoLocation, ListOfPoints },
  data() {
    return {
      allPoints: [],
    };
  },
  firebase: {
    allPoints: landfillPointsRef,
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    points() {
      return Array.isArray(this.allPoints) ? this.allPoints : [];
    },
    total() {
      return this.points.length;
    },
    dirty() {
      return this.points.filter((p) => !p.isCleaned).length;
    },
    clean() {
      return this.points.filter((p) => p.isCleaned).length;
    },
    rate() {
      return this.total ? Math.round((this.clean / this.total) * 100) : 0;
    },
    areasCount() {
      const set = {};
      this.points.forEach((p) => { set[areaOf(p.placeName)] = true; });
      return Object.keys(set).length;
    },
    byArea() {
      const map = {};
      this.points.filter((p) => !p.isCleaned).forEach((p) => {
        const a = areaOf(p.placeName);
        map[a] = (map[a] || 0) + 1;
      });
      return Object.keys(map)
        .map((k) => ({ p: k, n: map[k] }))
        .sort((a, b) => b.n - a.n)
        .slice(0, 6);
    },
    byAreaMax() {
      return this.byArea.reduce((m, b) => Math.max(m, b.n), 1);
    },
    chartSeries() {
      const cleaned = this.points
        .filter((p) => p.isCleaned && p.date)
        .sort((a, b) => a.date - b.date);
      if (cleaned.length < 2) return null;
      const buckets = {};
      cleaned.forEach((p) => {
        const d = new Date(p.date);
        const key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
        buckets[key] = (buckets[key] || 0) + 1;
      });
      const keys = Object.keys(buckets).sort();
      if (keys.length < 2) return null;
      let cum = 0;
      return keys.map((k) => {
        cum += buckets[k];
        const m = parseInt(k.split("-")[1], 10);
        return { label: MONTHS[m - 1], value: cum };
      });
    },
    chartGeom() {
      const pts = this.chartSeries;
      if (!pts) return null;
      const w = 520, h = 210, pad = { l: 30, r: 14, t: 16, b: 26 };
      const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
      const last = pts[pts.length - 1].value;
      const maxV = Math.max(10, Math.ceil(last / 10) * 10);
      const X = (i) => pad.l + (pts.length === 1 ? 0 : (i / (pts.length - 1)) * iw);
      const Y = (v) => pad.t + ih - (v / maxV) * ih;
      let line = "";
      pts.forEach((p, i) => { line += (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(p.value).toFixed(1) + " "; });
      const area = line + "L" + X(pts.length - 1).toFixed(1) + " " + (pad.t + ih) + " L" + pad.l + " " + (pad.t + ih) + " Z";
      const grid = [0, maxV / 2, maxV].map((g) => ({ y: Y(g), v: Math.round(g) }));
      const labels = pts.map((p, i) => ({ x: X(i), t: p.label }));
      return { w, h, pad, ih, line, area, grid, labels, endX: X(pts.length - 1), endY: Y(last), endV: last };
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.topoHero) this.initTopo(this.$refs.topoHero);
      if (this.$refs.topoCta) this.initTopo(this.$refs.topoCta);
    });
  },
  methods: {
    openDialog() {},
    scrollTo(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    reportCta() {
      this.scrollTo("mapa");
      if (this.user && this.$refs.geo) {
        setTimeout(() => this.$refs.geo.addAtCenter(), 450);
      }
    },
    reportAtCenter() {
      if (this.$refs.geo) this.$refs.geo.addAtCenter();
    },
    initTopo(canvas) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const ctx = canvas.getContext("2d");
      const cssv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
      const centers = [
        { x: 0.22, y: 0.34, s: 1.0 },
        { x: 0.74, y: 0.64, s: 0.85 },
        { x: 0.52, y: 0.14, s: 0.6 },
      ];
      let W, H, dpr, t = 0, raf = null;
      const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = canvas.clientWidth; H = canvas.clientHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        const base = Math.min(W, H);
        const col = cssv("--topo"), colS = cssv("--topo-strong");
        for (let c = 0; c < centers.length; c++) {
          const C = centers[c];
          const cx = C.x * W, cy = C.y * H;
          const rings = 13;
          for (let r = 1; r <= rings; r++) {
            ctx.beginPath();
            const rad = (r / rings) * base * 0.62 * C.s + 14;
            const steps = 80;
            for (let i = 0; i <= steps; i++) {
              const a = (i / steps) * Math.PI * 2;
              const wob = Math.sin(a * 3 + c * 2 + r * 0.35 + t) * (6 + r * 1.6)
                + Math.cos(a * 5 - r * 0.5 + t * 0.7) * (3 + r * 0.7);
              const rr = rad + wob;
              const x = cx + Math.cos(a) * rr;
              const y = cy + Math.sin(a) * rr * 0.82;
              if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.lineWidth = r % 4 === 0 ? 1.4 : 1;
            ctx.strokeStyle = r % 4 === 0 ? colS : col;
            ctx.stroke();
          }
        }
      };
      const loop = () => { t += 0.0018; draw(); raf = requestAnimationFrame(loop); };
      resize(); draw();
      const onResize = () => { resize(); draw(); };
      window.addEventListener("resize", onResize);
      this._topoCleanups = this._topoCleanups || [];
      this._topoCleanups.push(() => { if (raf) cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); });
      if (!reduce) raf = requestAnimationFrame(loop);
    },
  },
  beforeDestroy() {
    (this._topoCleanups || []).forEach((fn) => fn());
  },
};
</script>

<style scoped>
.wrap { max-width: 1200px; margin: 0 auto; padding: 0 22px; }
.mono { font-family: var(--font-mono); }

/* ---------- hero ---------- */
.hero { position: relative; overflow: hidden; border-bottom: 1px solid var(--line); }
.topo { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
.hero-inner { position: relative; z-index: 2; padding: 76px 22px 60px; }
.hero-title { font-size: clamp(2.2rem, 5.5vw, 4rem); line-height: 1.03; max-width: 16ch; text-wrap: balance; }
.hero-title .accent { color: #B6E06A; }
.hero-lead { margin: 20px 0 28px; font-size: clamp(1.02rem, 2vw, 1.2rem); color: var(--ink-soft); max-width: 54ch; line-height: 1.6; }
.hero-cta { display: flex; flex-wrap: wrap; gap: 12px; }
.hero-btn { font-size: 14.5px; padding: 12px 18px; }

.impact {
  margin-top: 52px;
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 1px; background: var(--line);
  border: 1px solid var(--line); border-radius: 16px; overflow: hidden;
}
.stat { background: var(--surface); padding: 20px 22px; }
.stat .k { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-faint); display: flex; align-items: center; gap: 7px; }
.stat .k .dot { width: 8px; height: 8px; border-radius: 50%; }
.stat .v { font-family: var(--font-mono); font-weight: 700; font-variant-numeric: tabular-nums; font-size: clamp(1.9rem, 4vw, 2.6rem); line-height: 1.1; margin-top: 10px; letter-spacing: -0.02em; color: var(--ink); }
.stat .u { font-size: 13px; color: var(--ink-soft); margin-top: 2px; }

.goal { margin-top: 18px; background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 18px 22px; }
.goal-top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.goal-top .lab { font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-soft); }
.goal-top .pct { font-family: var(--font-mono); font-weight: 700; font-size: 20px; color: var(--moss); font-variant-numeric: tabular-nums; }
.gbar { height: 12px; border-radius: 999px; background: var(--surface-2); margin-top: 12px; overflow: hidden; border: 1px solid var(--line); }
.gbar > i { display: block; height: 100%; width: 0; background: linear-gradient(90deg, var(--moss), var(--river)); border-radius: 999px; transition: width 1.4s cubic-bezier(.2,.7,.2,1); }

@media (min-width: 720px) { .impact { grid-template-columns: repeat(4, 1fr); } }

/* ---------- section shell ---------- */
.block { padding: 74px 0; border-bottom: 1px solid var(--line); position: relative; }
.sec-head { max-width: 62ch; margin-bottom: 32px; }
.sec-head h2 { font-size: clamp(1.7rem, 4vw, 2.5rem); margin-top: 14px; }
.sec-head p { color: var(--ink-soft); margin: 12px 0 0; font-size: 1.04rem; }

/* ---------- console ---------- */
.console { border: 1px solid var(--line-strong); border-radius: 18px; overflow: hidden; background: var(--surface); box-shadow: 0 1px 2px rgba(0,0,0,.4), 0 22px 48px -20px rgba(0,0,0,.7); }
.console-bar { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--line); background: var(--surface-2); flex-wrap: wrap; }
.console-title { font-family: var(--font-grotesk); font-weight: 800; letter-spacing: -0.01em; font-size: 15px; color: var(--ink); }
.console-sub { font-family: var(--font-mono); font-size: 11.5px; color: var(--ink-faint); letter-spacing: .03em; }
.cbar-spacer { flex: 1; }
.cbar-btn { font-size: 13px; padding: 8px 14px; }
.cbar-hint { font-family: var(--font-mono); font-size: 11px; color: var(--ink-faint); }
.console-body { display: grid; grid-template-columns: 1fr; }
.console-list { border-right: 1px solid var(--line); }
.console-map { position: relative; height: 420px; }
@media (min-width: 900px) {
  .console-body { grid-template-columns: 350px 1fr; }
  .console-map { height: 560px; }
}

/* ---------- statistics ---------- */
.stats-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
@media (min-width: 900px) { .stats-grid { grid-template-columns: 1.3fr 1fr; } }
.panel { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 22px; }
.panel-sub { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-faint); }
.panel-h { font-size: 1.15rem; margin-top: 4px; color: var(--ink); }
.chart-wrap { margin-top: 18px; }
.chart-wrap svg { width: 100%; height: auto; display: block; overflow: visible; }
.axis { font-family: var(--font-mono); font-size: 10px; fill: var(--ink-faint); }
.axis-strong { font-family: var(--font-mono); font-size: 13px; font-weight: 700; fill: var(--moss); }
.chart-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 46px 10px; color: var(--ink-faint); font-size: .9rem; }

.bars { margin-top: 18px; display: flex; flex-direction: column; gap: 14px; }
.barrow { display: grid; grid-template-columns: 92px 1fr 30px; align-items: center; gap: 12px; }
.barrow .pl { font-size: 13px; color: var(--ink); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.track { height: 9px; border-radius: 999px; background: var(--surface-2); overflow: hidden; border: 1px solid var(--line); }
.track > i { display: block; height: 100%; background: var(--rust); border-radius: 999px; transition: width 1s cubic-bezier(.2,.7,.2,1); }
.barrow .n { font-family: var(--font-mono); font-size: 13px; text-align: right; color: var(--ink-soft); font-variant-numeric: tabular-nums; }

/* ---------- flow ---------- */
.steps { display: grid; grid-template-columns: 1fr; gap: 18px; }
@media (min-width: 760px) { .steps { grid-template-columns: repeat(3, 1fr); } }
.step { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 24px; }
.step .num { font-family: var(--font-mono); font-size: 12.5px; font-weight: 700; color: var(--moss); letter-spacing: .1em; }
.step .ic { width: 44px; height: 44px; border-radius: 12px; background: var(--surface-2); border: 1px solid var(--line); display: grid; place-items: center; margin: 14px 0 16px; }
.step .ic svg { width: 22px; height: 22px; }
.step h3 { font-size: 1.12rem; color: var(--ink); }
.step p { color: var(--ink-soft); font-size: .95rem; margin: 8px 0 0; line-height: 1.55; }
.flow-tail { margin-top: 24px; font-family: var(--font-mono); font-size: 12.5px; color: var(--ink-soft); display: flex; align-items: center; gap: 10px; }
.flow-tail .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--moss); flex: none; }

/* ---------- cta / footer ---------- */
.cta { background: var(--pine); text-align: center; border-bottom: none; overflow: hidden; }
.cta .topo { opacity: .55; }
.cta-inner { position: relative; z-index: 2; }
.cta h2 { color: #fff; font-size: clamp(1.9rem, 5vw, 3rem); }
.cta p { color: #C4D8BE; max-width: 46ch; margin: 16px auto 24px; }
.cta .eyebrow { color: #9FBF8C; }
.cta-btn { font-size: 15px; padding: 13px 22px; }
.site-footer { padding: 28px 0; color: var(--ink-faint); font-size: 13px; }
.footer-inner { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; align-items: center; }

@media (prefers-reduced-motion: reduce) {
  .gbar > i, .track > i { transition: none; }
}
</style>
