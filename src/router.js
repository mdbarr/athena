import Vue from 'vue';
import Router from 'vue-router';

import Login from './views/Login.vue';
import Dashboard from './views/Dashboard.vue';
import Table from './views/Table.vue';
import Tree from './views/Tree.vue';

import store from './store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/view/:id',
      name: 'view',
      component: Dashboard
    },
    {
      path: '/table',
      name: 'table',
      component: Table
    },
    {
      path: '/tree',
      name: 'tree',
      component: Tree
    },

    { path: '*', redirect: '/' }
  ]
});

router.beforeEach((to, from, next) => {
  if (!store.state.loggedIn && to.name !== 'login') {
    next({ path: '/login' });
  } else {
    next();
  }
});

export default router;
