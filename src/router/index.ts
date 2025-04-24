import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import HotelListView from '../views/HotelListView.vue'
import HotelRoomView from '../views/HotelRoomView.vue'
import LoginView from '../views/LoginView.vue'
import Cookies from 'js-cookie';
import AdminPanel from '../views/AdminPanel.vue'
import AdminRooms from '../views/admin/RoomView.vue'
import AdminBookings from '../views/admin/BookingsView.vue'

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
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Вход', guestOnly: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPanel,
    meta: { title: 'Админ-панель', requiresAuth: true },
    children: [
      {
        path: 'rooms',
        component: AdminRooms,
        meta: { title: 'Управление номерами' }
      },
      {
        path: 'bookings',
        component: AdminBookings,
        meta: { title: 'Управление бронированиями' }
      }
    ]
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

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!Cookies.get('auth_token');

  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Redirect to login (not authenticated)');
    next('/login');
  } else {
    next();
  }
});

export default router
