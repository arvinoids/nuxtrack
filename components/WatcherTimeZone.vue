<template>
  <div class="p-7 mx-2 bg-warning bg-opacity-10">
    <div class="flex flex-col items-center mb-2">
      <div class="font-bold text-accent">{{ geo }}</div>
      <div>{{ range }}</div>
    </div>

    <div class="flex gap-2">
      <div v-for="watcher in watchers">
        <Watcher :watcher="watcher" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { watcher } from "custom-types";
defineProps<{
  geo: string;
  range: string;
  watchers: watcher[];
}>();
</script>
