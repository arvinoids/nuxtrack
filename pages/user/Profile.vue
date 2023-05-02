<template>
  <div class="flex justify-center items-start flex-wrap">
    <UserCard :user="userData" />
    <div class="flex flex-col items-center gap-3">
      <PaginatedCases :userId="userData.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;

const userData = await pb.collection("users").getOne(pb.authStore.model!.id);
</script>

<style></style>
