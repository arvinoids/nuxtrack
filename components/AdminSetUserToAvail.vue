<template>
  <div class="flex gap-2 shadow justify-between w-[45ch] items-center px-3 py-2">
    <div class="flex gap-1">
      <div
        class="badge badge-xs w-[5px] badge-circle mt-[2px]"
        :class="user.status === 'On leave' ? 'badge-neutral' : 'badge-accent'"
        :title="user.status"
      >
        {{ user.status === "On leave" ? "L" : "R" }}
      </div>
      <span>{{ user.fullname }}</span>
    </div>
    <button class="btn btn-sm btn-secondary" @click="setToAvail(user.id)">
      Set to Available
    </button>
  </div>
</template>

<script setup lang="ts">
import type { LogData } from "custom-types";
import type { user } from "pocketbase-types";
const currentUser = useCurrentUser();

const props = defineProps<{
  user: user;
}>();
async function setToAvail(userId: string) {
  try {
    await useChangeUserStatus(userId, "Available");
    const res = await useUserIsBackFromLeave(userId);
  } catch (e: any) {
    useShowToast(e.message, "failed");
  }
  const message = `${props.user.username} status was changed to Available`;
  useShowToast(message, "success");
  const logData: LogData = {
    user: currentUser.value!.username,
    type: "changed status",
    details: message,
  };
  await logActivity(logData);
}
</script>
