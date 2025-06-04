<template>
  <div
    class="fixed inset-0 w-screen z-50 h-screen flex items-center justify-center text-primary backdrop-saturate-0 backdrop-brightness-50"
  >
    <div
      class="px-[10rem] py-[5rem] bg-base-100 shadow-lg flex flex-col items-center gap-2"
    >
      <Icon name="svg-spinners:90-ring-with-bg" size="3rem" />
      <p class="text-center"><slot>Loading...</slot></p>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
