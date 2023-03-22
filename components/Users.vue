<template>
  <ul>
    <li v-for="user in users.items" class="text-accent">
      <NuxtLink :to="`/${groupName}/${user.username}`"
        ><div>{{ user.fullname }}</div>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ListResult } from "pocketbase";

const props = defineProps<{
  group: string;
  users: ListResult;
}>();

const groupName = await useGetGroupName(props.group);

let users = await useGetUsers(props.group);
</script>

<style></style>
