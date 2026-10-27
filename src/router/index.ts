import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Details from '@/views/Details.vue'
import OrderView from '@/views/OrderView.vue'
import UserView from '@/views/UserView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileChange from '@/views/ProfileChange.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/details/:id',
      component: Details
    },
    {
      path: '/order/:id',
      component: OrderView,
    },
    {
      path: '/user',
      component: UserView,
    },
    {
      path: '/login',
      component: LoginView
    },
    {
      path: '/register',
      component: RegisterView
    },
        {
      path: '/user/profileChange',
      component: ProfileChange
    }
  ],
})

export default router
