<template>
  <div class="fixed mb-5 bottom-0 right-10 left-0 flex flex-col justify-center items-end">
    <TransitionGroup
      ><div
        v-for="notification in useNotifications().value"
        :key="notification.toString()"
        :class="{
          success: notification.status === 'success',
          failed: notification.status === 'failed',
          warning: notification.status === 'warning',
        }"
      >
        <span class="px-2">{{ notification.message }}</span>
        <button
          class="absolute top-2 right-2 text-lex-neutral-3 text-xs"
          @click="removeToast()"
        >
          ✖
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.success {
  @apply z-50 my-1 relative alert alert-success border-info border w-auto bg-opacity-30 backdrop-blur-sm;
}

.warning {
  @apply z-50 my-1 relative alert alert-warning border-warning border w-auto bg-opacity-30 backdrop-blur-sm;
}

.failed {
  @apply z-50 my-1 relative alert alert-error border-error text-black border w-auto bg-opacity-30 backdrop-blur-sm;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
