<template>
  <v-breadcrumbs :items="path" dark class="athena-breadcrumbs">
    <v-icon slot="divider">mdi-arrow-right-bold</v-icon>
    <template slot="item" slot-scope="props">
      <router-link v-if="props.item.depth !== (path.length - 1)" class="athena-breadcrumb-link" :to="'/view/' + props.item.id">
        <v-icon small class="athena-breadcrumb-link">{{ 'mdi-' + props.item.icon }}</v-icon>
        <span v-if="path.length === 1 || props.item.name !== 'root'" class="pl-2">{{ props.item.name === 'root' ? 'ATHENA' : props.item.name.toUpperCase() }}</span>
      </router-link>
      <span v-else>
        <v-icon small>{{ 'mdi-' + props.item.icon }}</v-icon>
        <span v-if="path.length === 1 || props.item.name !== 'root'" class="pl-2">{{ props.item.name === 'root' ? 'ATHENA' : props.item.name.toUpperCase() }}</span>
      </span>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  name: 'athena-breadcrumbs',
  props: { path: {
    type: Array,
    required: true
  } },
  data () {
    return {};
  }
};
</script>

<style>
.athena-breadcrumb-link:hover {
    text-decoration: none;
    font-weight: 700;
    color: #4082b2;
}
</style>
