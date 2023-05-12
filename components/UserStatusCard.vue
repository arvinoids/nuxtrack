<template>
  <div class="rounded-md bg-base-100 text-xs shadow-sm border mx-2 w-[200px]">
    <div class="flex flex-col items-center p-3 gap-1">
      <div class="indicator">
        <span
          class="indicator-item badge badge-xs"
          :class="{ [`bg-${badgeColor}`]: true }"
        ></span>
        <img :src="avatarUrl" alt="" class="h-10 w-10 flex-none rounded-full" />
      </div>
      <nuxt-link :to="`/user/${user.username}`" class="font-medium text-sm">{{
        user.fullname
      }}</nuxt-link>
      <div
        class="badge badge-sm cursor-pointer min-w-max"
        :class="{ [`badge-${badgeColor}`]: true }"
        @click="show = true"
      >
        {{ status.status }}
      </div>
      <div class="text-secondary text-xs mx-1">{{ status.message }}</div>

      <!-- start of status dropdown -->
      <transition>
        <div
          v-show="show"
          class="absolute p-2 rounded mt-3 shadow-xl w-auto border left-[150px] bg-base-100"
          ref="menu"
        >
          <div class="flex min-w-max items-center justify-between mb-1">
            <p class="text-xs font-semibold">Edit Status...</p>
            <p
              class="text-xs font-semibold self-end border px-1 hover:bg-error hover:text-white"
              @click="show = false"
            >
              ✕
            </p>
          </div>
          <input
            type="text"
            class="input-xs input-border bg-neutral-100 rounded mb-1"
            v-model="status.message"
          />
          <p v-for="choice in choices">
            <span
              class="badge badge-sm badge-outline cursor-pointer my-[1px]"
              :class="{ [`badge-${choice.color}`]: true }"
              @click="changeStatus(choice.status as statuschoice, status.message); show = false"
            >
              {{ choice.status }}</span
            >
          </p>
        </div>
      </transition>
      <div
        class="btn btn-xs btn-warning btn-outline rounded font-medium shadow-sm mt-3"
        @click="logout()"
      >
        Log Out
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { statuschoice } from "custom-types";
const pb = useNuxtApp().$pb;
const props = defineProps<{
  id: string;
}>();
const user = pb.authStore.model!;
const show = ref(false);
const avatarUrl = `https://solutionsteam.lrdc.lexmark.com/pb/api/files/_pb_users_auth_/${user.id}/${user.avatar}`;

const status = ref(await useGetUserStatus(props.id));
const auth = useAuth();
const choices = STATUS_CHOICES;

async function changeStatus(newStatus: statuschoice, newMessage: string) {
  try {
    await useChangeUserStatus(user.id, newStatus, status.value.message);
    status.value.status = newStatus;
  } catch (e) {
    console.log(e);
  }
}

const badgeColor = computed(() => {
  // Get the status of the badge.
  const stat = status.value.status;

  // Loop through the choices array and find the choice with the matching status.
  for (const choice of choices) {
    if (choice.status === stat) {
      return choice.color;
    }
  }
  // If the status is not found, return the default color.
  return "gray-500";
});

function logout() {
  pb.authStore.clear();
  navigateTo("/Login");
  auth.value.isAuthenticated = false;
}

const menu = ref(null);
onClickOutside(menu, (event) => {
  show.value = false;
});
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
