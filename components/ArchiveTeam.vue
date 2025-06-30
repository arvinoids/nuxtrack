<template>
  <div
    class="flex flex-col text-center m-1 w-[250px] shadow-lg border-neutral-200 border"
  >
    <div class="bg-secondary">
      <div class="flex justify-between">
        <h2 class="ml-3 my-2 text-white max-w-[200px] overflow-hidden whitespace-nowrap">
          {{ team.description }}
        </h2>
      </div>
    </div>

    <div>
      <div v-if="users.length > 0" class="flex flex-col items-start p-3">
        <div v-for="(user, id) in users" :key="user.id" class="my-[0.1rem]">
          {{ user.fullname }}
        </div>
      </div>
      <div v-else class="text-xs mt-3">
        <p>No users in this group.</p>
      </div>
    </div>
    <div class="bg-gray-100 pt-[7px]"></div>
  </div>
</template>

<script setup lang="ts">
import type { GroupsRecord, UsersResponse } from "~/pocketbase-types";

defineProps<{
  team: GroupsRecord;
  users: UsersResponse[];
}>();
</script>

<style></style>
