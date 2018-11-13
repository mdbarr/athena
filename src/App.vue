<template>
<v-app id="app" dark>
  <v-content>
    <img src="./assets/owl.svg" class="owl">
    <router-view></router-view>
  </v-content>
</v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
    }
  }
}
// #347597
</script>

<style>
.owl {
    position: fixed;
    width: 400px;
    right: 40px;
    bottom: 0px;
    z-index: 0;
}

.athena-breadcrumb-link {
    text-decoration: none;
    color: white;
}
.athena-breadcrumb-link:hover {
    text-decoration: underline;
    color: white;
}
.athena-breadcrumbs {
    padding: 8px 0px 4px 12px;
}
</style>
