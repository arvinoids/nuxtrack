<template>
  <div class="mx-5">
    <CasesTable :group="group" />
  </div>
</template>

<script setup lang="ts">
const group = useFromGroup();
</script>

<style></style>
