<template>
  <form @submit.prevent="handleLogin">
    <div class="mb-3">
      <label class="form-label">Email</label>
      <input
        v-model="email"
        type="email"
        class="form-control"
        required
      >
    </div>
    
    <div class="mb-3">
      <label class="form-label">Пароль</label>
      <input
        v-model="password"
        type="password"
        class="form-control"
        required
      >
    </div>
    
    <button type="submit" class="btn btn-primary">
      Войти
    </button>

    <div v-if="error" class="alert alert-danger mt-3">
      {{ error }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/api';

const email = ref('');
const password = ref('');
const router = useRouter();
const error = ref('');

async function handleLogin() {
  try {
    error.value = '';
    const response = await api.login(email.value, password.value);
    
    if (response.success) {
      router.push('/admin');
    } else {
      error.value = response.error || 'Неверные учетные данные';
    }
  } catch (err) {
    error.value = 'Ошибка соединения с сервером';
  }
}
</script>