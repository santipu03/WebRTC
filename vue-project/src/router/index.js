import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAppStore } from '@/stores/app';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/Chat.vue')
    }
  ]
})

// If the connectat variable is false, the user is redirected to the home page
router.beforeEach((to, from, next) => {
  const store = useAppStore();
  if (to.name !== 'home' && !store.getConnectat()) next({ name: 'home' })
  else next()
})

export default router
