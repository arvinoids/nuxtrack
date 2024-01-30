<template>
  <div class="flex flex-col items-center">
    <div class="self-center mt-3 flex flex-col items-center">
      <p class="text-lg text-secondary mx-10">
        Hello, <span class="font-semibold">{{ currentUser }}</span
        >. To assign or escalate a case, please select a group below.

        <span v-if="pb.authStore.model.memberOf.length !== 0"
          >You may also
          <AssignToSelf class="mx-1">Assign case to yourself</AssignToSelf>.</span
        >
      </p>
    </div>
    <div v-if="!loading">
      <div ref="dashboard" class="flex flex-row flex-wrap justify-center">
        <div v-for="group in groups" :key="group.id" class="m-3 flex items-stretch">
          <transition>
            <NewProductCard :group="group.id" class="flex-grow" />
          </transition>
        </div>
      </div>
    </div>
    <div v-else class=""><Spinner /></div>
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

<style scoped>
.v-enter-active {
  transition: opacity 0.5s ease;
}

.v-enter-from {
  opacity: 0;
}
</style>
