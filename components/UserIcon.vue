<template>
  <div class="avatar relative">
    <div :class="`ring-${getColor(user.status)}  w-4 rounded-full`">
      <div v-if="avatar">
        <img
          :src="avatar"
          class="filter"
          :class="{ grayscale: user.status !== 'Available' }"
        />
        <div
          v-if="user.status !== 'Available'"
          :class="`absolute inset-0 bg-${getColor(
            user.status
          )} rounded-full mix-blend-multiply`"
        ></div>
      </div>
      <div v-else :class="`flex text-${getColor(user.status)}`">
        <Icon name="ic:twotone-account-circle" size="1rem" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UsersResponse } from "~/pocketbase-types";

const props = defineProps<{
  user: UsersResponse;
}>();
const avatar = await useGetAvatarUrl(props.user);
</script>

<style></style>
