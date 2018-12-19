<template>
<v-footer app fixed class="pa-3" height="28">
  <span>&copy; 2018</span>
  <v-spacer></v-spacer>
  <div v-if="state.isConnected"><span class="green--text">&#9679;</span> Connected</div>
  <div v-else><span class="red--text">&#9679;</span> Offline</div>
</v-footer>
</template>

<script>
import store from '../store';

export default {
  name: 'athena-footer',
  props: {
  },
  data () {
    return {
      state: store.state
    };
  }
};
</script>

<style>
</style>
