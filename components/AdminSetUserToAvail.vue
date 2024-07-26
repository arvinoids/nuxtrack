<template>
  <div class="flex gap-2 border justify-between w-[40ch] items-center px-3 py-2">
    <span>{{ user.fullname }}</span>
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
    miniToast(res.status, res.message);
  } catch (e: any) {
    miniToast("failed", e.message);
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
