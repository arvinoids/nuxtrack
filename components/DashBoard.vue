<template>
  <div class="flex flex-col items-center">
    <div class="self-center mt-3">
      <p class="text-lg text-secondary mx-10">
        Hello, <span class="font-semibold">{{ currentUser }}</span
        >. To assign or escalate a case, please select a group below.
      </p>
    </div>
    <div v-if="!loading">
      <div ref="dashboard" class="flex flex-row flex-wrap justify-center">
        <div v-for="group in groups" :key="group.id" class="m-3 flex items-stretch">
          <NewProductCard :group="group.id" class="flex-grow" />
        </div>
      </div>
    </div>
    <div v-else class="">Loading...</div>
  </div>
</template>

<script setup>
const dashboard = ref();
const pb = useNuxtApp().$pb;
const loading = ref(true);

let groups;
let currentUser;
onMounted(async () => {
  groups = (await pb.collection("groups").getList(1, 100, { sort: "+order" })).items;
  currentUser = await pb.authStore.model.fullname;

  loading.value = false;
});
</script>
