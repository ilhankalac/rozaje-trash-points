<template>
  <v-app id="app">
    <header class="site-header">
      <div class="site-nav">
        <div class="brand" @click="goTop">
          <span class="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="#93C34D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/>
              <circle cx="12" cy="10" r="2.4"/>
            </svg>
          </span>
          <span class="brand-text">
            Očistimo Rožaje
            <small>civilni monitoring deponija</small>
          </span>
        </div>

        <nav v-if="onHome" class="nav-links">
          <a @click="scrollTo('mapa')">Mapa</a>
          <a @click="scrollTo('statistika')">Statistika</a>
          <a @click="scrollTo('kako')">Kako radi</a>
        </nav>

        <span class="nav-spacer"></span>

        <button v-if="!user" class="hbtn hbtn-ghost" @click="goLogin">Prijava</button>
        <button v-else class="hbtn hbtn-ghost" @click="logout">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>
          Odjavi se
        </button>
        <button class="hbtn hbtn-primary" @click="reportCta">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Prijavi deponiju
        </button>
      </div>
    </header>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import firebase from 'firebase'

export default {
  name: "App",
  computed: {
    user() {
      return this.$store.state.user;
    },
    onHome() {
      return this.$route.name === "Home";
    },
  },
  methods: {
    scrollTo(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    goTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    goLogin() {
      if (this.$route.name !== "Login") this.$router.push({ name: "Login" });
    },
    reportCta() {
      if (this.$route.name !== "Home") {
        this.$router.push({ name: "Home" });
      }
      this.$nextTick(() => this.scrollTo("mapa"));
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$store.state.user = null;
          this.$router.push({ name: "Login" });
        });
    },
  },
};
</script>

<style>
/* ================= Design tokens ================= */
:root {
  --paper: #0B1712;
  --surface: #122019;
  --surface-2: #17271F;
  --ink: #E9EEE7;
  --ink-soft: #A6B7AC;
  --ink-faint: #6E8177;
  --line: #21322A;
  --line-strong: #2C4034;
  --pine: #1C4A36;
  --moss: #93C34D;
  --moss-deep: #A9D264;
  --river: #4F9DB0;
  --rust: #D9764E;
  --rust-deep: #E3906C;
  --topo: rgba(147, 195, 77, 0.09);
  --topo-strong: rgba(147, 195, 77, 0.17);

  --font-grotesk: "Helvetica Neue", Helvetica, "Segoe UI", Arial, system-ui, sans-serif;
  --font-sans: "Roboto", system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
  --font-mono: ui-monospace, "SF Mono", "JetBrains Mono", "Roboto Mono", Menlo, Consolas, monospace;
}

#app {
  font-family: var(--font-sans);
  background: var(--paper) !important;
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Readable selection everywhere — dark text on moss, so green accents stay legible when selected */
::selection { background: #B6E06A; color: #0c1c07; }
::-moz-selection { background: #B6E06A; color: #0c1c07; }

#app h1, #app h2, #app h3 {
  font-family: var(--font-grotesk);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--ink-faint);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.eyebrow::before {
  content: "";
  width: 22px;
  height: 1px;
  background: var(--line-strong);
}

/* ================= Header ================= */
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(11, 23, 18, 0.82);
  backdrop-filter: saturate(150%) blur(12px);
  -webkit-backdrop-filter: saturate(150%) blur(12px);
  border-bottom: 1px solid var(--line);
}
.site-nav {
  display: flex;
  align-items: center;
  gap: 18px;
  height: 64px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 22px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  min-width: 0;
}
.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: var(--pine);
  display: grid;
  place-items: center;
  flex: none;
}
.brand-mark svg { width: 19px; height: 19px; }
.brand-text {
  font-family: var(--font-grotesk);
  font-weight: 800;
  letter-spacing: -0.02em;
  font-size: 1rem;
  line-height: 1.1;
  color: var(--ink);
  display: flex;
  flex-direction: column;
}
.brand-text small {
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 9.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
.nav-links {
  display: none;
  gap: 20px;
  margin-left: 12px;
}
.nav-links a {
  font-size: 14px;
  color: var(--ink-soft);
  cursor: pointer;
  padding: 6px 0;
  border-bottom: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}
.nav-links a:hover { color: var(--ink); border-color: var(--moss); }
.nav-spacer { flex: 1; }

.hbtn {
  font-family: var(--font-sans);
  font-size: 13.5px;
  font-weight: 650;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  padding: 9px 15px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: transform 0.12s ease, background 0.2s ease, box-shadow 0.2s ease;
}
.hbtn:focus-visible { outline: 2px solid var(--river); outline-offset: 2px; }
.hbtn-primary {
  background: var(--moss);
  color: #0c1c07;
  box-shadow: 0 8px 20px -8px rgba(147, 195, 77, 0.6);
}
.hbtn-primary:hover { transform: translateY(-1px); }
.hbtn-ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--line-strong);
}
.hbtn-ghost:hover { background: var(--surface-2); }

@media (min-width: 820px) {
  .nav-links { display: flex; }
}
@media (max-width: 520px) {
  .brand-text small { display: none; }
  .hbtn-primary span { display: none; }
}
</style>
