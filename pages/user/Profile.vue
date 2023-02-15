<template>
  <div class="flex justify-center items-start flex-wrap">
    <div class="shadow-md placeholder rounded-lg mx-5 p-5 border">
      <p class="font-semibold">Name: {{ userData.fullname }}</p>
      <p>Username: {{ userData.username }}</p>
      <p v-if="pb.authStore.model.id === userData.id">Email: {{ userData.email }}</p>
    </div>
    <div class="flex flex-col items-center gap-3">
      <CasesTable :userId="userData.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;

const userData = await pb.collection("users").getOne(pb.authStore.model.id);
console.log(userData);
</script>

<style></style>
