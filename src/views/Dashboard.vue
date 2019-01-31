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
            <div v-if="filter && filter.length" class="athena-filter-clear" @click.stop="filter = ''">
              <v-icon small>mdi-close</v-icon>
            </div>
          </div>
          <div class="athena-sort">
            <v-icon small>mdi-sort</v-icon>
            <select id="sort" class="athena-sort-input" v-model="sort">
              <option value="default" selected>Default</option>
              <option value="a-z">Alphabetical A-Z</option>
              <option value="z-a">Alphabetical Z-A</option>
            </select>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container grid-list-lg fluid>
      <v-layout row wrap>
        <athena-node v-for="node in filterSort()" :node="node" :key="node.id"></athena-node>
        <v-btn color="#335772" fab dark small fixed bottom right class="mb-4 mr-2" @click.stop="true">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
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
      sort: 'default',
      path: [ ],
      nodes: [ ],
      focus: this.id
    };
  },
  methods: {
    strcmp: function(a, b, inverted) {
      if (a < b) {
        return (inverted) ? 1 : -1;
      } else if (b < a) {
        return (inverted) ? -1 : 1;
      } else {
        return 0;
      }
    },
    filterNodes: function() {
      if (!this.filter.length) {
        return this.nodes;
      }

      return this.nodes.filter(item =>
        item.name.includes(this.filter));
    },
    filterSort: function() {
      const filtered = this.filterNodes().slice();

      if (this.sort === 'a-z') {
        return filtered.sort((a, b) => this.strcmp(a.name, b.name));
      } else if (this.sort === 'z-a') {
        return filtered.sort((a, b) => this.strcmp(a.name, b.name, true));
      } else {
        return filtered;
      }
    },
    refocus: function(id) {
      if (id) {
        this.focus = id;
      }
      this.state.loading = true;
      this.$events.$send({
        type: this.$constants.message.focus,
        focus: this.focus
      });
    },
    reconnect() {
      if (this.state.mode === this.$constants.mode.focus) {
        this.refocus();
      }
    },
    render(message) {
      this.state.loading = false;
      this.path.splice(0, this.path.length);
      for (const item of message.path) {
        this.path.push(item);
      }

      this.nodes.splice(0, this.nodes.length);
      for (const item of message.nodes) {
        this.nodes.push(item);
      }
    },
    update(message) {
      const node = message.node;
      for (let i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].id === node.id) {
          this.nodes.splice(i, 1, node);
        }
      }
    }
  },
  created() {
    this.$events.$on(this.$constants.message.connected, this.reconnect);
  },
  mounted() {
    this.$events.$on(this.$constants.message.render, this.render);
    this.$events.$on(this.$constants.message.update, this.update);

    this.state.mode = this.$constants.mode.focus;
    this.refocus();
  },
  beforeDestroy() {
    this.$events.$off(this.$constants.message.connected, this.reconnect);
    this.$events.$off(this.$constants.message.render, this.render);
    this.$events.$off(this.$constants.message.update, this.update);
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
    right: 248px;
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
.athena-filter-clear {
    position: absolute;
    top: 2px;
    right: 6px;
    cursor: pointer;
}
.athena-sort {
    position: absolute;
    top: 8px;
    right: 8px;
    height: 24px;
}
.athena-sort-input {
    appearance: none;
    color: white;
    outline: none;
    margin-left: 8px;
    margin-right: 8px;
    width: 200px;
    border-bottom: 1px solid #ddd;
    border-radius: 0px;
}
.athena-sort-input:focus {
    animation: athena-input 300ms forwards;
    border-bottom: 2px solid #4082b2;
}
.athena-sort::after {
    position: absolute;
    right: 6px;
    font-family: "Material Design Icons";
    content: '\f140';
    font-size: 16px;
    color: white;
    pointer-events: none;
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
