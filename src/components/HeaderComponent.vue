<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand" to="/">Отель "Элеон"</router-link>
      
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Главная</router-link>
          </li>
        </ul>
        
        <div class="d-flex">
          <router-link 
            v-if="isAuthenticated"
            to="/admin" 
            class="btn btn-outline-light me-2"
          >
            Админ-панель
          </router-link>
          
          <button 
            v-if="isAuthenticated"
            @click="logout" 
            class="btn btn-outline-light"
          >
            Выйти
          </button>
          
          <router-link 
            v-else
            to="/login" 
            class="btn btn-outline-light"
          >
            Вход
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('authToken')
})

function logout() {
  localStorage.removeItem('authToken')
  router.push('/login')
}
</script>