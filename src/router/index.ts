import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/new',
      name: 'new',
      component: () => import('../views/NewPage.vue'),
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login-page',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/agent-select',
      name: 'agent-select',
      component: () => import('../views/AgentSelectView.vue'),
    },
  ],
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  // 检查是否已登录（这里简单检查localStorage中是否有token）
  const token = localStorage.getItem('auth_token')
  
  // 如果已登录且访问登录页面，则跳转到agent选择页面
  if (token && (to.path === '/' || to.path === '/login')) {
    next('/agent-select')
    return
  }
  
  // 如果未登录且访问非登录页面，则跳转到登录页面
  if (!token && to.path !== '/' && to.path !== '/login') {
    next('/')
    return
  }
  
  next()
})

export default router
