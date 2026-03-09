<template>
  <div class="flex flex-row py-2">
    <div>
      <UserCard :user="user" />
    </div>
    <div class="flex flex-col gap-2 mx-2">
      <div v-if="showAssignToSelf()"><AssignCase :user="user" :group="group" /></div>
      <PaginatedCases :userId="user.id" :group="group.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GroupsResponse, UsersResponse } from "~/pocketbase-types";

const route = useRoute();
const pb = useNuxtApp().$pb;
const currentUser = useCurrentUser();

const user = await pb
  .collection("users")
  .getFirstListItem<UsersResponse>(`username="${route.params.username}"`);
const group = await pb
  .collection("groups")
  .getFirstListItem<GroupsResponse>(`name="${route.params.groupname}"`);

function showAssignToSelf() {
  return (
    currentUser.value!.role === "admin" ||
    currentUser.value!.role === "lead" ||
    group.is_l3
  );
}
</script>

<style></style>
