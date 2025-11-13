<template>
  <div
    class="fixed inset-0 w-screen z-50 h-screen flex items-center justify-center text-primary backdrop-saturate-0 backdrop-brightness-70"
  >
    <div class="p-10 shadow bg-base-100">
      <div class="mb-2 text-center font-semibold">{{ activityName }}</div>
      <progress
        class="progress w-56 progress-primary"
        :value="progressValue"
        max="100"
      ></progress>
      <div class="text-sm">{{ statusMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  progressValue: number;
  activityName: string;
  statusMessage?: string;
}>();
</script>

<style></style>
