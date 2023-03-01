<template>
  <ul>
    <li v-for="user in users.items" class="text-accent">
      <div>{{ user.fullname }}</div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ListResult } from "pocketbase";

const props = defineProps<{
  group?: string;
  users: ListResult;
}>();

let users = await useGetUsers(props.group);
</script>

<style></style>
