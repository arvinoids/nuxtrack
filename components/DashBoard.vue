<template>
  <div>
    <h1 class="text-2xl font-bold text-secondary text-start"></h1>
    <div class="flex flex-row flex-wrap justify-center">
      <div
        v-for="group in groups"
        :key="group.id"
        class="m-3 rounded-2xl flex items-stretch"
      >
        <ReactiveProductCard :group="group.id" class="flex-grow" />
      </div>
    </div>
  </div>
</template>

<script setup>
const pb = useNuxtApp().$pb;
const groups = (await pb.collection("groups").getList(1, 100, { sort: "+order" })).items;
useRefreshAll();
</script>
