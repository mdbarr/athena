<template>
  <div>
    <athena-toolbar></athena-toolbar>
    <v-container fluid class="top-container">
      <v-layout>
        <v-flex xs6>
          <v-breadcrumbs :items="crumbs" dark class="athena-breadcrumbs">
            <v-icon slot="divider">mdi-arrow-right-bold</v-icon>
            <template slot="item" slot-scope="props">
              <router-link class="athena-breadcrumb-link" :to="props.item.href">
                <v-icon v-if="props.item.icon" small>{{ 'mdi-' + props.item.icon }}</v-icon>
                <span v-else>{{ props.item.text.toUpperCase() }}</span>
              </router-link>
            </template>
          </v-breadcrumbs>
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
import store from '../store'
import Node from '../components/Node.vue'
import Footer from '../components/Footer.vue'
import Toolbar from '../components/Toolbar.vue'

export default {
  name: 'dashboard',
  components: {
    'athena-node': Node,
    'athena-footer': Footer,
    'athena-toolbar': Toolbar
  },
  data () {
    return {
      state: store.state,
      filter: '',
      crumbs: [ {
        text: 'dashboard',
        disabled: false,
        href: 'breadcrumbs_dashboard',
        icon: 'bank'
      }, {
        text: 'Root',
        disabled: false,
        href: 'breadcrumbs_root',
        icon: 'pillar'
      } ],
      nodes: [ {
        id: 1,
        title: 'Service A',
        icon: 'server-network',
        status: 'offline',
        aggregate: 'online',
        children: []
      }, {
        id: 2,
        title: 'Service B',
        icon: 'web',
        status: 'online',
        aggregate: 'offline',
        children: [ 1 ]
      } ]
    }
  }
}
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
    border-bottom: 2px solid #4c7999;
}

@keyframes athena-input {
    from {
        border-bottom: 1px solid #ddd;
    }
    to {
        border-bottom: 2px solid #4c7999;
    }
}
</style>