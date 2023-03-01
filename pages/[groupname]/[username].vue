<template>
  <div class="flex flex-row">
    <div>
      <UserCard :user="user" />
    </div>
    <CasesTable :userId="user.id" :group="group.id" />
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
