<template>
  <div
    class="absolute w-screen z-50 h-screen flex items-center justify-center backdrop-grayscale"
  >
    <div
      class="flex items-center justify-center relative p-10 bg-base-100 border border-neutral-200 gap-4 z-50 mx-10 backdrop-blur-2xl shadow-xl w-[500px]"
    >
      <Icon name="svg-spinners:180-ring-with-bg" size="3rem" class="text-primary" />
      <p><slot>Loading data. Please wait...</slot></p>
    </div>
  </div>
</template>
<script lang="ts"></script>

<style></style>
