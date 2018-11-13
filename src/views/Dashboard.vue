<template>
  <div>
    <athena-toolbar></athena-toolbar>
    <v-breadcrumbs :items="crumbs" dark class="athena-breadcrumbs">
      <v-icon slot="divider">mdi-arrow-right-bold</v-icon>
      <template slot="item" slot-scope="props">
        <router-link class="athena-breadcrumb-link" :to="props.item.href">
          <v-icon v-if="props.item.icon" small>{{ 'mdi-' + props.item.icon }}</v-icon>
          <span v-else>{{ props.item.text.toUpperCase() }}</span>
        </router-link>
      </template>
    </v-breadcrumbs>
    <v-container grid-list-lg fluid>
      <v-layout row wrap>
        <athena-node></athena-node>
        <athena-node></athena-node>
        <athena-node></athena-node>
        <athena-node></athena-node>
        <athena-node></athena-node>
        <athena-node></athena-node>
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
      } ]
    }
  }
}
</script>

<style>
</style>
