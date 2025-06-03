<template>
  <div class="border-base-200 shadow border p-3 text-sm">
    <AdminLeaveNotification />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});
</script>
