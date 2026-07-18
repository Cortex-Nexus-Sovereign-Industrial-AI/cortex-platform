import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores'

const routes = [
  {
    path: '/login',
    component: () => import('../pages/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../pages/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/composer',
    component: () => import('../pages/Composer.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/analytics',
    component: () => import('../pages/Analytics.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/accounts',
    component: () => import('../pages/Accounts.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
