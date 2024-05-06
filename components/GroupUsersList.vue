<template>
  <div>
    <div v-for="user in users">
      <NuxtLink :to="`/${group.name}/${user.username}`"
        ><div class="hover:text-accent">{{ user.fullname }}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { group, user } from "pocketbase-types";
defineProps<{
  group: group;
  users: user[];
}>();
</script>

<style></style>
