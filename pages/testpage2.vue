<template>
  <div>
    {{ list }}
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
let group = "67gqz0wjmk8l8ky";
let list = await pb.collection("counter").getList(1, 500, {
  filter: `group="${group}"`,
  $autoCancel: false,
});
</script>

<style></style>
