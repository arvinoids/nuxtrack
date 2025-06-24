<template>
  <div class="flex gap-5">
    <div class="w-1/5 pt-2 px-4 min-w-60">
      <div class="w-full"><Links /></div>
      <div class="w-full"><AdvancedCases /></div>
    </div>
    <div class="flex flex-col items-center w-full">
      <div class="self-center mt-1 flex flex-col items-center">
        <p class="text-lg text-secondary">
          Hello, <span class="font-semibold">{{ currentUser!.fullname }}</span
          >. To assign a case, please select a group below.
          <span v-if="currentUser ? currentUser.memberOf.length !== 0 : false"
            >You may also
            <AssignToSelf class="mx-1">Assign case to yourself</AssignToSelf>.</span
          >
        </p>
      </div>
      <div v-if="!loading" class="flex flex-col items-center gap-3">
        <div ref="dashboard" class="flex flex-row flex-wrap justify-center gap-3">
          <div v-for="group in groups" :key="group.id" class="flex">
            <SWNewGroupCard
              :group="group"
              :users="getGroupUsers(group.id)"
              class="flex-grow"
              :class="{'hidden': currentUser!.role!=='admin'&&group.name==='eol'}"
            />
          </div>
        </div>
        <TechTalkHosting />
        <WatcherCard />
      </div>
      <div v-else class="h-[120px] flex flex-col justify-center p-5 items-center gap-2">
        <div>Data loading, please wait...</div>
        <div><Spinner /></div>
      </div>
    </div>
    <MiniToast />
  </div>
</template>

<script setup lang="ts">
import type { group, user, userSequence } from "pocketbase-types";
import SWNewGroupCard from "./SWNewGroupCard.vue";
import { useAdvancedCasesStore, useUserStore } from "~/composables/states";
import { useGetAdvancedCases } from "~/composables/casefunctions";

const pb = useNuxtApp().$pb;
pb.autoCancellation(false);
const currentUser = useCurrentUser();
const loading = ref(true);
const userStore = useUserStore();
const groupStore = useGroupStore();
const advancedCasesStore = useAdvancedCasesStore();
let advancedCases;
let groups: group[];
let users: user[];
let userSequence: userSequence[];

onMounted(async () => {
  // before loading users, update case counts
  users = await pb.collection("users").getFullList({ sort: "+last_assigned,+username" });
  userStore.value = users;
  groups = await pb.collection("groups").getFullList({ sort: "+order" });
  groupStore.value = groups;
  advancedCases = await useGetAdvancedCases();
  advancedCasesStore.value = advancedCases;
  userSequence = await pb.collection("usersequence").getFullList();
  loading.value = false;
});

function getGroupUsers(groupId: string) {
  return users.filter((user) => user.memberOf.includes(groupId));
}

pb.collection("users").subscribe("*", async () => {
  users = await pb.collection("users").getFullList({ sort: "+last_assigned,+username" });
  userStore.value = users;
});
</script>
