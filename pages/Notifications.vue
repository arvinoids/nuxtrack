<template>
  <div>
    <div class="border p-5 w-[400px]">
      <p>Here you will see notifications.</p>
      <p>Entries: {{ items }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
const newEvent = useNotify();
const items = ref((await pb.collection("logs").getList()).totalItems);

// Subscribe to changes in any logs record
pb.collection("logs").subscribe("*", async function (e) {
  console.log(e.record);
  newEvent.value = true;
  items.value = (await pb.collection("logs").getList()).totalItems;
});
</script>

<style>
</style>
