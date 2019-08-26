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
      component: () => { return import('./views/Dashboard.vue'); }
    },
    {
      path: '/login',
      name: 'login',
      component: () => { return import('./views/Login.vue'); }
    },
    {
      path: '/view/:id',
      name: 'view',
      component: () => { return import('./views/Dashboard.vue'); }
    },
    {
      path: '/table',
      name: 'table',
      component: () => { return import('./views/Table.vue'); }
    },
    {
      path: '/tree',
      name: 'tree',
      component: () => { return import('./views/Tree.vue'); }
    },

    {
      path: '*', redirect: '/'
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (!store.state.loggedIn && to.name !== 'login') {
    return next({ path: '/login' });
  }
  return next();
});

export default router;
