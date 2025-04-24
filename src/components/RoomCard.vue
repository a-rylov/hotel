<template>
  <div class="col-md-4">
    <div class="card h-100">
      <img 
        v-if="room.images.length" 
        :src="room.images[0]" 
        class="card-img-top" 
        alt="Фото номера"
      />
      <div class="card-body">
        <h5 class="card-title">{{ room.title }}</h5>
        <p class="card-text">Цена: {{ room.price }} ₽ / ночь</p>
        <p class="card-text">Мест: {{ room.capacity }}</p>
        <p class="card-text">Тип кровати: {{ room.bedType }}</p>
        <router-link 
          :to="`/room/${room.id}`" 
          class="btn btn-primary mt-2"
        >
          Подробнее
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Room } from '../types/models'

defineProps<{
  room: Room
}>()
</script>
