<template>
  <div v-if="loading">Загрузка...</div>
  <div v-else-if="error" class="text-danger">Ошибка: {{ error }}</div>
  <div v-else class="row">
    <div class="col-md-8">
      <h2>{{ room?.title }}</h2>
      <ImageGallery :images="room?.images || []" />
      <p class="mt-3">{{ room?.description }}</p>
      <p><strong>Цена:</strong> {{ room?.price }} ₽ / ночь</p>
      <p><strong>Мест:</strong> {{ room?.capacity }}</p>
      <p><strong>Тип кровати:</strong> {{ room?.bedType }}</p>
    </div>
    <div class="col-md-4">
      <BookingWidget v-if="room" :room="room" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/api'
import type { Room } from '../types/models'
import ImageGallery from '../components/ImageGallery.vue'
import BookingWidget from '../components/BookingWidget.vue'

const route = useRoute()
const room = ref<Room | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    if (isNaN(id)) {
      throw new Error('Неверный ID номера')
    }
    
    room.value = await api.getRoom(id)
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'Не удалось загрузить данные номера'
    console.error('Ошибка загрузки номера:', e)
  } finally {
    loading.value = false
  }
})
</script>