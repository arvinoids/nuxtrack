<template>
  <div class="rounded-md bg-base-100 text-xs shadow-sm mx-2 w-[160px]" v-if="currentUser">
    <div class="flex flex-col items-center p-3 gap-1">
      <div class="indicator">
        <span class="indicator-item status" :class="`status-${badgeColor}`"></span>
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt=""
          class="h-10 w-10 flex-none rounded-full border-2"
          :class="`border-${badgeColor}`"
        />
        <Icon
          v-else
          name="fluent:person-16-regular"
          alt=""
          class="h-10 w-10 flex-none rounded-full bg-gray-200"
        />
      </div>
      <nuxt-link :to="`/user/${currentUser.username}`" class="text-sm text-center">{{
        currentUser.fullname
      }}</nuxt-link>
      <div
        class="badge badge-sm min-w-max cursor-pointer rounded-full"
        :class="`badge-${badgeColor}`"
        @click="show = true"
        v-if="currentPath.fullPath !== '/Admin/Users'"
      >
        {{ status.status }}
      </div>
      <div
        v-else
        class="badge badge-sm min-w-max cursor-pointer"
        :class="`badge-${badgeColor}`"
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
            <div
              class="text-xs cursor-default font-semibold self-end border px-1 hover:bg-error hover:text-white"
              @click="show = false"
            >
              ✕
            </div>
          </div>
          <input
            type="text"
            class="input-sm h-5 px-2 text-xs input-border bg-base-200 rounded mb-1"
            v-model="status.message"
            placeholder="Your status message..."
          />
          <p v-for="choice in choices">
            <span
              class="badge badge-sm badge-outline cursor-pointer my-[1px]"
              :class="{ [`badge-${choice.color}`]: true }"
              @click="changeStatus(choice.status as statuschoice); show = false;"
            >
              {{ choice.status }}</span
            >
          </p>
        </div>
      </transition>
      <div class="btn btn-xs btn-circle uppercase mt-2" @click="logout()" title="Logout">
        <Icon name="ic:round-log-out" size="1rem" />
      </div>
    </div>
    <div :v-if="false" name="for tailwind to prevent treeshake of these classes">
      <span class="bg-secondary badge-secondary border-secondary"></span>
      <span class="bg-error badge-error border-error"></span>
      <span class="bg-neutral badge-neutral border-neutral"></span>
    </div>
    <GlobalLoading :show="changingStatus">{{ loadingMessage }}</GlobalLoading>
  </div>
</template>

<script setup lang="ts">
import type { statuschoice, LogData } from "custom-types";
import {
  useCheckAndDisableUserStaleLeaveRecordForGroup,
  useUserOnLeaveOrRestDay,
} from "~/composables/userfunctions";
import { LogsTypeOptions, type LeavesReasonOptions } from "~/pocketbase-types";
const pb = useNuxtApp().$pb;
const changingStatus = ref(false);

const currentUser = useCurrentUser() ?? pb.authStore.model;
const show = ref(false);
const avatarUrl = await useGetAvatarUrl(currentUser.value);
const loadingMessage = ref("");
const showDropdown = useShowDropdown();

const status = ref<{ status: string; message: string }>({
  status: pb.authStore.model!.status,
  message: pb.authStore.model!.message,
});

const currentUserGroups = await useGetUserGroups(currentUser.value?.id);
const auth = useAuth();
let choices = STATUS_CHOICES;
if (currentUser.value?.role === "user") choices = STATUS_CHOICES_USER;
if (
  currentUser.value &&
  currentUser.value.status !== "On leave" &&
  currentUser.value.status !== "Rest day"
) {
  for (const group of currentUserGroups) {
    await useCheckAndDisableUserStaleLeaveRecordForGroup(currentUser.value.id, group);
  }
}

const { set } = useStatus();

async function changeStatus(newStatus: statuschoice) {
  set({
    message: `Changing status to ${newStatus}...`,
    type: "info",
    loading: true,
    timeout: 0,
  });
  changingStatus.value = true;
  try {
    const oldStatus = pb.authStore.model!.status;
    await useChangeUserStatus(currentUser.value?.id, newStatus, status.value.message);
    status.value.status = newStatus;
    if (
      (oldStatus === "On leave" || oldStatus === "Rest day") &&
      oldStatus !== newStatus
    ) {
      set({
        message: `Computing dummy cases earned from ${oldStatus}`,
        type: "info",
        loading: true,
        timeout: 0,
      });
      await useUserIsBackFromLeaveOrRestDay(currentUser.value?.id, oldStatus);
      logActivity({user:currentUser.value?.username,type:LogsTypeOptions["debug"],details:"Initiated User back from leave",debug:true})
    }
    if (
      (newStatus === "On leave" || newStatus === "Rest day") &&
      oldStatus !== newStatus
    ) {
      loadingMessage.value = `Setting record for your ${newStatus}`;
      await useUserOnLeaveOrRestDay(
        currentUser.value?.id,
        newStatus as LeavesReasonOptions
      );
    }
    loadingMessage.value = "Logging to database";
    await logActivity({
      user: currentUser.value?.username,
      type: LogsTypeOptions["changed status"],
      details: "from " + oldStatus + " to " + newStatus + (status.value.message ? " - " + status.value.message : "")
    });
    showDropdown.value = false;
    useUserLeaveNotificationShown().value = true;
    set({
      message: `Status changed to ${newStatus}`,
      type: "success",
      loading: false,
      timeout: 3000,
    });
  } catch (e) {
    console.log(e);
  }
  changingStatus.value = false;
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
  let outStatus = currentUser.value?.role === "user" ? "Outside shift" : "Not available";
  console.log("user status is ", currentUser.value?.status);
  currentUser.value?.status === "On leave" || currentUser.value?.status === "Rest day"
    ? (outStatus = currentUser.value.status)
    : null;
  useChangeUserStatus(currentUser.value?.id, outStatus as statuschoice, null);

  logActivity({
    user: currentUser.value?.username,
    type: LogsTypeOptions["logged out"],
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

pb.collection("users").subscribe(currentUser.value?.id, async () => {
  status.value = await useGetUserStatus(currentUser.value?.id);
  currentUser.value = pb.authStore.model;
});

pb.collection("users").subscribe(currentUser.value?.id, (e) => {
  if (e.action === "update") {
    pb.authStore.save(pb.authStore.token, e.record);
    currentUser.value = pb.authStore.model;
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
