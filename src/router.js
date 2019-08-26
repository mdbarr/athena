import Vue from 'vue';
import Router from 'vue-router';

import store from './store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('./views/Dashboard.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/view/:id',
      name: 'view',
      component: () => import('./views/Dashboard.vue')
    },
    {
      path: '/table',
      name: 'table',
      component: () => import('./views/Table.vue')
    },
    {
      path: '/tree',
      name: 'tree',
      component: () => import('./views/Tree.vue')
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
