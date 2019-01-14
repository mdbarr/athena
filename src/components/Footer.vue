<template>
<v-footer app fixed class="athena-footer" height="24">
  <span>&copy; 2018</span>
  <v-spacer></v-spacer>
  <div v-if="state.isConnected"><span class="green--text">&#9679;</span> online</div>
  <div v-else><span class="red--text">&#9679;</span> offline</div>
</v-footer>
</template>

<script>
import store from '../store';

export default {
  name: 'athena-footer',
  props: {
  },
  data() {
    return {
      state: store.state
    };
  }
};
</script>

<style>
.athena-footer {
    padding: 0px 10px;
    min-height: 20px;
    font-size: 11px;
    font-weight: 700;
}
</style>
