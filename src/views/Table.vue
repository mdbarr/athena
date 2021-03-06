<template>
  <div>
    <athena-toolbar></athena-toolbar>
    <v-container grid-list-lg fluid>
      <v-layout row wrap>
        <v-data-table :headers="headers" :items="items" :rows-per-page-items="rows" class="elevation-1 athena-table" >
          <template slot="items" slot-scope="props">
            <td><v-icon>{{ 'mdi-' + props.item.icon }}</v-icon></td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.type }}</td>
            <td :class="'node-health node-' + props.item.status.health">{{ props.item.status.health }}</td>
            <td>{{ props.item.status.aggregate }}</td>
            <td>{{ props.item.status.updatedAt | calendar }}</td>
            <td>{{ props.item.status.triggeredAt | calendar }}</td>
            <td>{{ props.item.parent | uuid }}</td>
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
  name: 'athena-table',
  components: {
    'athena-footer': Footer,
    'athena-toolbar': Toolbar
  },
  data () {
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
      rows: [ 25, 50, 100, {
        'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1
      } ],
      items: [],
      lookup: {}
    };
  },
  methods: {
    retable () {
      this.state.loading = true;
      this.$events.$send({ type: this.$constants.message.table });
    },
    reconnect () {
      if (this.state.mode === this.$constants.mode.table) {
        this.render();
      }
    },
    render (message) {
      this.state.loading = false;
      this.items = message.items;
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        this.lookup[item.id] = i;
      }
    },
    update (message) {
      const node = message.node;
      const index = this.lookup[node.id];
      if (index !== undefined) {
        this.items.splice(index, 1, node);
      }
    }
  },
  created () {
    this.$events.$on(this.$constants.message.connected, this.reconnect);
  },
  mounted () {
    this.$events.$on(this.$constants.message.table, this.render);
    this.$events.$on(this.$constants.message.update, this.update);

    this.state.mode = this.$constants.mode.table;
    this.retable();
  },
  beforeDestroy () {
    this.$events.$off(this.$constants.message.connected, this.reconnect);
    this.$events.$off(this.$constants.message.table, this.render);
    this.$events.$off(this.$constants.message.update, this.update);
  }
};
</script>

<style>
.athena-table {
    width: 100%;
    z-index: 1;
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
