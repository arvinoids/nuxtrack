<template>
  <div class="flex flex-col overflow-hidden" v-if="auth.isAuthenticated">
    <div class="self-center">
      <DashBoard />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const auth = useAuth();
const pb = useNuxtApp().$pb;

auth.value.isAuthenticated = pb.authStore.isValid;
</script>
