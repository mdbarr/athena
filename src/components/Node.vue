<template>
<v-flex>
  <v-card width="400" class="mb-5">
    <div :class="'node-title ' + node.status.health">
      <i :class="icon"></i>
      <span>{{ node.name }}</span>
      <v-menu offset-y left dark nudge-top="2" class="node-menu">
        <i slot="activator" class="mdi mdi-dots-vertical node-menu-icon"></i>
        <v-list dense class="elevation-3 node-menu-list">
          <v-list-tile v-for="action in node.actions" :key="action.name" @click="invoke(action.name)">
            <v-list-tile-content>
              <v-list-tile-title>{{ action.name | capitalize }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-avatar><v-icon small>{{ 'mdi-' + action.icon }}</v-icon></v-list-tile-avatar>
          </v-list-tile>
          <v-divider class="pb-1"></v-divider>
          <v-list-tile disabled class="node-type-title">
            <v-list-tile-avatar><v-icon small disabled class="small">{{ 'mdi-' + node.icon }}</v-icon></v-list-tile-avatar>
            <v-list-tile-content class="node-type-title">
              <v-list-tile-title class="caption pr-1 node-type-title">{{ node.type.toUpperCase() }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
    <div :class="'node-status ' + node.status.health">
      <i :class="statusIcon"></i> {{ node.status.health | uppercase }}
      <span v-if="node.children && node.children.length">
        <router-link :to="'/view/' + node.id" class="node-folder">
          <i :class="folderIcon"></i><i class="mdi mdi-chevron-right"></i>
        </router-link>
        <div :class="'node-child-status ' + node.status.aggregate" v-if="node.status.aggregate !== 'healthy'">
          <i class="mdi mdi-alert-circle" v-if="node.status.aggregate !== 'healthy'"></i>
        </div>
        <div :class="'node-child-divider ' + node.status.aggregate" v-if="node.status.aggregate !== 'healthy'"></div>
      </span>
    </div>
    <div :class="'node-info ' + node.status.health">
      <span v-html="node.status.description"></span>
      <sparkline class="node-sparkline" width="392" height="30">
        <sparklineLine
          :data="node.status.graph"
          :margin="margin"
          :styles="barStyles"
          :limit="node.status.graph.length"
          />
      </sparkline>
    </div>
  </v-card>
</v-flex>
</template>

<script>
import Sparkline from 'vue-sparklines';

export default {
  name: 'athena-node',
  props: {
    node: Object
  },
  components: {
    sparkline: Sparkline
  },
  data() {
    return {
      margin: 2,
      barStyles: {
        fill: '#54a5ff'
      },
      lineStyles: {
        stroke: '#54a5ff'
      }
    };
  },
  computed: {
    icon() {
      return 'mdi mdi-' + this.node.icon + ' node-title-icon';
    },
    statusIcon() {
      if (this.node.status.health === 'healthy') {
        return 'mdi mdi-check-circle-outline';
      } else if (this.node.status.health === 'failed') {
        return 'mdi mdi-alert-outline';
      } else {
        return 'mdi mdi-help-rhombus-outline';
      }
    },
    folderIcon() {
      if (this.node.folderIcon) {
        return 'mdi mdi-' + this.node.folderIcon;
      } else {
        return 'mdi mdi-folder';
      }
    }
  },
  methods: {
    invoke: function(action) {
      this.$events.$send({
        type: this.$constants.message.action,
        action,
        node: this.node.id
      });
    }
  }
};
</script>

<style>
.mdi-athena::before {
    content: '';
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(../assets/coin.svg);
    background-size: 24px 24px !important;
    width: 24px !important;
    height: 33px !important;
}
.mdi-container::before {
    content: '';
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(../assets/container.svg);
    background-size: 24px 24px !important;
    width: 24px !important;
    height: 33px !important;
}
.small.mdi-athena::before, .small.mdi-container::before {
    background-size: 20px 20px !important;
}
.node-title {
    border-left: 12px solid #222;
    font-family: monospace;
    font-size: 20px;
    font-weight: 700;
    height: 32px;
    line-height: 32px !important;
    padding: 0;
    text-align: center;
    width: 100%;
}
.node-title.healthy {
    border-left: 12px solid #3f647f;
}

.node-title-icon {
    left: 16px;
    position: absolute;
}
.node-menu {
    position: absolute;
    right: 8px;
}
.v-menu__activator--active, .node-menu-icon:hover {
    color: #5F97BF;
}
.node-menu-list {
    overflow: hidden !important;
}
.node-title-shift {
    left: -12px;
    position: relative;
}
.node-status {
    background-color: #222;
    font-family: monospace;
    font-size: 18px;
    font-weight: 700;
    height: 28px;
    line-height: 26px !important;
    padding-left: 6px;
}
.node-status.healthy {
    background-color: #3f647f;
}

.node-child-divider {
    border-bottom: 28px solid #222;
    border-left: 28px solid transparent;
    float: right;
    padding: 0px;
    width: 30px;
}
.node-child-divider.failed {
    border-bottom: 28px solid #CA392D;
}
.node-child-status {
    background-color: #222;
    float: right;
    font-family: monospace;
    font-weight: 700;
    height: 28px;
    padding: 0px;
    width: 30%;
}
.node-child-status.failed {
    background-color: #CA392D;
}
.node-folder {
    background-color: #262626;
    float: right;
    height: 28px;
    text-align: right;
    width: 46px;
    color: #fff;
}
.node-folder:hover {
    background-color: #666;
}
.node-info {
    border-left: 12px solid #222;
    font-family: monospace;
    font-size: 10px;
    min-height: 100px;
    padding: 4px;
}
.node-info.healthy {
    border-left: 12px solid #3f647f;
}
.node-sparkline {
    position: absolute;
    left: 10px;
    bottom: -6px;
}
.node-type-title {
    height: 24px !important;
}
.node-type-title > div {
    height: 20px !important;
    padding: 0 4px;
}
</style>
