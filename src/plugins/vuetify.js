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
        primary: '#93C34D',   // moss — fresh growth / action
        secondary: '#4F9DB0', // river — Ibar
        accent: '#A9D264',
        info: '#4F9DB0',
        success: '#93C34D',
        warning: '#E3B23C',
        error: '#D9764E',     // rust — nesređeno
        background: '#0B1712', // deep pine
        surface: '#122019',
      },
    },
  },
});
