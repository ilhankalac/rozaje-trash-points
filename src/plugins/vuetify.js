import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    options: {
      customProperties: true,
    },
    themes: {
      dark: {
        primary: '#10b981',   // emerald
        secondary: '#14b8a6', // teal
        accent: '#34d399',
        info: '#38bdf8',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#f43f5e',
        background: '#0b1220',
        surface: '#151e2e',
      },
    },
  },
});
