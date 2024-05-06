<template>
  <div class="flex flex-col items-center px-5 py-3">
    <div class="text-secondary font-semibold">{{ watcher.name }}</div>
    <div class="text-sm">{{ watcher.start }}</div>
    <div class="text-sm">{{ watcher.end }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  watcher: { name: string; start: string; end: string };
}>();
</script>

<style></style>
