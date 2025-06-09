<template>
  <div>
    <div class="w-full" v-if="usersOnLeaveSortedByStatus.length > 0">
      <p></p>
      <div class="font-semibold text-error md: w-[300px] mb-2">
        Attention: These users are currently on leave or on rest day:
      </div>
      <div v-for="user in usersOnLeave" class="py-1">
        <div><AdminSetUserToAvail :user="user" /></div>
      </div>
    </div>
    <div v-else>
      <div class="md: w-[300px] mb-2 text-center">
        There are currently no users on leave or on rest day. Please select a tab to
        continue.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const users = ref(await useGetAllUsers().then((res) => res.items));

const usersOnLeave = ref(
  users.value.filter((user) => user.status === "On leave" || user.status === "Rest day")
);
const usersOnLeaveSortedByStatus = computed(() => {
  return usersOnLeave.value.sort((a, b) => {
    if (a.status === "On leave" && b.status === "Rest day") return -1;
    if (a.status === "Rest day" && b.status === "On leave") return 1;
    return 0;
  });
});

const pb = useNuxtApp().$pb;
pb.collection("users").subscribe("*", async () => {
  users.value = await useGetAllUsers().then((res) => res.items);
  usersOnLeave.value = users.value.filter(
    (user) => user.status === "On leave" || user.status === "Rest day"
  );
});
</script>

<style></style>
