<template>
  <div class="border p-3 rounded shadow-sm">
    <h5>Бронирование</h5>

    <div class="mb-3">
      <label class="form-label">Дата заезда</label>
      <input type="date" v-model="startDate" class="form-control" :min="today" />
    </div>

    <div class="mb-3">
      <label class="form-label">Дата выезда</label>
      <input type="date" v-model="endDate" class="form-control" :min="startDate" />
    </div>

    <div class="mb-3">
      <label class="form-label">Имя</label>
      <input v-model="contactName" type="text" class="form-control" />
    </div>

    <div class="mb-3">
      <label class="form-label">Email</label>
      <input v-model="contactEmail" type="email" class="form-control" />
    </div>

    <div class="mb-3">
      <label class="form-label">Количество гостей</label>
      <input v-model.number="guests" type="number" class="form-control" min="1" />
    </div>

    <div class="mb-3" v-if="!isCapacityEnough">
      <div class="alert alert-warning">
        Номер вмещает только {{ room.capacity }} человек. 
        Вы можете <strong>забронировать ещё один номер</strong>.
      </div>
    </div>

    <div class="d-grid">
      <button class="btn btn-success" :disabled="loading" @click="submitBooking">
        {{ loading ? 'Отправка...' : 'Забронировать' }}
      </button>
    </div>

    <div v-if="success" class="alert alert-success mt-3">Бронирование успешно отправлено!</div>
    <div v-if="error" class="alert alert-danger mt-3">Ошибка: {{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import type { Room, Booking } from '../types/models'

// Props
const props = defineProps<{
  room: Room
}>()

// Поля формы
const startDate = ref('')
const endDate = ref('')
const contactName = ref('')
const contactEmail = ref('')
const guests = ref(1)

// Статусы
const loading = ref(false)
const success = ref(false)
const error = ref('')

// Дата сегодня
const today = new Date().toISOString().split('T')[0]

// Проверка вместимости
const isCapacityEnough = computed(() => guests.value <= props.room.capacity)

// Загруженные брони
const existingBookings = ref<Booking[]>([])

function datesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  const aStart = new Date(startA)
  const aEnd = new Date(endA)
  const bStart = new Date(startB)
  const bEnd = new Date(endB)
  return aStart <= bEnd && bStart <= aEnd
}

async function loadBookings() {
  try {
    const res = await axios.get(`http://localhost:3001/bookings?roomId=${props.room.id}`)
    existingBookings.value = res.data
  } catch (e: any) {
    console.error('Ошибка загрузки бронирований:', e)
  }
}

async function submitBooking() {
  error.value = ''
  success.value = false

  if (!startDate.value || !endDate.value || !contactName.value || !contactEmail.value) {
    error.value = 'Пожалуйста, заполните все поля.'
    return
  }

  if (new Date(startDate.value) >= new Date(endDate.value)) {
    error.value = 'Дата выезда должна быть позже даты заезда.'
    return
  }

  // Проверка на пересечение с существующими бронями
  const isConflict = existingBookings.value.some(b =>
    datesOverlap(startDate.value, endDate.value, b.startDate, b.endDate)
  )

  if (isConflict) {
    error.value = 'Выбранные даты уже заняты. Пожалуйста, выберите другой период.'
    return
  }

  const booking = {
    roomId: props.room.id,
    startDate: startDate.value,
    endDate: endDate.value,
    guests: guests.value,
    contactName: contactName.value,
    contactEmail: contactEmail.value
  }

  loading.value = true
  try {
    await axios.post('http://localhost:3001/bookings', booking)
    success.value = true
    // сброс формы
    startDate.value = ''
    endDate.value = ''
    contactName.value = ''
    contactEmail.value = ''
    guests.value = 1

    // обновить брони
    await loadBookings()
  } catch (e: any) {
    error.value = e.message || 'Не удалось отправить бронирование.'
  } finally {
    loading.value = false
  }
}

// Загрузка бронирований при инициализации компонента
onMounted(() => {
  loadBookings()
})
</script>
