<template>
  <div class="flex justify-center items-start flex-wrap mt-4">
    <UserCard :user="userData" class="mb-3 mx-3" />
    <div class="flex flex-col items-center gap-3">
      <PaginatedCases :userId="userData.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
import type { UsersResponse } from "~/pocketbase-types";

const userData = await pb
  .collection("users")
  .getOne<UsersResponse>(pb.authStore.model!.id);
</script>

<style></style>
