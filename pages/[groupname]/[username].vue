<template>
  <div class="flex flex-row">
    <div>
      <UserCard :user="user" />
    </div>
    <div class="flex flex-col gap-2 mx-2">
      <div><AssignCase :user="user" :group="group.id" /></div>
      <PaginatedCases :userId="user.id" :group="group.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const pb = useNuxtApp().$pb;

const user = await pb
  .collection("users")
  .getFirstListItem(`username="${route.params.username}"`);
const group = await pb
  .collection("groups")
  .getFirstListItem(`name="${route.params.groupname}"`);
</script>

<style></style>
