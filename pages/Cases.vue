<template>
  <div class="flex flex-col items-center gap-2">
    <h2 class="text-xl text-secondary mb-2 font-semibold">All Cases</h2>
    <PaginatedCases />
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
const auth = useAuth();
if (pb.authStore.isValid) {
  auth.value.isAuthenticated = true;
}
</script>

<style></style>
