<template>
  <div class="p-5 bg-warning m-2 rounded">
    {{ user.username.toUpperCase() }}
  </div>
</template>

<script setup lang="ts">
import type { user } from "pocketbase-types";
defineProps<{ user: user }>();
</script>

<style></style>
