<template>
  <UserOrder :groupId="group" :users="users" />
</template>

<script setup lang="ts">
import type { user } from "pocketbase-types";

const props = defineProps<{
  group: string;
  users: user[];
}>();

//user data is already in sequence

const groupName = await useGetGroupName(props.group);
</script>

<style></style>
