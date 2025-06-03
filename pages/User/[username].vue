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
import type { UsersResponse } from "~/pocketbase-types";

const pb = useNuxtApp().$pb;
const route = useRoute();

const user = await pb
  .collection("users")
  .getFirstListItem<UsersResponse>(`username="${route.params.username}"`);
</script>

<style></style>
