<template>
  <div class="flex justify-center items-start flex-wrap">
    <div class="shadow-md placeholder rounded-lg mx-5 p-5 border">
      <p class="font-semibold">Name: {{ userData.fullname }}</p>
      <p>Username: {{ userData.username }}</p>
      <p v-if="pb.authStore.model.id === userData.id">Email: {{ userData.email }}</p>
    </div>
    <div class="flex flex-col items-center gap-3">
      <CasesTable :userId="userData.id" :group="fromGroup" />
      <a
        href="#assign"
        class="btn btn-warning shadow-md btn-outl w-[100px]"
        @click="useCaseId().value = ''"
        >Assign</a
      >
      <AssignUser :userId="userData.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
const fromGroup = useFromGroup();
const pb = useNuxtApp().$pb;
const selector = useSelector();
const user = selector.value.user;
console.log("page for", user);
const userData = await pb.collection("users").getOne(user);
// console.log("opening page for user: ", username);
console.log(userData);
</script>

<style></style>
