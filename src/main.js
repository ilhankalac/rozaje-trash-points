import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import firebase from './firebase/firebase'
import { rtdbPlugin } from 'vuefire'
import { store } from './store.js'

Vue.use(rtdbPlugin)
Vue.config.productionTip = false

new Vue({
  vuetify,
  firebase,
  store,
  render: h => h(App)
}).$mount('#app')