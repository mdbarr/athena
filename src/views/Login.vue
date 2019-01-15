<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark dense class="athena-toolbar">
            <v-avatar size="40"><img src="../assets/athena.svg" class="athena-logo"></v-avatar>
            <v-toolbar-title>
              <img src="../assets/athena-text.svg" class="athena-title">
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field prepend-icon="mdi-account" name="athena-login" label="Login" type="text" browser-autocomplete="new-password"></v-text-field>
              <v-text-field prepend-icon="mdi-lock" name="athena-password" label="Password" type="password" browser-autocomplete="new-password"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#3f647f" @click.native="login()">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import store from '../store';
export default {
  name: 'Login',
  data() {
    return {
      state: store.state
    };
  },
  methods: {
    login() {
      this.state.loggedIn = true;
      this.$router.replace({ name: 'dashboard' });
    }
  }
};
</script>

<style scoped>
.athena-logo {
    padding-top: 4px;
}
.athena-title {
    height: 32px;
    padding-left: 8px;
    padding-top: 4px;
}
.athena-toolbar {
    background-image: radial-gradient(#3f647f, #335772);
}
</style>
