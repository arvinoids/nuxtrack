<template>
  <div
    class="fixed left-10 bottom-10 p-8 shadow-lg bg-warning bg-opacity-20 border backdrop-blur-sm border-warning flex flex-col items-center gap-3"
    v-if="user!.status === 'On leave'"
  >
    <p class="font-bold">Your status is currently ON LEAVE</p>
    <button class="btn btn-accent btn-sm" @click="setAvailable">Set to Available</button>
  </div>
</template>

<script setup lang="ts">
import type { LogData } from "custom-types";

const user = useCurrentUser();

async function setAvailable() {
  if (user.value!.status === "On leave") {
    try {
      await useChangeUserStatus(user.value!.id, "Available");
      await useUserIsBackFromLeave(user.value!.id);
      useShowToast("Your status is now Available", "success");
      const data: LogData = {
        user: user.value!.username,
        type: "changed status",
        details: "from On leave to Available",
      };
      logActivity(data);
    } catch (e: any) {
      miniToast("failed", e.message);
    }
  }
}
</script>

<style></style>
