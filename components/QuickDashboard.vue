<template>
  <div class="flex flex-col items-center">
    <div class="self-center bg-base-200 w-full flex flex-col items-center">
      <p class="mx-10 px-4 py-3 font-[Roboto_Condensed]">
        Hello, <span class="font-semibold">{{ currentUser!.fullname }}</span
        >. To assign or escalate a case, please hover over group below and assign.

        <span v-if="showAssignToSelf()"
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
import type { GroupsResponse, LeavesResponse, UsersResponse } from "~/pocketbase-types";

const pb = useNuxtApp().$pb;
pb.autoCancellation(false);
const currentUser = useCurrentUser();
const loading = ref(true);
const allCounters = useCounters();
const allUsers = useAllUsers();
const allGroups = useAllGroups();
const leaveRecords = useActiveLeaves();
let groups: GroupsResponse[];
let users: UsersResponse[];

function showAssignToSelf() {
  return currentUser.value!.memberOf.length !== 0 && currentUser.value!.role !== "user";
}

onMounted(async () => {
  groups = await pb.collection("groups").getFullList<GroupsResponse>({ sort: "+order" });
  users = await pb.collection("users").getFullList();
  allUsers.value = users;
  allGroups.value = groups;
  allCounters.value = await pb
    .collection("counter")
    .getFullList({ sort: "+count", expand: "user" });
  loading.value = false;
  leaveRecords.value = await pb
    .collection("leaves")
    .getList<LeavesResponse>(1, 500, { filter: "active=true" })
    .then((res) => res.items);
});

function getGroupUsers(groupId: string) {
  return allUsers.value.filter((user) => user.memberOf.includes(groupId));
}

function getGroupCounters(groupId: string) {
  if (allCounters.value)
    return allCounters.value.length > 0
      ? allCounters.value.filter((counter) => counter.group === groupId)
      : undefined;
}

pb.collection("users").subscribe("*", async () => {
  users = await pb.collection("users").getFullList();
  allUsers.value = users;
  allCounters.value = await pb
    .collection("counter")
    .getFullList({ sort: "+count", expand: "user" });
});

pb.collection("counter").subscribe("*", async () => {
  allCounters.value = await pb
    .collection("counter")
    .getFullList({ sort: "+count", expand: "user" });
});

pb.collection("leaves").subscribe("*", async () => {
  leaveRecords.value = await pb
    .collection("leaves")
    .getList<LeavesResponse>(1, 500, { filter: "active=true" })
    .then((res) => res.items);
});
</script>
