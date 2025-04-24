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
import { ref, onMounted } from 'vue'
import api from '../api/api'
import FiltersPanel from '../components/FiltersPanel.vue'
import RoomCard from '../components/RoomCard.vue'
import type { Room, RoomFilters } from '@/types/models'

const rooms = ref<Room[]>([])
const filteredRooms = ref<Room[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    rooms.value = await api.getRooms()
    filteredRooms.value = rooms.value
  } catch (e: any) {
    error.value = e.message || 'Ошибка загрузки данных'
  } finally {
    loading.value = false
  }
})

async function applyFilters(filters: RoomFilters) {
  try {
    loading.value = true
    filteredRooms.value = await api.getRooms(filters)
  } catch (e) {
    console.error('Ошибка фильтрации:', e)
  } finally {
    loading.value = false
  }
}
</script>
