import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAppStore } from '@/stores/app'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/sala',
      name: 'sala',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RoomView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const store = useAppStore();
  if (to.path !== '/' && !store.getNom()) {
    next('/');
  } else {
    next();
  }
});

export default router
