import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { ref } from 'vue'
import type { Room } from '../types/models';
import axios from 'axios'
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
    meta: { title: 'Загрузка номера...' }
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

 router.afterEach( async (to) => {
  const roomId = to.params.id as string
  const baseTitle = 'Отель "Элеон"'
  const refRoom = ref<Room | null>(null)

  try {
    const res = await axios.get(`http://localhost:3001/rooms/${roomId}`)
    refRoom.value = res.data

    if (refRoom.value) {
      let title = refRoom.value.title
      document.title = `${title} | ${baseTitle}`
    }
  } catch (e) {
    console.error('Ошибка при загрузке данных номера', e)
  }
})

export default router
