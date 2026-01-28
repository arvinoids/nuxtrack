<template>
  <transition name="fade">
    <div
      v-if="visible && s.message"
      class="fixed bottom-0 left-0 w-auto"
      aria-live="polite"
    >
      <div class="mx-auto max-w-screen-2xl px-4 pb-4" :class="containerPadClass">
        <div
          class="flex items-center gap-2 rounded-box shadow-lg px-4 py-2 text-sm"
          :class="colorClass"
        >
          <span v-if="s.loading" class="loading loading-spinner loading-sm"></span>
          <span class="truncate">{{ s.message }}</span>

          <button
            class="btn btn-ghost btn-xs ml-auto"
            type="button"
            aria-label="Close status message"
            @click="hide"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { StatusType } from "@/composables/useStatus";
import { useStatus } from "@/composables/useStatus";

const props = withDefaults(defineProps<{ compact?: boolean; infoAsBase?: boolean }>(), {
  compact: false,
  // if true, info uses base colors (bg-base-200) instead of neutral
  infoAsBase: false,
});

const { state: s, clear } = useStatus();
const visible = ref<boolean>(false);
let timer: number | undefined;

const containerPadClass = computed(() => (props.compact ? "pt-2" : "pt-4"));

const colorClass = computed(() => {
  const map: Record<StatusType, string> = {
    success: "bg-success text-success-content",
    warning: "bg-warning text-warning-content",
    error: "bg-error text-error-content",
    info: props.infoAsBase
      ? "bg-base-200 text-base-content"
      : "bg-neutral text-neutral-content",
  };
  return map[s.value.type];
});

function startTimer() {
  if (timer) window.clearTimeout(timer);
  if (s.value.timeout && s.value.timeout > 0) {
    timer = (window.setTimeout(() => {
      hide();
    }, s.value.timeout) as unknown) as number;
  }
}

function hide() {
  visible.value = false;
  clear();
}

watch(
  () => [s.value.show, s.value.message, s.value.timeout] as const,
  ([show, message]) => {
    if (show && message) {
      visible.value = true;
      startTimer();
    } else if (!show) {
      visible.value = false;
      if (timer) window.clearTimeout(timer);
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (s.value.show && s.value.message) startTimer();
});
onBeforeUnmount(() => {
  if (timer) window.clearTimeout(timer);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
