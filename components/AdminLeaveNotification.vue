<template>
  <div>
    <div class="w-full" v-if="usersOnLeave.length > 0">
      <div class="font-semibold text-error md: w-[300px] mb-2">
        These users are currently on leave:
      </div>
      <div v-for="user in usersOnLeave" class="py-1">
        <div><AdminSetUserToAvail :user="user" /></div>
      </div>
    </div>
    <div v-else>
      <div class="md: w-[300px] mb-2 text-center">
        There are currently no users on leave. Please select a tab to continue.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const users = ref(await useGetAllUsers().then((res) => res.items));
const usersOnLeave = ref(users.value.filter((user) => user.status === "On leave"));
const pb = useNuxtApp().$pb;
pb.collection("users").subscribe("*", async () => {
  users.value = await useGetAllUsers().then((res) => res.items);
  usersOnLeave.value = users.value.filter((user) => user.status === "On leave");
});
</script>

<style></style>
