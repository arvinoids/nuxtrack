<template>
  <div>
    <p class="text-center text-sm pt-5">
      &copy; 2025
      <a href="https://solutionsteam.lrdc.lexmark.com/"
        >Xerox Lexmark Solutions Support</a
      >
    </p>
    <DevOnly>
      <p class="text-xs text-center text-black/40">Database URL {{ db }}</p>
    </DevOnly>
    <p class="text-xs text-center text-black/40 italic">Rotation Tracker v{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
const { value } = await pb.collection("settings").getFirstListItem('field="version"');
const db = useRuntimeConfig().public.pocketBaseURL;
</script>

<style></style>
