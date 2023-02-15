<template>
  <div class="flex justify-center items-start flex-wrap">
    <div class="shadow-md placeholder rounded-lg mx-5 p-5 border">
      <p class="font-semibold">Name: {{ userData.fullname }}</p>
      <p>Username: {{ userData.username }}</p>
      <p v-if="pb.authStore.model.id === userData.id">Email: {{ userData.email }}</p>
    </div>
    <div class="flex flex-col items-center gap-3">
      <CasesTable :userId="userData.id" />
      <button class="btn btn-warning shadow-md btn-outl w-[100px]">Assign</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
const user = useSelector();
if (user.value.user === "") {
  user.value.user = pb.authStore.model.id;
}
let userData = await pb.collection("users").getOne(pb.authStore.model.id);
if (user.value.user) {
  userData = await pb.collection("users").getOne(user.value.user);
}
</script>

<style></style>
