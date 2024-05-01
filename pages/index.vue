<template>
  <div class="flex flex-col overflow-hidden w-full" v-if="authenticated">
    <div class="self-center w-full">
      <QuickDashboard />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const userAuth = useAuth();
const pb = useNuxtApp().$pb;

userAuth.value.isAuthenticated = pb.authStore.isValid;
const authenticated = computed(() => {
  return userAuth.value.isAuthenticated;
});
</script>
