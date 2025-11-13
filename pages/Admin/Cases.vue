<template>
  <div class="flex flex-col items-center gap-5">
    <AdminCreateDummyCases v-if="currentUser && currentUser.role === 'lead'" />
    <AdminCaseArchiver />
    <AdminCaseStats />
    <AdminCasesReporter />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});

const currentUser = useCurrentUser();
</script>

<style></style>
