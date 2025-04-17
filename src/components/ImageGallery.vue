<template>
  <div>
    <img 
      :src="currentImage" 
      class="img-fluid rounded border mb-2" 
      style="max-height: 300px; object-fit: cover;" 
    />

    <div class="d-flex gap-2 flex-wrap">
      <img 
        v-for="(img, i) in images" 
        :key="i" 
        :src="img" 
        class="img-thumbnail" 
        style="width: 80px; height: 80px; object-fit: cover; cursor: pointer;"
        @click="currentImage = img" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue'

const props = defineProps<{
  images: string[]
}>()

const currentImage = ref(props.images[0] || '')

watch(() => props.images, (newImages) => {
  currentImage.value = newImages[0] || ''
})
</script>