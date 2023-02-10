<template>
  <div
    class="flex flex-col rounded-xl text-center p-5 m-2 w-[250px] shadow-lg border bg-base-100"
  >
    <h2 class="font-semibold mb-5 text-secondary text-xl">{{ group.description }}</h2>
    <div v-if="users.totalItems > 0">
      <div v-for="(user, id) in users.items" :key="id" class="text-base">
        <nuxt-link
          :to="`/user/${user.expand.user.username}`"
          class="tooltip tooltip-right"
          :class="{ next: id === 0 }"
          :data-tip="
            user.expand.user.username.toUpperCase() +
            ' has ' +
            user.count +
            ' case(s) in group.'
          "
          @click="
            selectUser(user.expand.user.id, props.group);
            setFromGroup(props.group);
          "
        >
          <div class="hover:font-semibold">{{ user.expand.user.fullname }}</div>
        </nuxt-link>
      </div>
    </div>
    <div v-else class="text-xs">
      <div v-for="item in users" :key="item + 1">
        {{ item.fullname }}
      </div>
    </div>
    <div class="flex flex-col flex-grow mt-3">
      <a
        class="btn mt-auto w-32 self-center my-3 btn-circle"
        :href="anchor"
        @click="clearCaseId"
        >Select</a
      >
    </div>
    <AddCase
      :groupId="props.group"
      :groupDescription="group.description"
      :nextUserId="nextUserId"
      :nextUserName="nextUserName"
    />
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
pb.autoCancellation(false);
const props = defineProps<{ group: string }>();
const anchor: string = "#" + props.group;
const group = await pb.collection("groups").getOne(props.group);
const originGroup = useFromGroup();
const selectedUser = useSelector();

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
  return users;
}

function clearCaseId() {
  useCaseId().value = "";
}

// if no return, create currentlist for group
// get the group entries from currentlist, sort by count asc

const nextUserId = users.items[0].expand.user.id;
const nextUserName = users.items[0].expand.user.fullname;

async function selectUser(user: string, group: string) {
  selectedUser.value.user = user;
  selectedUser.value.group = group;
}

async function setFromGroup(group: string) {
  originGroup.value = group;
}
</script>

<style>
.next {
  @apply text-accent text-lg my-2;
}
</style>
