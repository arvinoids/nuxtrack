<template>
  <div class="fixed mb-5 bottom-0 right-10 left-0 flex flex-col justify-center items-end">
    <TransitionGroup
      ><div
        v-for="notification in useNotifications().value"
        :key="notification.toString()"
        :class="{
          'z-50 my-1 relative alert alert-success alert-outline w-auto shadow-lg backdrop-blur-sm':
            notification.status === 'success',
          'z-50 my-1 relative alert alert-error alert-outline w-auto shadow-lg backdrop-blur-sm':
            notification.status === 'failed',
          'z-50 my-1 relative alert alert-warning alert-outline w-auto shadow-lg backdrop-blur-sm':
            notification.status === 'warning',
        }"
      >
        <span class="px-2">{{ notification.message }}</span>
        <button
          class="absolute top-[5px] right-2 text-lex-neutral-3 text-xs"
          @click="removeToast()"
        >
          ✖
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="postcss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
