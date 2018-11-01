<template>
<v-app id="app" dark>
  <v-navigation-drawer v-model="drawer" clipped fixed app>
    <v-list dense>
      <v-list-tile @click="true">
        <v-list-tile-action>
          <v-icon>mdi-dashboard</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Dashboard</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="true">
        <v-list-tile-action>
          <v-icon>mdi-settings</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Settings</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar app fixed clipped-left dense class="athena-toolbar">
    <v-btn icon @click.stop="drawer = !drawer">
      <img src="./assets/athena.svg" width="32" color="white">
    </v-btn>
    <v-toolbar-title class="satyr">ATHENA</v-toolbar-title>
  </v-toolbar>
  <v-content>
    <router-view></router-view>
  </v-content>
  <v-footer app fixed>
    <span class="pl-2">&copy; 2018</span>
  </v-footer>
  <img src="./assets/owl.svg" class="owl">
</v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      drawer: false
    }
  }
}
// #347597
</script>

<style>
@font-face {
    font-family: 'Satyr';
    src: url('./assets/satyr.ttf')  format('truetype');
}
.satyr {
    font-family: Satyr;
    font-size: 28px;
    letter-spacing: 12px;
    margin-top: 8px;
}

.athena-toolbar {
    background-image: linear-gradient(to top, #1e3c72 0%, #1e3c72 1%, #2a5298 100%);
}

.owl {
    position: absolute;
    width: 400px;
    right: 40px;
    bottom: 40px;
    z-index: 0;
}

</style>
