<template>
    <div class="admin-panel">
      <h1>Панель администратора</h1>
      
      <div class="admin-nav mb-4">
        <router-link to="/admin/rooms" class="btn btn-outline-primary me-2">Номера</router-link>
        <router-link to="/admin/bookings" class="btn btn-outline-primary">Бронирования</router-link>
      </div>
  
      <router-view></router-view>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  onMounted(() => {
   if (router.currentRoute.value.path === '/admin') {
      router.push('/admin/rooms')
    }
  })
  </script>
  
  <style scoped>
  .admin-panel {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .admin-nav {
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 15px;
  }
  </style>