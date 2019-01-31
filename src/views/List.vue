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
            <td :class="'text-xs-center node-health node-' + props.item.status.health">{{ props.item.status.health }}</td>
            <td class="text-xs-center">{{ props.item.status.aggregate }}</td>
            <td class="text-xs-center">{{ props.item.status.updatedAt | calendar }}</td>
            <td class="text-xs-center">{{ props.item.status.triggeredAt | calendar }}</td>
            <td class="text-xs-left">{{ props.item.parent | uuid }}</td>
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
    },
    reconnect() {
      if (this.state.mode === this.$constants.mode.list) {
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

    vm.state.mode = vm.$constants.mode.list;
    vm.render();

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
.node-health {
    font-weight: 700 !important;
}
.node-health.node-healthy {
    color: #335772;
}
.node-health.node-unknown {
    color: #222;
}
.node-health.node-unstable {
    color: #6a3e9a;
}
.node-health.node-error {
    color: #ff7e00;
}
.node-health.node-failed {
    color: #e4181d;
}
</style>
