<template>
  <div class="flex flex-col">
    <div class="self-center mt-3">
      <p class="text-lg text-secondary">
        Hello, {{ currentUser }}. To assign or escalate a case, please select a group
        below.
      </p>
    </div>
    <div class="flex flex-row flex-wrap justify-center">
      <div v-for="group in groups" :key="group.id" class="m-3 flex items-stretch">
        <ProductCard :group="group.id" class="flex-grow" />
      </div>
    </div>
  </div>
</template>

<script setup>
const pb = useNuxtApp().$pb;
const groups = (await pb.collection("groups").getList(1, 100, { sort: "+order" })).items;
const currentUser = await pb.authStore.model.fullname;
useRefreshAll();
</script>
