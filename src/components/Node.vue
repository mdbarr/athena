<template>
<v-flex>
  <v-card width="400">
    <div class="node-title">
      <i :class="icon"></i>
      <span>{{ node.title }}</span>
    </div>
    <div class="node-status">
      <i :class="statusIcon"></i> {{ node.status | uppercase }}
      <div class="node-folder" v-if="node.children && node.children.length">
        <i class="mdi mdi-folder"></i><i class="mdi mdi-chevron-right"></i>
      </div>
      <div class="node-child-status" v-if="node.aggregate === 'offline'">
        <i class="mdi mdi-alert-circle"></i>
      </div>
      <div class="node-child-divider" v-if="node.aggregate === 'offline'"></div>
    </div>
    <div class="node-info">
      information
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
  data () {
    return {
    }
  },
  computed: {
    icon () {
      return 'mdi mdi-' + this.node.icon + ' node-title-icon'
    },
    statusIcon () {
      if (this.node.status === 'online') {
        return 'mdi mdi-check-circle-outline'
      } else if (this.node.status === 'offline') {
        return 'mdi mdi-alert-outline'
      } else {
        return 'mdi mdi-help-rhombus-outline'
      }
    }
  }
}
</script>

<style>
.node-title {
    border-left: 12px solid #3f647f;
    font-family: monospace;
    font-size: 20px;
    font-weight: 700;
    height: 32px;
    line-height: 32px !important;
    padding: 0;
    text-align: center;
}
.node-title-icon {
    left: 16px;
    position: absolute;
}
.node-title-shift {
    left: -12px;
    position: relative;
}
.node-status {
    background-color: #3f647f;
    font-family: monospace;
    font-size: 18px;
    font-weight: 700;
    height: 28px;
    line-height: 26px !important;
    padding-left: 6px;
}
.node-child-divider {
    border-bottom: 28px solid #CA392D;
    border-left: 28px solid transparent;
    float: right;
    padding: 0px;
    width: 30px;
}
.node-child-status {
    background-color: #CA392D;
    float: right;
    font-family: monospace;
    font-weight: 700;
    height: 28px;
    padding: 0px;
    width: 30%;
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
    border-left: 12px solid #3f647f;
    font-family: monospace;
    min-height: 100px;
    padding: 4px;
}
</style>
