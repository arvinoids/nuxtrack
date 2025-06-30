<template>
  <div v-for="team in teams">
    <ArchiveTeam :team="team" :users="teamUsers(team.id)" />
  </div>
</template>

<script setup lang="ts">
import type { UsersResponse, GroupsResponse } from "~/pocketbase-types";
const pb = useNuxtApp().$pb;

const teams: Ref<GroupsResponse[] | undefined> = ref();
const users: Ref<UsersResponse[] | undefined> = ref();
onMounted(async () => {
  teams.value = await pb
    .collection("groups")
    .getFullList<GroupsResponse>({ sort: "+order" });
  users.value = await pb.collection("users").getFullList<UsersResponse>();
  console.log(teams);
});

function teamUsers(teamId: string) {
  return users.value!.filter((user) => user.memberOf.includes(teamId));
}
</script>

<style></style>
