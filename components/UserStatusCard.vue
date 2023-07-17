<template>
  <div class="rounded-md bg-base-100 text-xs shadow-sm border mx-2 w-[200px]">
    <div class="flex flex-col items-center p-3 gap-1">
      <div class="indicator">
        <span
          class="indicator-item badge badge-xs"
          :class="{ [`bg-${badgeColor}`]: true }"
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
        class="badge badge-sm min-w-max cursor-pointer"
        :class="{ [`badge-${badgeColor}`]: true }"
        @click="show = true"
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
import { statuschoice, LogData } from "custom-types";
import { Record } from "pocketbase";
const pb = useNuxtApp().$pb;
const props = defineProps<{
  id: string;
}>();
const user = pb.authStore.model!;
const show = ref(false);
const avatarUrl = getAvatarUrl();

function getAvatarUrl() {
  if (pb.authStore.model?.avatar === "") {
    return null;
  } else {
    const user = pb.authStore.model as Record;
    const url = pb.files.getUrl(user, user!.avatar, { thumb: "100x100" });
    return url;
  }
}

const status = ref(await useGetUserStatus(props.id));
const auth = useAuth();
let choices = STATUS_CHOICES;
if (user.role === "user") choices = STATUS_CHOICES_USER;

async function changeStatus(newStatus: statuschoice) {
  try {
    useUserWhoChangedStatus().value = user.username;
    await useChangeUserStatus(user.id, newStatus, status.value.message);
    status.value.status = newStatus;
    const logData: LogData = {
      user: user.username,
      type: "changed status",
      details: newStatus + " - " + status.value.message,
    };
    let log = await logActivity(logData);
    useUserWhoChangedStatus().value = user.username;
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
  const outStatus = user.role === "user" ? "Outside shift" : "Not available";

  useChangeUserStatus(user.id, outStatus, null);

  logActivity({
    user: user.username,
    type: "logged out",
    details: outStatus,
  });

  pb.authStore.clear();
  navigateTo("/Login");
  auth.value.isAuthenticated = false;
}

const menu = ref(null);
onClickOutside(menu, (event) => {
  show.value = false;
});

pb.collection("users").subscribe(user.id, async () => {
  status.value = await useGetUserStatus(user.id);
});

watch(status, async (oldStatus, newStatus) => {
  if (newStatus.status === "On leave") {
    await useUserOnLeave(user.id);
  }
  if (oldStatus.status === "On leave") {
    console.log("execute userbackfromleave");
    const res = await useUserIsBackFromLeave(user.id);
    logActivity({
      user: user.username,
      type: "changed status",
      details: res.status + ":" + res.message,
    });
  }
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
