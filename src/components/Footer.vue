<template>
<v-footer app fixed class="athena-footer" height="24">
  <span>&copy; 2018</span>
  <v-spacer></v-spacer>
  <v-chip v-for="term in state.terminals" :key="term.id" close label small color="#111" text-color="white">
    <v-icon left>{{ term.icon }}</v-icon>
    <span class="pl-2 pr-3">
      {{ term.title }}
    </span>
  </v-chip>
  <span class="mr-5"></span>
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
