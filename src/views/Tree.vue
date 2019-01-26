<template>
  <div>
    <athena-toolbar></athena-toolbar>
    <v-container grid-list-lg fluid>
      <v-layout row wrap>
        <v-treeview v-model="tree" :open="open" :items="items" activatable item-key="id" open-on-click>
          <template slot="prepend" slot-scope="{ item, open, leaf }">
            <v-icon>
              {{ 'mdi-' + item.icon }}
            </v-icon>
          </template>
        </v-treeview>
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
      state: store.state,
      open: [],
      tree: [],
      items: []
    };
  },
  methods: {
    render() {
      this.$events.$send({
        type: this.$constants.message.tree
      });
    }
  },
  mounted() {
    const vm = this;

    vm.render();

    vm.$events.$on(vm.$constants.message.connected, function(object) {
      vm.render();
    });

    vm.$events.$on(vm.$constants.message.tree, function(message) {
      vm.items = message.items;
      if (!vm.open.length) {
        vm.open = [ 'root' ];
      }
    });
  }
};
</script>

<style>

</style>
