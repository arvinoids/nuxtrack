<template>
  <div>
    {{ users }}
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
let group = "67gqz0wjmk8l8ky";
const users = await getCurrentList(group);

async function getCurrentList(group: string) {
  let users = await pb
    .collection("currentlist")
    .getList(1, 100, { filter: `group="${group}"`, expand: "user", sort: "+order" });
  if (users.totalItems === 0) {
    await createCurrentList(group);
    users = await pb
      .collection("currentlist")
      .getList(1, 100, { filter: `group="${group}"`, expand: "user", sort: "+order" });
  }
  return users;
}
</script>

<style></style>
