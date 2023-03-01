<template>
  <div class="container min-w-max">
    <div class="flex flex-col items-center">
      <h5 class="text-xl text-secondary mb-2 font-semibold">
        {{ group.description }}
      </h5>
      <div class="flex flex-row">
        <div class="container w-auto p-5 m-2 border shadow-md h-min bg-base-100">
          <h5 class="text-lg mb-2">Members</h5>
          <Users :group="group.id" :users="users" />
        </div>
        <div class="mx-5 w-min" :key="reloadTable">
          <CasesTable :group="group.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
const route = useRoute();

const reloadTable = useReload();

const group = await pb
  .collection("groups")
  .getFirstListItem(`name="${route.params.groupname}"`);

const users = await pb
  .collection("users")
  .getList(1, 100, { filter: `memberOf~"${group.id}"` });
</script>

<style></style>
