<template>
  <div
    class="flex flex-col rounded-xl text-center p-5 m-2 w-[250px] shadow-lg border bg-base-100"
  >
    <h2 class="font-semibold mb-5 text-secondary text-xl">
      <NuxtLink :to="`/groups/${group.name}`">{{ group.description }}</NuxtLink>
    </h2>
    <div v-if="users.totalItems > 0" :key="updateCard">
      <div v-for="(user, id) in users.items" :key="id" class="text-base">
        <nuxt-link
          :to="`/user/${user.expand.user.username}`"
          class="tooltip tooltip-right"
          :class="{ next: id === selectedUser }"
          :data-tip="
            user.expand.user.username.toUpperCase() +
            ' has ' +
            user.count +
            ' case(s) in group.'
          "
        >
          <div class="hover:font-semibold">{{ user.expand.user.fullname }}</div>
        </nuxt-link>
      </div>
    </div>
    <div v-else class="text-xs">
      <p>No users in this group.</p>
    </div>
    <div class="flex flex-col flex-grow mt-3">
      <div class="flex justify-center mt-auto gap-2">
        <a class="btn mt-auto w-24 self-center btn-circle" :href="anchor">Select</a>
      </div>
    </div>
    <SelectGroup :group="group.id" :users="users" @skip="nextUser" />
  </div>
</template>

<script setup lang="ts">
import { expandedUsers } from "pocketbase-types";

const pb = useNuxtApp().$pb;
pb.autoCancellation(false);
const props = defineProps<{ group: string }>();
const anchor: string = "#" + props.group + "select";
const group = await pb.collection("groups").getOne(props.group);
const updated = useDataUpdated();
const updateCard = ref(0);
const selectedUser = ref(0);

let users = await getCurrentList(props.group);
if (users.totalItems === 0) {
  await createCurrentList(props.group);
  users = await getCurrentList(props.group);
}

async function getCurrentList(group: string) {
  const groupFilter = `group="${group}"`;
  let users = await pb
    .collection("currentlist")
    .getList(1, 100, { filter: groupFilter, expand: "user", sort: "+order" });
  return (users as unknown) as expandedUsers;
}

watch(updated, async () => {
  console.log("data updated");
  users = await getCurrentList(props.group);
  updateCard.value++;
});

function nextUser() {
  const cursor = selectedUser.value;
  if (cursor === users.totalItems - 1) {
    selectedUser.value = 0;
  } else selectedUser.value++;
}
</script>

<style>
.next {
  @apply text-accent text-lg my-2;
}
</style>
