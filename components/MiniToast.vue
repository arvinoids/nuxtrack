<template>
  <Teleport to="body">
    <div
      class="fixed mb-5 bottom-0 right-10 flex flex-col justify-center items-end pointer-events-none"
    >
      <TransitionGroup
        ><div
          v-for="notification in useNotifications().value"
          :key="notification.toString()"
          :class="{
            'z-[9999] my-1 relative alert alert-success w-auto shadow-lg backdrop-blur-sm pointer-events-auto':
              notification.status === 'success',
            'z-[9999] my-1 relative alert alert-error w-auto shadow-lg backdrop-blur-sm pointer-events-auto':
              notification.status === 'failed',
            'z-[9999] my-1 relative alert alert-warning w-auto shadow-lg backdrop-blur-sm pointer-events-auto':
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
  </Teleport>
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
