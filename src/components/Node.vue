<template>
<v-flex>
  <v-card width="400">
    <div :class="'node-title ' + node.status.health">
      <i :class="icon"></i>
      <span>{{ node.name }}</span>
      <v-menu offset-y left light nudge-top="2" class="node-menu">
        <i slot="activator" class="mdi mdi-dots-vertical node-menu-icon"></i>
        <v-list dense>
          <v-list-tile @click="() => {}">
            <v-list-tile-content>
              <v-list-tile-title>Update</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-avatar><v-icon small>mdi-update</v-icon></v-list-tile-avatar>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
    <div :class="'node-status ' + node.status.health">
      <i :class="statusIcon"></i> {{ node.status.health | uppercase }}
      <div class="node-folder" v-if="node.children && node.children.length">
        <i class="mdi mdi-folder"></i><i class="mdi mdi-chevron-right"></i>
      </div>
      <div :class="'node-child-status ' + node.status.aggregate" v-if="node.status.aggregate !== 'healthy'">
        <i class="mdi mdi-alert-circle" v-if="node.status.aggregate !== 'healthy'"></i>
      </div>
      <div :class="'node-child-divider ' + node.status.aggregate" v-if="node.status.aggregate !== 'healthy'"></div>
    </div>
    <div :class="'node-info ' + node.status.health">
      {{ node.description }}
    </div>
  </v-card>
</v-flex>
</template>

<script>
export default {
  name: 'athena-node',
  props: {
    node: Object
  },
  data() {
    return {
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
    }
  }
};
</script>

<style>

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
.node-menu-icon:hover {
    color: #5F97BF;
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
}
.node-folder:hover {
    background-color: #666;
}
.node-info {
    border-left: 12px solid #222;
    font-family: monospace;
    min-height: 100px;
    padding: 4px;
}
.node-info.healthy {
    border-left: 12px solid #3f647f;
}
</style>
