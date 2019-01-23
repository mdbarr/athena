<template>
  <div>
    <athena-toolbar></athena-toolbar>
    <v-container grid-list-lg fluid>
      <v-layout row wrap>

      </v-layout>
    </v-container>
    <athena-footer></athena-footer>
  </div>
</template>

<script>
import store from '../store';
import Footer from '../components/Footer.vue';
import Toolbar from '../components/Toolbar.vue';

export default {
  name: 'athena-tree',
  components: {
    'athena-footer': Footer,
    'athena-toolbar': Toolbar
  },
  data() {
    return {
      state: store.state
    };
  },
  mounted() {
    const vm = this;

    // initial tree

    vm.$events.$on(vm.$constants.message.connected, function(object) {
      // re-tree
    });
  }
};
</script>

<style>

</style>
