<template>
  <select class="select max-w-xs select-xs" v-model="colorMode.preference">
    <option disabled selected>Color Mode</option>
    <option v-for="theme of themes" :key="theme">{{ theme }}</option>
  </select>
</template>

<script setup>
const colorMode = useColorMode();
const themes = ["light", "dark"];
</script>
