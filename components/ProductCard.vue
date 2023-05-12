<template>
  <div class="flex flex-col text-center m-3 w-[250px] shadow-lg border bg-base-100">
    <div class="bg-secondary">
      <h2 class="my-2 text-secondary">
        <NuxtLink :to="`/${group.name}`" class="text-white">{{
          group.description
        }}</NuxtLink>
      </h2>
    </div>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-if="users.totalItems > 0" :key="updateCard">
        <div v-for="(user, id) in users.items" :key="user.id" ref="persons">
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
            <p class="hover:font-semibold hover:text-accent text-sm">
              {{ user.expand.user.fullname }}({{ user.count }})
            </p>
          </nuxt-link>
        </div>
      </div>
      <div v-else class="text-xs mt-3">
        <p>No users in this group.</p>
      </div>
    </div>
    <div class="flex flex-col flex-grow mt-3">
      <div class="flex justify-center mt-auto gap-2">
        <a :href="anchor"><button class="btn w-24 self-center mb-3">Select</button></a>
      </div>
    </div>
    <SelectGroup
      :group="group.id"
      :users="users"
      @skip="nextUser"
      @reset="resetSelection"
    />
    <div class="bg-gray-100 pt-[7px]"></div>
  </div>
</template>

<script setup lang="ts">
import { expandedUsers } from "pocketbase-types";
import { ListResult } from "pocketbase";
import { useAutoAnimate } from "@formkit/auto-animate/vue";

const pb = useNuxtApp().$pb;
pb.autoCancellation(false);
const props = defineProps<{ group: string }>();
const anchor: string = "#" + props.group + "select";
const updateCard = ref(0);
const selectedUser = ref(0);
const loading = ref(true);

// query for groups and users
const group = await pb.collection("groups").getOne(props.group);
const groupUsers = await pb
  .collection("users")
  .getList(1, 100, { filter: `memberOf~"${group}"` });

// generate counters and replace old ones.
if (await counterIsEmpty(props.group, groupUsers)) {
  await useMakeCounter(props.group, groupUsers);
} else useUpdateCounter(props.group, groupUsers);

async function counterIsEmpty(group: string, users: ListResult) {
  const counters = await pb
    .collection("counter")
    .getList(1, 1000, { filter: `group="${group}"` });
  if (counters.totalItems === users.totalItems) return false;
  else return true;
}

async function getSortedUsers(group: string) {
  const users = await pb.collection("counter").getList(1, 1000, {
    filter: `group="${group}"`,
    sort: "+count,+updated",
    expand: "user",
  });
  return (users as unknown) as expandedUsers;
}

function nextUser() {
  const cursor = selectedUser.value;
  if (cursor === users.value.totalItems - 1) {
    selectedUser.value = 0;
  } else selectedUser.value++;
}

function resetSelection() {
  selectedUser.value = 0;
}

let users = ref(await getSortedUsers(props.group));

onMounted(async () => {
  users.value = await getSortedUsers(props.group);
  loading.value = false;
});

const [persons] = useAutoAnimate();

// subscribe to changes in the counter
pb.collection("counter").subscribe("*", async function (e) {
  users.value = await getSortedUsers(props.group);
  updateCard.value++;
});
</script>

<style>
.next {
  @apply text-accent-focus text-lg my-2 font-semibold;
}
</style>
