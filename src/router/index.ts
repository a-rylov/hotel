import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import HotelListView from '../views/HotelListView.vue'
import HotelRoomView from '../views/HotelRoomView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HotelListView,
    meta: { title: 'Главная' }
  },
  {
    path: '/room/:id',
    name: 'room',
    component: HotelRoomView,
    props: true,
    meta: { title: 'Бронирование комнаты' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.afterEach((to) => {
  const baseTitle = 'Бронирование отеля'
  let title = to.meta.title || ''
  document.title = `${title} | ${baseTitle}`
})

export default router
