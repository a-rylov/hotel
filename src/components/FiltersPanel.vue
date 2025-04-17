<template>
  <div class="mb-4 p-3 border rounded">
    <h5>Фильтр</h5>
    <div class="row g-2">
      <div class="col-md-3">
        <label>Макс. цена</label>
        <input v-model.number="filters.maxPrice" type="number" class="form-control" />
      </div>
      <div class="col-md-3">
        <label>Кол-во мест</label>
        <input v-model.number="filters.capacity" type="number" class="form-control" />
      </div>
      <div class="col-md-3">
        <label>Тип кровати</label>
        <select v-model="filters.bedType" class="form-control">
          <option value="">Любой</option>
          <option value="односпальная">Односпальная</option>
          <option value="двуспальная">Двуспальная</option>
        </select>
      </div>
      <div class="col-md-3">
        <label>Дата заселения</label>
        <input v-model="filters.date" type="date" class="form-control" />
      </div>
    </div>
    <button class="btn btn-secondary mt-3" @click="emitFilters">Применить</button>
  </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue'
import type { RoomFilters } from '../types/models'

const filters = ref<RoomFilters>({
  maxPrice: null,
  capacity: null,
  bedType: '',
  date: ''
})

const emit = defineEmits<{
  (e: 'filter-change', filters: RoomFilters): void
}>()

function emitFilters() {
  emit('filter-change', filters.value)
}
</script>
  