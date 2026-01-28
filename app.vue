<template>
  <div v-if="loading">
    <LoadingMessage />
  </div>
  <NuxtLayout>
    <NuxtPage />
    <StatusMessage compact />
  </NuxtLayout>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const loading = ref(false);
nuxtApp.hook("page:start", () => {
  loading.value = true;
});
nuxtApp.hook("page:finish", () => {
  loading.value = false;
});
</script>
