<template>
  <div>
    <p class="text-center text-sm pt-5">
      &copy; 2023
      <a href="https://solutionsteam.lrdc.lexmark.com/"
        >Rotation Tracker Ver. {{ value }}Lexmark Solutions Support</a
      >
    </p>
    <p class="text-xs text-center text-base-200 italic">Rotation Tracker v{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
const { value } = await pb.collection("settings").getFirstListItem('field="version"');
</script>

<style></style>
