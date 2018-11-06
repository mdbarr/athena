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
      <img src="./assets/athena.svg" width="32">
    </v-btn>
    <img src="./assets/athena-text.svg" class="athena-title">
    <v-spacer></v-spacer>
    <v-menu offset-y>
      <v-btn slot="activator" flat>
        Mark &nbsp; <v-icon>mdi-account-circle</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile @click="navigate('profile')">
          <v-list-tile-title>Profile</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="navigate('settings')">
          <v-list-tile-title>Settings</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="logout()">
          <v-list-tile-title>Logout</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
  <v-content>
    <router-view></router-view>
  </v-content>
  <v-footer app fixed class="pa-3" height="28">
    <span>&copy; 2018</span>
    <v-spacer></v-spacer>
    <div><span class="green--text">&#9679;</span> Connected</div>
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
.athena-title {
    height: 32px;
    padding-left: 8px;
}
.athena-toolbar {
    background-image: linear-gradient(to right, #243949 0%, #517fa4 100%);
    background-image: linear-gradient(to top, #1e3c72 0%, #1e3c72 1%, #2a5298 100%);
    background-image: linear-gradient(to right, #3f647f 0%, #3f637f 100%);
}

.owl {
    position: fixed;
    width: 400px;
    right: 40px;
    bottom: 40px;
    z-index: 0;
}
</style>
