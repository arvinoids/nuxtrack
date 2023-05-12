<template>
  <div class="p-3 shadow-lg border w-[300px]">
    <h5 class="">
      User: <span class="text-accent">{{ user.fullname }}</span>
    </h5>
    <h5>
      Shortname: <span class="text-accent">{{ user.username }}</span>
    </h5>
    <h5>
      Status: <span :class="`text-${getColor(user.status)}`">{{ user.status }}</span>
    </h5>
    <h5>
      Role: <span class="text-accent">{{ user.role }}</span>
    </h5>
    <h5>
      Email: <span class="text-accent">{{ user.email }}</span>
    </h5>

    <div class="flex justify-center mt-1">
      <nuxt-link :to="`/user/${user.username}`" class="link-secondary"
        >All Cases</nuxt-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { Record } from "pocketbase";

const props = defineProps<{
  user: Record;
}>();
</script>

<style></style>
