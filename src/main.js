import '@babel/polyfill';
import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import constants from '../common/constants';

import VueNativeSock from 'vue-native-websocket';
import '@mdi/font/css/materialdesignicons.css';

import moment from 'moment';

Vue.config.productionTip = false;

const websocketUrl = (process.env.NODE_ENV === 'production')
  ? 'wss://' + window.location.hostname + '/ws/attach'
  : 'ws://' + window.location.hostname + ':6250/ws/attach';

Vue.use(VueNativeSock, websocketUrl, {
  format: 'json',
  reconnection: true
});

Vue.filter('capitalize', function(value) {
  if (!value) {
    return '';
  }
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter('uppercase', function(value) {
  return (value || '').toUpperCase();
});

Vue.filter('calendar', function(value) {
  return moment(value).calendar();
});

Vue.filter('timestamp', function(value) {
  return moment(value).format('MMMM Do YYYY, h:mm a');
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
