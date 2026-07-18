<template>
  <v-app id="app">
    <v-app-bar app flat height="72" class="app-bar-glass px-2 px-md-6">
      <div class="brand">
        <v-avatar size="42" class="brand-logo mr-3">
          <v-icon color="white">mdi-map-marker-radius</v-icon>
        </v-avatar>
        <div class="brand-text">
          <span class="brand-title">Deponije Rožaje</span>
          <span class="brand-subtitle d-none d-sm-block">
            Lokalizovanje deponija rožajske teritorije
          </span>
        </div>
      </div>

      <v-spacer />

      <v-btn
        v-if="$store.state.user"
        color="primary"
        depressed
        rounded
        class="text-none font-weight-medium"
        @click="logout"
      >
        <v-icon left small>mdi-logout</v-icon>
        Odjavi se
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import firebase from 'firebase'

export default {
  name: "App",
  components: {
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$store.state.user = null;
          this.$router.push({
            name: "Login"
          });
        });
    }
  }
};
</script>

<style>
#app {
  font-family: "Roboto", "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background:
    radial-gradient(1200px 600px at 100% -10%, rgba(16, 185, 129, 0.10), transparent 60%),
    radial-gradient(900px 500px at -10% 110%, rgba(20, 184, 166, 0.08), transparent 55%),
    var(--v-background-base) !important;
}

.app-bar-glass.v-app-bar {
  background: rgba(11, 18, 32, 0.72) !important;
  backdrop-filter: saturate(160%) blur(14px);
  -webkit-backdrop-filter: saturate(160%) blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.brand {
  display: flex;
  align-items: center;
  min-width: 0;
}

.brand-logo {
  background: linear-gradient(135deg, #10b981, #14b8a6) !important;
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.35);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  min-width: 0;
}

.brand-title {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.2px;
  color: #f1f5f9;
}

.brand-subtitle {
  font-size: 0.72rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
