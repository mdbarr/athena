<template>
  <div>
    <athena-toolbar></athena-toolbar>
    <v-container grid-list-lg fluid>
      <v-layout row wrap>
        <v-treeview v-model="tree" :open="open" :items="items" activatable item-key="id" open-on-click>
          <template slot="prepend" slot-scope="{ item, open, leaf }">
            <v-icon :class="'node-icon node-' + item.status.health">
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
      this.state.loading = true;
      this.$events.$send({
        type: this.$constants.message.tree
      });
    },
    reconnect() {
      if (this.state.mode === this.$constants.mode.tree) {
        this.render();
      }
    }
  },
  created() {
    this.$events.$on(this.$constants.message.connected, this.reconnect);
  },
  destroyed() {
    this.$events.$off(this.$constants.message.connected, this.reconnect);
  },
  mounted() {
    const vm = this;

    vm.state.mode = vm.$constants.mode.tree;
    vm.render();

    vm.$events.$on(vm.$constants.message.tree, function(message) {
      vm.state.loading = false;
      vm.items = message.items;
      if (!vm.open.length) {
        vm.open = [ 'root' ];
      }
    });
  }
};
</script>

<style>
.node-icon.node-healthy {
    color: #335772;
}
.node-icon.node-unknown {
    color: #222;
}
.node-icon.node-unstable {
    color: #6a3e9a;
}
.node-icon.node-error {
    color: #ff7e00;
}
.node-icon.node-failed {
    color: #e4181d;
}
</style>
