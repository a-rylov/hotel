<template>
  <div>
    <h1 class="mb-4">Номера отеля</h1>
    <FiltersPanel @filter-change="applyFilters" />

    <div v-if="loading">Загрузка номеров...</div>
    <div v-else-if="error" class="text-danger">Ошибка: {{ error }}</div>
    
    <div v-else class="row g-3">
      <RoomCard 
        v-for="room in filteredRooms" 
        :key="room.id" 
        :room="room"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import type { Room } from '../types/models'
import FiltersPanel from '../components/FiltersPanel.vue'
import RoomCard from '../components/RoomCard.vue'

const rooms = ref<Room[]>([])
const filteredRooms = ref<Room[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await axios.get<Room[]>('http://localhost:3001/rooms')
    rooms.value = res.data
    filteredRooms.value = res.data
  } catch (e: any) {
    error.value = e.message || 'Ошибка загрузки данных'
  } finally {
    loading.value = false
  }
})

function applyFilters(filters: any) {
  filteredRooms.value = rooms.value.filter((room) => {
    const matchPrice = !filters.maxPrice || room.price <= filters.maxPrice
    const matchCapacity = !filters.capacity || room.capacity >= filters.capacity
    const matchBed = !filters.bedType || room.bedType === filters.bedType
    const matchDates =
      !filters.date ||
      room.availableDates.includes(filters.date)

    return matchPrice && matchCapacity && matchBed && matchDates
  })
}
</script>
