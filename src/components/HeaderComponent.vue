<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary w-100">
    <div class="container">
      <!-- Логотип -->
      <router-link class="navbar-brand" to="/">Отель "Элеон"</router-link>
      <div class="collapse navbar-collapse">
        <div class="navbar-nav">
          <router-link class="nav-link" to="/">Главная</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100%;
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
}

.nav-link {
  font-size: 1.2rem;
}
</style>
  