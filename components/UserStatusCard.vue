<template>
  <div class="rounded-md bg-base-100 text-xs shadow-sm mx-2 w-[200px]">
    <div class="flex flex-col items-center p-3 gap-1">
      <div class="indicator">
        <span
          class="indicator-item status"
          :class="{ [`status-${badgeColor}`]: true }"
        ></span>
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt=""
          class="h-10 w-10 flex-none rounded-full border-2"
          :class="{ [`border-${badgeColor}`]: true }"
        />
        <Icon
          v-else
          name="fluent:person-16-regular"
          alt=""
          class="h-10 w-10 flex-none rounded-full bg-gray-200"
        />
      </div>
      <nuxt-link :to="`/user/${user.username}`" class="text-sm">{{
        user.fullname
      }}</nuxt-link>
      <div
        class="badge badge-sm min-w-max cursor-pointer rounded-full"
        :class="{ [`badge-${badgeColor}`]: true }"
        @click="show = true"
        v-if="currentPath.fullPath !== '/Admin/Users'"
      >
        {{ status.status }}
      </div>
      <div
        v-else
        class="badge badge-sm min-w-max cursor-pointer"
        :class="{ [`badge-${badgeColor}`]: true }"
      >
        {{ status.status }}
      </div>
      <div class="text-xs mx-1">{{ status.message }}</div>

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
            class="input-xs input-border bg-base-200 rounded mb-1"
            v-model="status.message"
            placeholder="Enter status message here..."
          />
          <p v-for="choice in choices">
            <span
              class="badge badge-sm badge-outline cursor-pointer my-[1px]"
              :class="{ [`badge-${choice.color}`]: true }"
              @click="changeStatus(choice.status as statuschoice); show = false"
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
    <div :v-if="false" name="for tailwind to prevent treeshake of these classes">
      <span class="bg-secondary badge-secondary border-secondary"></span>
      <span class="bg-error badge-error border-error"></span>
      <span class="bg-neutral badge-neutral border-neutral"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { statuschoice, LogData } from "custom-types";
const pb = useNuxtApp().$pb;

const user = ref(pb.authStore.model!);
const show = ref(false);
const avatarUrl = await useGetAvatarUrl(user.value);

const status = ref<{ status: string; message: string }>({
  status: pb.authStore.model!.status,
  message: pb.authStore.model!.message,
});
const auth = useAuth();
let choices = STATUS_CHOICES;
if (user.value.role === "user") choices = STATUS_CHOICES_USER;

async function changeStatus(newStatus: statuschoice) {
  try {
    const oldStatus = pb.authStore.model!.status;
    useUserWhoChangedStatus().value = user.value.username;
    await useChangeUserStatus(user.value.id, newStatus, status.value.message);
    status.value.status = newStatus;
    if (
      (oldStatus === "On leave" || oldStatus === "Rest day") &&
      oldStatus !== newStatus
    ) {
      await useUserIsBackFromLeave(user.value.id);
    }
    if (
      (newStatus === "On leave" || newStatus === "Rest day") &&
      oldStatus !== newStatus
    ) {
      await useUserOnLeave(user.value.id);
    }
    const logData: LogData = {
      user: user.value.username,
      type: "changed status",
      details: newStatus + " - " + status.value.message,
    };
    let log = await logActivity(logData);
    useUserWhoChangedStatus().value = user.value.username;
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
  return "neutral";
});

async function logout() {
  const outStatus = user.value.role === "user" ? "Outside shift" : "Not available";

  useChangeUserStatus(user.value.id, outStatus, null);

  logActivity({
    user: user.value.username,
    type: "logged out",
    details: outStatus,
  });

  pb.authStore.clear();
  navigateTo("/Login");
  auth.value.isAuthenticated = false;
}

const menu = ref(null);
onClickOutside(menu as MaybeRef, (event) => {
  show.value = false;
});

pb.collection("users").subscribe(user.value.id, async () => {
  status.value = await useGetUserStatus(user.value.id);
});

pb.collection("users").subscribe(pb.authStore.model!.id, (e) => {
  if (e.action === "update") {
    pb.authStore.save(pb.authStore.token, e.record);
    console.log("AuthStore updated with realtime data:", pb.authStore.model);
  }
});

const router = useRouter();
const currentPath = ref(router.currentRoute);
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
