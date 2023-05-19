<template>
  <div class="flex flex-col items-center gap-3">
    <AdminTabs />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});
</script>
