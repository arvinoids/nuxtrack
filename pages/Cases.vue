<template>
  <div class="flex flex-col items-center">
    <CasesTable />
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
