<template>
  <div class="flex gap-2">
    <div class="">
      <UserCard :user="user" />
    </div>
    <div class="flex flex-col items-center gap-3">
      <PaginatedCases :userId="user.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
const route = useRoute();

const user = await pb
  .collection("users")
  .getFirstListItem(`username="${route.params.username}"`);
</script>

<style></style>
