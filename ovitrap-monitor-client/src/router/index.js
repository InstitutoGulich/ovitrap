import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'about',
    component: AboutView
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '../views/RegisterView.vue')
  },
  {
    path: '/home',
    name: 'home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/HomeView.vue'),
    meta: { requiresLogin: true }
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import(/* webpackChunkName: "about" */ '../views/UploadView.vue'),
    meta: { requiresLogin: true }
  },
  {
    path: '/database',
    name: 'database',
    component: () => import(/* webpackChunkName: "database" */ '../views/DatabaseView.vue'),
    meta: { requiresLogin: true }
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import(/* webpackChunkName: "reports" */ '../views/ReportsView.vue'),
    meta: { requiresLogin: true }
  },
  {
    path: '/help',
    name: 'help',
    component: () => import(/* webpackChunkName: "help" */ '../views/HelpView.vue'),
    meta: { requiresLogin: true }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import(/* webpackChunkName: "contact" */ '../views/ContactView.vue'),
    meta: { requiresLogin: true }
  },
  {
    path: '/eval',
    name: 'eval',
    component: () => import(/* webpackChunkName: "eval" */ '../views/EvalView.vue'),
    meta: { requiresLogin: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "about" */ '../views/SettingsView.vue'),
    meta: { requiresLogin: true }
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // close nav
  store.commit('closeNavigationDrawer')
  document.title = "Ovitrap Monitor | " + to.name;

  if (to.matched.some(record => record.meta.requiresLogin)) {
      if( store.state.user.username == null)
        next("/login")
      else 
        next()
  } else {
      next()
  }
})

export default router
