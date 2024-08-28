<template>
  <div class="flex flex-col items-center gap-5">
    <AdminCasesReporter />
    <AdminCaseStats />
    <AdminCreateDummyCases />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});
</script>

<style></style>
