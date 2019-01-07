<template>
  <div>
    <athena-toolbar></athena-toolbar>
    <v-container fluid class="top-container">
      <v-layout>
        <v-flex xs6>
          <athena-breadcrumbs :path="path"></athena-breadcrumbs>
        </v-flex>
        <v-flex sm6>
          <div class="athena-filter">
            <v-icon small>mdi-filter-outline</v-icon>
            <input type="text" id="filter" class="athena-filter-input" placeholder="Filter" v-model="filter">
          </div>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container grid-list-lg fluid>
      <v-layout row wrap>
        <athena-node v-for="node in nodes" :node="node" :key="node.id"></athena-node>
      </v-layout>
    </v-container>
    <athena-footer></athena-footer>
  </div>
</template>

<script>
import store from '../store';
import Node from '../components/Node.vue';
import Footer from '../components/Footer.vue';
import Toolbar from '../components/Toolbar.vue';
import Breadcrumbs from '../components/Breadcrumbs.vue';

export default {
  name: 'dashboard',
  props: {
    id: {
      type: String,
      required: false,
      default: 'root'
    }
  },
  components: {
    'athena-node': Node,
    'athena-footer': Footer,
    'athena-toolbar': Toolbar,
    'athena-breadcrumbs': Breadcrumbs
  },
  data() {
    return {
      state: store.state,
      filter: '',
      path: [ ],
      nodes: [ ],
      focus: this.id
    };
  },
  methods: {
    refocus: function(id) {
      if (id) {
        this.focus = id;
      }
      this.$events.$send({
        type: this.$constants.message.focus,
        focus: this.focus
      });
    }
  },
  mounted() {
    const vm = this;

    this.refocus();

    vm.$events.$on(vm.$constants.message.connected, function(object) {
      vm.refocus();
    });

    vm.$events.$on(vm.$constants.message.render, function(message) {
      vm.path.splice(0, vm.path.length);
      for (const item of message.path) {
        vm.path.push(item);
      }

      vm.nodes.splice(0, vm.nodes.length);
      for (const item of message.nodes) {
        vm.nodes.push(item);
      }
    });

    vm.$events.$on(vm.$constants.message.update, function(message) {
      const node = message.node;

      for (let i = 0; i < vm.nodes.length; i++) {
        if (vm.nodes[i].id === node.id) {
          vm.nodes.splice(i, 1, node);
        }
      }
    });
  },
  destroyed() {
  },
  watch: {
    $route: function(route) {
      if (route.params && route.params.id) {
        this.refocus(route.params.id);
      } else {
        this.refocus('root');
      }
    }
  }
};
</script>

<style>
.top-container {
    padding: 0;
}
.athena-filter {
    position: absolute;
    top: 8px;
    right: 8px;
    height: 24px;
}
.athena-filter-input {
    color: white;
    outline: none;
    margin-left: 8px;
    margin-right: 8px;
    width: 200px;
    border-bottom: 1px solid #ddd;
}
.athena-filter-input:focus {
    animation: athena-input 300ms forwards;
    border-bottom: 2px solid #4082b2;
}

@keyframes athena-input {
    from {
        border-bottom: 1px solid #ddd;
    }
    to {
        border-bottom: 2px solid #4082b2;
    }
}
</style>
