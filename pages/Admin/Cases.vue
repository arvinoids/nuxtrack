<template>
  <div class="flex flex-col items-center gap-5">
    <AdminCreateDummyCases v-if="currentUser && currentUser.role === 'lead'" />
    <AdminCaseStats />
    <AdminCasesReporter />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});

const currentUser = useCurrentUser();
console.log(currentUser.value);
</script>

<style></style>
