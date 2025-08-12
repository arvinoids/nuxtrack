<template>
  <Teleport to="body">
    <div
      v-if="show && globalLoadingEnabled"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
    >
      <div class="bg-base-100 p-6 flex flex-col items-center gap-4 shadow-xl">
        <span class="loading loading-spinner loading-xl text-primary"></span>
        <div class="text-center">
          <slot>Loading...</slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useGlobalStatusMessage } from "~/composables/settings";

defineProps<{
  show: boolean;
}>();

const globalLoadingEnabled = await useGlobalStatusMessage();
</script>
