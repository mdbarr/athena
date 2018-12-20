import '@babel/polyfill';
import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import constants from '../common/constants';

import VueNativeSock from 'vue-native-websocket';

Vue.config.productionTip = false;

const websocketUrl = (process.env.NODE_ENV === 'production')
  ? 'wss://athena.blue/ws/attach'
  : 'ws://localhost:6250/ws/attach';

Vue.use(VueNativeSock, websocketUrl, {
  format: 'json',
  reconnection: true
});

Vue.filter('uppercase', function(value) {
  return (value || '').toUpperCase();
});

Vue.prototype.$constants = constants;

Vue.prototype.$events = new Vue({
  methods: {
    $send(object) {
      this.$emit(constants.message.send, object);
    }
  }
});

new Vue({
  data: {
    state: store.state
  },
  router,
  render: h => h(App)
}).$mount('#app');

console.log(constants.assets.banner + '\n' + constants.assets.athena);
