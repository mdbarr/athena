<template>
<v-layout>
  <v-flex xs12 sm2 pa-3>
    <v-card md-2>
      <div class="node-title">
        <i class="mdi mdi-server-network node-title-icon"></i>
        <span>service a-b-c</span>
      </div>
      <div class="node-status">
        <i class="mdi mdi-check-circle-outline"></i> ONLINE
        <div class="node-folder">
          <i class="mdi mdi-folder"></i><i class="mdi mdi-chevron-right"></i>
        </div>
        <div class="node-child-status">
          <i class="mdi mdi-alert-circle"></i>
        </div>
        <div class="node-child-divider"></div>
      </div>
      <div class="node-info">
        information
      </div>
    </v-card>
  </v-flex>
</v-layout>
</template>

<script>
</script>

<style>
* {
    font-family: monospace
}
.node-title {
    border-left: 12px solid #3f647f;
    height: 32px;
    padding: 0;
    line-height: 32px !important;
    font-size: 20px;
    text-align: center;
}
.node-title-icon {
    position: absolute;
    left: 16px;
}
.node-title-shift {
    position: relative;
    left: -12px;
}
.node-status {
    height: 28px;
    background-color: #3f647f;
    padding-left: 6px;
    line-height: 26px !important;
    font-size: 18px;
}
.node-child-divider {
    width: 30px;
    border-left: 28px solid transparent;
    border-bottom: 28px solid #CA392D;
    padding: 0px;
    float: right;
}
.node-child-status {
    float: right;
    width: 30%;
    height: 28px;
    background-color: #CA392D;
    padding: 0px;
}
.node-folder {
    float: right;
    height: 28px;
    width: 46px;
    text-align: right;
    background-color: #262626;
}
.node-folder:hover {
    background-color: #666;
}
.node-info {
    border-left: 12px solid #3f647f;
    padding: 4px;
    min-height: 100px;
}
</style>
