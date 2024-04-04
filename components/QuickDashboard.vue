<template>
  <div class="flex flex-col items-center">
    <div class="self-center mt-3 flex flex-col items-center">
      <p class="text-lg text-secondary mx-10">
        Hello, <span class="font-semibold">{{ currentUser!.fullname }}</span
        >. To assign or escalate a case, please select a group below.

        <span v-if="currentUser ? currentUser.memberOf.length !== 0 : false"
          >You may also
          <AssignToSelf class="mx-1">Assign case to yourself</AssignToSelf>.</span
        >
      </p>
    </div>
    <div v-if="!loading">
      <div ref="dashboard" class="flex flex-row flex-wrap justify-center">
        <div v-for="group in groups" :key="group.id" class="m-3 flex items-stretch">
          <transition>
            <ProductCard
              :group="group"
              :users="getGroupUsers(group.id)"
              :counters="getGroupCounters(group.id)"
              class="flex-grow"
            />
          </transition>
        </div>
      </div>
    </div>
    <div v-else class="h-[120px] flex flex-col justify-center p-5 items-center gap-2">
      <div>Data loading, please wait...</div>
      <div><Spinner /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCounters } from "~/composables/states";
import type { group, user } from "pocketbase-types";

const pb = useNuxtApp().$pb;
pb.autoCancellation(false);
const currentUser = useCurrentUser();
const loading = ref(true);
const allCounters = useCounters();
let groups: group[];
let users: user[];

onMounted(async () => {
  groups = await pb.collection("groups").getFullList({ sort: "+order" });
  users = await pb.collection("users").getFullList();
  allCounters.value = await pb
    .collection("counter")
    .getFullList({ sort: "+count", expand: "user" });
  loading.value = false;
});

function getGroupUsers(groupId: string) {
  return users.filter((user) => user.memberOf.includes(groupId));
}

function getGroupCounters(groupId: string) {
  if (allCounters.value)
    return allCounters.value.length > 0
      ? allCounters.value.filter((counter) => counter.group === groupId)
      : undefined;
}
</script>

<style></style>
