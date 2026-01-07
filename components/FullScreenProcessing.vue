<template>
  <div
    class="fixed inset-0 w-screen z-50 h-screen flex items-center justify-center text-primary"
  >
    <div
      class="px-20 py-15 bg-base-100 shadow-lg flex flex-col items-center gap-2 w-80 text-primary"
    >
      <Icon name="svg-spinners:pulse-3" size="3rem" />
      <p class="text-center"><slot>Loading...</slot></p>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
