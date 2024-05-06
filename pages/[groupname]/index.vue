<template>
  <div class="container min-w-max">
    <div class="flex flex-col items-center">
      <h5 class="text-xl text-secondary mb-4 font-semibold">
        {{ group.description }}
      </h5>
      <div class="flex flex-row">
        <div class="container w-auto p-5 m-2 border shadow-md h-min bg-base-100">
          <h5 class="text-lg mb-2 font-bold">Rotation</h5>
          <GroupUsersList :users="users" :group="group" />
        </div>
        <div class="mx-5 w-min" :key="reloadTable">
          <PaginatedCases :group="group.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { group, user } from "pocketbase-types";
const pb = useNuxtApp().$pb;
const route = useRoute();
const userStore = useUserStore();

const reloadTable = ref(0);

const group: group = await pb
  .collection("groups")
  .getFirstListItem(`name="${route.params.groupname}"`);

let users: user[] = userStore.value.filter((user) => user.memberOf.includes(group.id));
if (!users.length) users = (await useGetUsersOfGroup(group.id)).items;
</script>

<style></style>
