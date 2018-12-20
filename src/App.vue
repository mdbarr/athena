<template>
<v-app id="app" dark>
  <v-content>
    <img src="./assets/owl.svg" class="owl">
    <router-view></router-view>
  </v-content>
</v-app>
</template>

<script>
import store from './store';

const CLIENT_VERSION = require('../package.json').version;

export default {
  name: 'App',
  data() {
    return {
      state: store.state,
      version: CLIENT_VERSION
    };
  },
  destroyed() {
    if (this.socket) {
      this.socket.close();
    }
  },
  created() {
    const vm = this;

    vm.$options.sockets.onopen = function(message) {
      vm.socket = message.target;
      vm.state.isConnected = true;
    };

    vm.$options.sockets.onclose = function() {
      vm.socket = null;
      vm.state.isConnected = false;
    };

    vm.$options.sockets.onmessage = function(message) {
      try {
        vm.socket = message.target;

        if (message.data === vm.$constants.message.ping) {
          vm.socket.send(vm.$constants.message.pong);
          return;
        }

        message = JSON.parse(message.data);
        if (vm.version !== message.version) {
          console.log('VERSION MISMATCH', vm.version, message.version);
          window.location.reload(true);
          return;
        }

        if (message && message.type) {
          vm.$events.$emit(message.type, message);
        }
      } catch (error) {
        console.log('Error in websocket message', error);
      }
    };

    vm.$events.$on(vm.$constants.message.connected, function(object) {
      console.log('Connected!');
      console.log(object);
    });

    vm.$events.$on(vm.$constants.message.send, function(object) {
      vm.socket.sendObj(object);
    });
  }
};
// #347597
</script>

<style>
.owl {
    position: fixed;
    width: 400px;
    right: 40px;
    bottom: 0px;
    z-index: 0;
}

.athena-breadcrumb-link {
    text-decoration: none;
    color: white;
}
.athena-breadcrumb-link:hover {
    text-decoration: underline;
    color: white;
}
.athena-breadcrumbs {
    padding: 8px 0px 4px 12px;
}
</style>
