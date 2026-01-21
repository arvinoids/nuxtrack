<template>
  <transition>
    <div
      class="px-5 py-1 shadow-lg bg-warning bg-opacity-20 border-b backdrop-blur-sm border-warning flex justify-between items-center gap-3"
      v-if="user!.status === 'On leave'||user!.status === 'Rest day' && show===true"
    >
      <div></div>
      <div class="flex items-center gap-4">
        <p class="">Your status is currently {{ user?.status.toUpperCase() }}</p>
        <button class="btn btn-xs btn-info" @click="setAvailableNotify">
          Set to Available
        </button>
      </div>
      <div>
        <button
          class="absolute right-2 top-1 btn btn-xs btn-ghost btn-error btn-square"
          @click="show = false"
        >
          <Icon name="ic:round-close" size="1.3rem" />
        </button>
      </div>
    </div>
  </transition>
  <GlobalLoading :show="changingToAvail">{{ loadingMessage }}</GlobalLoading>
</template>

<script setup lang="ts">
import type { LogData, statuschoice } from "custom-types";
import type { LeavesReasonOptions } from "~/pocketbase-types";

const user = useCurrentUser();
const oldStatus: statuschoice = user.value!.status;
const show = ref(true);
const changingToAvail = ref(false);
const loadingMessage = ref("");
const showDropdown = useShowDropdown();

async function setAvailableNotify() {
  showDropdown.value = true;
  miniToast(
    "warning",
    "Please click on the status pill below your avatar to change status"
  );
}

// async function setAvailable() {
//   loadingMessage.value = "Setting status to Available";
//   changingToAvail.value = true;
//   if (oldStatus === "On leave" || oldStatus === "Rest day") {
//     try {
//       await useChangeUserStatus(user.value!.id, "Available");
//       loadingMessage.value = `Computing dummy cases earned from ${oldStatus}`;
//       await useUserIsBackFromLeaveOrRestDay(
//         user.value!.id,
//         oldStatus as LeavesReasonOptions
//       );
//       useShowToast("Your status is now Available", "success");
//       loadingMessage.value = "Logging to database";
//       const data: LogData = {
//         user: user.value!.username,
//         type: "changed status",
//         details: `from ${oldStatus} to Available`,
//       };

//       logActivity(data);
//     } catch (e: any) {
//       miniToast("failed", e.message);
//     }
//   }
//   changingToAvail.value = false;
// }
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
