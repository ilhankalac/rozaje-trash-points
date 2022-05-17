import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import firebase from './firebase/firebase'
import { rtdbPlugin } from 'vuefire'
import { store } from './store.js'

Vue.use(rtdbPlugin)
Vue.config.productionTip = false

export const eventBus = new Vue(); // added line

// Global Mixin
import GlobalMixin from './mixins/global';

import router from './router'
Vue.mixin(GlobalMixin);


new Vue({
  vuetify,
  firebase,
  store,
  router,
  render: h => h(App)
}).$mount('#app')