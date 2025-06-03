<template>
  <div class="flex flex-col items-center gap-3 w-full" v-if="userIsAdmin()">
    <div class="w-full"><AdminTabs /></div>
    <NuxtPage />
  </div>
  <div v-else class="p-5 border flex flex-col gap-3 items-center">
    <p>You are not authorized to view this page.</p>
    <button class="btn btn-primary" @click="navigateTo('/')">Back to dashboard</button>
  </div>
</template>

<script setup lang="ts">
const user = useCurrentUser();
function userIsAdmin() {
  return user.value?.role === "admin" || user.value?.role === "lead";
}
</script>
