<template>
<div>
  <v-navigation-drawer v-model="drawer" clipped fixed app>
    <v-list dense>
      <v-list-tile @click="true">
        <v-list-tile-action>
          <v-icon>mdi-pillar</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Dashboard</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="true">
        <v-list-tile-action>
          <v-icon>mdi-file-tree</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Tree View</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="true">
        <v-list-tile-action>
          <v-icon>mdi-view-list</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>List View</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="true">
        <v-list-tile-action>
          <v-icon>mdi-bell-outline</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Alerts</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider class="ma-2"></v-divider>
      <v-list-tile @click="true">
        <v-list-tile-action>
          <v-icon>mdi-brain</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Knowledgebase</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="true">
        <v-list-tile-action>
          <v-icon>mdi-note-outline</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Notes</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="true">
        <v-list-tile-action>
          <v-icon>mdi-folder-key-network-outline</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Credentials</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider class="ma-2"></v-divider>
      <v-list-tile @click="true">
        <v-list-tile-action>
          <v-icon>mdi-account-multiple-outline</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Users</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="true">
        <v-list-tile-action>
          <v-icon>mdi-puzzle-outline</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Plugins</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="true">
        <v-list-tile-action>
          <v-icon>mdi-settings-outline</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Settings</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar app fixed clipped-left dense class="athena-toolbar">
    <v-btn icon @click.stop="drawer = !drawer">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <img src="../assets/athena.svg" width="32" class="mr-5">
    <img src="../assets/athena-text.svg" class="athena-title">
    <v-spacer></v-spacer>
    <v-menu offset-y left>
      <v-btn slot="activator" flat>
        Mark &nbsp; <v-icon>mdi-account-circle</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile @click="navigate('profile')">
           <v-list-tile-content>
             <v-list-tile-title>Profile</v-list-tile-title>
           </v-list-tile-content>
           <v-list-tile-avatar><v-icon small>mdi-account-edit</v-icon></v-list-tile-avatar>
        </v-list-tile>
        <v-list-tile @click="navigate('settings')">
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-avatar><v-icon small>mdi-settings-outline</v-icon></v-list-tile-avatar>
        </v-list-tile>
        <v-list-tile @click="logout()">
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-avatar><v-icon small>mdi-logout-variant</v-icon></v-list-tile-avatar>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
  <v-progress-linear v-if="state.loading" :indeterminate="true" color="white" height="2" class="athena-progress"></v-progress-linear>
  <div v-else class="athena-progress-filler"></div>
</div>
</template>

<script>
import store from '../store';

export default {
  name: 'athena-toolbar',
  props: {
  },
  data() {
    return {
      state: store.state,
      drawer: false
    };
  },
  methods: {
    navigate(where) {
      this.$router.push({ name: where });
    },
    logout() {
      this.state.loggedIn = false;
      this.$router.push({ name: 'login' });
    }
  }
};
</script>

<style>
.athena-title {
    height: 32px;
    padding-left: 8px;
}
.athena-toolbar {
    background-image: linear-gradient(to right, #3f647f 0%, #3f637f 100%);
}
.athena-progress {
    margin: 0px;
}
.athena-progress-filler {
    height: 2px;
}
</style>
