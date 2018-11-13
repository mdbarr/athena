import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  data: {
    state: store.state
  },
  router,
  render: h => h(App)
}).$mount('#app')
