<template>
  <div>
    <athena-toolbar></athena-toolbar>
    <v-container grid-list-lg fluid>
      <v-layout row wrap>
        <v-treeview v-model="tree" :open.sync="open" :items="items" activatable open-on-click>
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
      items: [],
      lookup: {}
    };
  },
  methods: {
    expandAll() {
      this.open = [];
      for (const item in this.lookup) {
        this.open.push(this.lookup[item].id);
      }
    },
    collapseAll() {
      this.open = [];
    },
    detree(node) {
      this.lookup[node.id] = node;
      for (const child of node.children) {
        this.detree(child);
      }
    },
    retree() {
      this.state.loading = true;
      this.$events.$send({
        type: this.$constants.message.tree
      });
    },
    reconnect() {
      if (this.state.mode === this.$constants.mode.tree) {
        this.render();
      }
    },
    render(message) {
      this.state.loading = false;
      this.items = message.items;
      if (!this.open.length) {
        this.open = this.state.tree.open;
      }

      this.detree(this.items[0]);
    },
    update(message) {
      const node = message.node;
      const target = this.lookup[node.id];
      if (target) {
        for (const item in node) {
          if (item !== 'children') {
            target[item] = node[item];
          }
        }
        if (target.id === 'root') {
          target.name = 'ATHENA';
        }
      }
    }
  },
  created() {
    this.$events.$on(this.$constants.message.connected, this.reconnect);
  },
  mounted() {
    this.$events.$on(this.$constants.message.tree, this.render);
    this.$events.$on(this.$constants.message.update, this.update);

    this.state.mode = this.$constants.mode.tree;
    this.retree();
  },
  beforeDestroy() {
    this.$events.$off(this.$constants.message.connected, this.reconnect);
    this.$events.$off(this.$constants.message.tree, this.render);
    this.$events.$off(this.$constants.message.update, this.update);

    this.state.tree.open = this.open;
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
