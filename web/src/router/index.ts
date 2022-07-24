import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/home/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/usermanagement',
      name: 'usermanagement',
      component: () => import('../views/usermanagement/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/register/index.vue')
    },
    {
      path: '/friendsList',
      name: 'friendsList',
      component: () => import('../views/friendsList/index.vue')
    },
    {
      path: '/game',
      name: 'game',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/game/index.vue')
    },
    {
      path: '/manage',
      name: 'manage',
      component: () => import('../views/manage/index.vue')
    },
    {
      path: '/startgame',
      name: 'startgame',
      component: () => import('../game/demo1.vue')
    },
  ]
})

export default router
