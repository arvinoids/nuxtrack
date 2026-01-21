<template>
  <div class="flex gap-2 shadow justify-between w-[45ch] items-center px-3 py-2">
    <div class="flex gap-1">
      <div
        class="badge badge-xs w-[5px] badge-circle mt-[2px]"
        :class="
          user.status === 'On leave' || user.status === 'Rest day'
            ? 'badge-neutral'
            : 'badge-accent'
        "
        :title="user.status"
      >
        {{ user.status === "On leave" ? "L" : "R" }}
      </div>
      <span>{{ user.fullname }}</span>
    </div>
    <button class="btn btn-sm btn-secondary" @click="setToAvail(user.id)">
      Set to Available
    </button>
    <GlobalLoading :show="changingStatus">{{ loadingMessage }}</GlobalLoading>
  </div>
</template>

<script setup lang="ts">
import type { LogData } from "custom-types";
import type { LeavesReasonOptions, UsersRecord } from "~/pocketbase-types";
const currentUser = useCurrentUser();

const props = defineProps<{
  user: UsersRecord & {};
}>();

const changingStatus = ref(false);
const loadingMessage = ref("");
const oldStatus = props.user.status as "On leave" | "Rest day";
async function setToAvail(userId: string) {
  changingStatus.value = true;
  loadingMessage.value = `Changing ${props.user.username} status from ${oldStatus} to Available`;

  try {
    loadingMessage.value = `Computing dummy cases earned from ${oldStatus}`;
    await useChangeUserStatus(userId, "Available");
    await useUserIsBackFromLeaveOrRestDay(userId, oldStatus as LeavesReasonOptions);
  } catch (e: any) {
    useShowToast(e.message, "failed");
  }
  const message = `${props.user.username} status was changed from ${oldStatus} to Available`;
  useShowToast(message, "success");
  loadingMessage.value = "Logging to database";
  const logData: LogData = {
    user: currentUser.value!.username,
    type: "changed status",
    details: message,
  };
  await logActivity(logData);
  changingStatus.value = false;
}
</script>
