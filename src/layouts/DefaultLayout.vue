<template>
    <div class="layout">
        <Header />

        <main class="container py-4 flex-grow-1">
        <slot />
        </main>

        <Footer />
    </div>
</template>

<script setup lang="ts">
import Header from '../components/HeaderComponent.vue'
import Footer from '../components/FooterComponent.vue'
</script>

<style scoped>
.layout {
display: flex;
flex-direction: column;
min-height: 100vh;
}

main {
flex: 1;
}
</style>
