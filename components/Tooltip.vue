<template>
  <span
    class="z-20 delay-200 pointer-events-none absolute -left-5 w-max bg-neutral-400 px-2 py-[2px] text-sm text-lex-neutral opacity-0 shadow transition-opacity group-hover:opacity-100"
    :class="position === 'top' ? '-top-7' : '-bottom-7'"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps<{
  position?: "top" | "bottom";
}>();
</script>
