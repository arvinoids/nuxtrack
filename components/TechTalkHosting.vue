<template>
  <div class="p-10 flex flex-col items-center gap-2 box-border">
    <div class="text-xl text-secondary font-semibold">
      Weekly Tech Talk Hosting Rotation
    </div>
    <div class="flex">
      <div v-for="user in hosts">
        <div class="mx-2 bg-yellow-200 rounded-md p-3 shadow-md">
          {{ user.toUpperCase() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const users = await useGetAllUsers();
const hostUsers = users.items.filter(
  (user) => user.role !== "lead" && user.role !== "admin"
);

const pb = useNuxtApp().$pb;

const rec = await pb.collection("settings").getOne("r2nh8eqdweest7b");
const hosts = JSON.parse(rec.value);
</script>

<style></style>
