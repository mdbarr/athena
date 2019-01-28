<template>
  <div>
    <athena-toolbar></athena-toolbar>
    <v-container grid-list-lg fluid>
      <v-layout row wrap>
        <v-data-table :headers="headers" :items="items" :rows-per-page-items="rows" class="elevation-1 athena-list-table" >
          <template slot="items" slot-scope="props">
            <td><v-icon>{{ 'mdi-' + props.item.icon }}</v-icon></td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.type }}</td>
            <td class="text-xs-right">{{ props.item.status.health }}</td>
            <td class="text-xs-right">{{ props.item.status.aggregate }}</td>
            <td class="text-xs-right">{{ props.item.status.updatedAt }}</td>
            <td class="text-xs-right">{{ props.item.status.triggeredAt }}</td>
            <td class="text-xs-left">{{ props.item.parent }}</td>
          </template>
        </v-data-table>
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
  name: 'athena-list',
  components: {
    'athena-footer': Footer,
    'athena-toolbar': Toolbar
  },
  data() {
    return {
      state: store.state,
      headers: [ {
        text: '',
        sortable: false
      }, {
        text: 'Name',
        sortable: true,
        value: 'name'
      }, {
        text: 'Type',
        sortable: true,
        value: 'type'
      }, {
        text: 'Health',
        sortable: true,
        value: 'status.health'
      }, {
        text: 'Aggregate',
        sortable: true,
        value: 'status.aggregate'
      }, {
        text: 'Updated At',
        sortable: true,
        value: 'status.updatedAt'
      }, {
        text: 'Triggered At',
        sortable: true,
        value: 'status.triggeredAt'
      }, {
        text: 'Parent',
        sortable: true,
        value: 'parent'
      } ],
      rows: [25, 50, 100, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }],
      items: []
    };
  },
  methods: {
    render() {
      this.state.loading = true;
      this.$events.$send({
        type: this.$constants.message.list
      });
    }
  },
  mounted() {
    const vm = this;

    vm.render();

    vm.$events.$on(vm.$constants.message.connected, function(object) {
      vm.render();
    });

    vm.$events.$on(vm.$constants.message.list, function(message) {
      vm.state.loading = false;
      vm.items = message.items;
    });
  }
};
</script>

<style>
.athena-list-table {
    z-index: 1
}
</style>
