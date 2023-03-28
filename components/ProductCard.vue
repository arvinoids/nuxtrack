<template>
  <div class="flex flex-col text-center m-3 w-[250px] shadow-lg border bg-base-100">
    <div class="bg-secondary">
      <h2 class="my-2 text-secondary font-semibold">
        <NuxtLink :to="`/${group.name}`" class="text-white">{{
          group.description
        }}</NuxtLink>
      </h2>
    </div>
    <div v-if="users.totalItems > 0" :key="updateCard">
      <div v-for="(user, id) in users.items" :key="id">
        <nuxt-link
          :to="`/${group.name}/${user.expand.user.username}`"
          class="tooltip tooltip-right"
          :class="{ next: id === selectedUser }"
          :data-tip="
            user.expand.user.username.toUpperCase() +
            ' has ' +
            user.count +
            ' case(s) in group.'
          "
        >
          <p class="hover:font-semibold hover:text-accent">
            {{ user.expand.user.fullname }}
          </p>
        </nuxt-link>
      </div>
    </div>
    <div v-else class="text-xs">
      <p>No users in this group.</p>
    </div>
    <div class="flex flex-col flex-grow mt-3">
      <div class="flex justify-center mt-auto gap-2">
        <a :href="anchor"
          ><button
            class="btn mt-auto w-24 self-center mb-3 hover:btn-primary"
            @click="setCurrentCase"
          >
            Select
          </button></a
        >
      </div>
    </div>
    <SelectGroup :group="group.id" :users="users" @skip="nextUser" />
    <div class="bg-gray-100 pt-[7px]"></div>
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
  users = await getCurrentList(props.group);
  updateCard.value++;
});

function nextUser() {
  const cursor = selectedUser.value;
  if (cursor === users.totalItems - 1) {
    selectedUser.value = 0;
  } else selectedUser.value++;
}

function setCurrentCase() {
  console.log(useCaseId().value);
}
</script>

<style>
.next {
  @apply text-accent-focus text-lg my-2;
}
</style>
