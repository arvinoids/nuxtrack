<template>
  <div class="container min-w-max">
    <div class="flex flex-col items-center">
      <h5 class="text-xl text-secondary mb-4 font-semibold">
        {{ group.description }}
      </h5>
      <div class="flex flex-row">
        <div class="container w-auto p-5 m-2 border shadow-md h-min bg-base-100">
          <h5 class="text-lg mb-2">Rotation</h5>
          <Users :group="group.id" :users="users" />
        </div>
        <div class="mx-5 w-min" :key="reloadTable">
          <PaginatedCases :group="group.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getOrderedUsers } from "~/composables/userfunctions";
const pb = useNuxtApp().$pb;
const route = useRoute();

const reloadTable = ref(0);

const group = await pb
  .collection("groups")
  .getFirstListItem(`name="${route.params.groupname}"`);

const users = await getOrderedUsers(group.id);
</script>

<style></style>
