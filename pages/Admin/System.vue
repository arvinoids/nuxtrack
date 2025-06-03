<template>
  <div>
    <div><SystemArchiveLogs /></div>
    <div>
      <div class="btn btn-success" @click="miniToast('success', 'Success!')">Test</div>
      <div class="btn btn-error" @click="miniToast('failed', 'Failed!')">Test</div>
      <div class="btn btn-warning" @click="miniToast('warning', 'Warning!')">Test</div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});
</script>

<style></style>
