<template>
  <transition>
    <div
      class="px-5 py-1 shadow-lg bg-warning bg-opacity-20 border-b backdrop-blur-sm border-warning flex justify-between items-center gap-3"
      v-if="user!.status === 'On leave' && show===true"
    >
      <div></div>
      <div class="flex items-center gap-4">
        <p class="">Your status is currently ON LEAVE</p>
        <button class="btn btn-xs btn-info" @click="setAvailable">
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
</template>

<script setup lang="ts">
import type { LogData } from "custom-types";

const user = useCurrentUser();
const show = ref(true);

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
