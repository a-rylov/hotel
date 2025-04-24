<template>
    <div>
      <h2>Управление номерами</h2>      
      <div class="table-responsive">
        <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Цена, ₽</th>
            <th>Вместимость, чел</th>
            <th>Тип кровати</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.id">
            <td>{{ room.id }}</td>
            <td>{{ room.title }}</td>
            <td>{{ room.description }}</td>
            <td>{{ room.price }}</td>
            <td>{{ room.capacity }}</td>
            <td>{{ room.bedType }}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import api from '@/api/api'
  import type { Room } from '@/types/models'
  
  const rooms = ref<Room[]>([])
  const loading = ref(false)
  
  onMounted(async () => {
    await fetchRooms()
  })
  
  async function fetchRooms() {
    try {
      loading.value = true
      rooms.value = await api.get('/rooms')
    } catch (error) {
      console.error('Ошибка загрузки номеров:', error)
    } finally {
      loading.value = false
    }
  }
  </script>