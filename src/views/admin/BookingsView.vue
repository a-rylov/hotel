<template>
  <div>
    <h2>Управление бронированиями</h2>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Номер</th>
            <th>Гости</th>
            <th>Даты</th>
            <th>Контакт</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in filteredBookings" :key="booking.id">
            <td>{{ booking.id }}</td>
            <td>{{ getRoomTitle(booking.roomId) }}</td>
            <td>{{ booking.guests }}</td>
            <td>
              {{ formatDate(booking.startDate) }} - 
              {{ formatDate(booking.endDate) }}
            </td>
            <td>{{ booking.contactName }}</td>
            <td>{{ booking.contactEmail }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/api/api'
import type { Booking, Room } from '@/types/models'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

const bookings = ref<Booking[]>([])
const rooms = ref<Room[]>([])
const loading = ref(false)
const searchQuery = ref('')
const dateFilter = ref('')

onMounted(async () => {
  await fetchData()
})

function getRoomTitle(roomId: number) {
  if (!rooms.value || rooms.value.length === 0) return 'Загрузка...'
  const room = rooms.value.find(r => r.id === roomId)
  return room?.title || 'Удалён'
}

async function fetchData() {
  try {
    loading.value = true;
    
    const [bookingsRes, roomsRes] = await Promise.all([
      api.get('/bookings'),
      api.get('/rooms')
    ]);
    
    bookings.value = bookingsRes ?? [];
    rooms.value = roomsRes ?? [];

  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    bookings.value = [];
    rooms.value = [];
  } finally {
    loading.value = false;
  }
}

const filteredBookings = computed(() => {
  if (!bookings.value || bookings.value.length === 0) return []
  
  return bookings.value.filter(booking => {
    const contactName = booking.contactName?.toLowerCase() || ''
    const contactEmail = booking.contactEmail?.toLowerCase() || ''
    const searchTerm = searchQuery.value.toLowerCase()
    
    const matchesSearch = searchQuery.value === '' || 
      contactName.includes(searchTerm) || 
      contactEmail.includes(searchTerm)
    
    const matchesDate = dateFilter.value === '' || 
      (booking.startDate && booking.endDate &&
       booking.startDate <= dateFilter.value && 
       booking.endDate >= dateFilter.value)
    
    return matchesSearch && matchesDate
  })
})

function formatDate(dateString?: string) {
  if (!dateString) return 'Нет даты'
  try {
    return format(new Date(dateString), 'dd.MM.yyyy', { locale: ru })
  } catch {
    return 'Неверная дата'
  }
}
</script>
  
<style scoped>
.table-responsive {
  max-height: 70vh;
  overflow-y: auto;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
}
</style>