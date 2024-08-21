<template>
  <div class="border p-3 text-sm">
    <AdminLeaveNotification />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});
</script>
