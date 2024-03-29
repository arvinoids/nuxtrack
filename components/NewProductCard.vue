<template>
  <div class="flex flex-col text-center m-1 w-[250px] shadow-lg border bg-base-100">
    <div class="bg-secondary">
      <div class="flex items-center justify-between">
        <h2
          class="ml-3 my-2 text-secondary max-w-[200px] overflow-hidden whitespace-nowrap"
        >
          <NuxtLink :to="`/${group.name}`" class="text-white">{{
            group.description
          }}</NuxtLink>
        </h2>
        <div
          class="tooltip tooltip-bottom tooltip-accent"
          data-tip="Click this if you checked for new cases."
        >
          <button
            class="btn btn-ghost btn-circle btn-sm mr-1"
            @click="updatedCase(group.id)"
          >
            <Icon name="mdi:alarm-check" size="1.2rem" class="text-neutral-100" />
          </button>
        </div>
      </div>
    </div>
    <div v-if="loading" class="m-10"><Spinner /></div>

    <div v-else>
      <div v-if="users.totalItems > 0" :key="updateCard">
        <div v-for="(user, id) in users.items" :key="user.id" class="my-[0.1rem]">
          <nuxt-link
            :to="`/${group.name}/${user.expand.user.username}`"
            class="tooltip tooltip-right"
            :data-tip="
              user.expand.user.username.toUpperCase() +
              ' has ' +
              user.count +
              ' case(s) in ' +
              group.description +
              '\nStatus: ' +
              user.expand.user.status
            "
          >
            <Icon
              name="ic:sharp-circle"
              :class="`text-${getColor(user.expand.user.status)}`"
              class="mx-1"
              size="0.5rem"
            />
            <span
              class="hover:font-semibold hover:text-accent"
              :class="id === selectedUser ? 'text-accent font-bold my-3' : 'text-sm'"
            >
              {{ user.expand.user.fullname }}
            </span>
          </nuxt-link>
        </div>
        <div class="my-3">
          <p class="text-xs">Last updated</p>
          <p class="text-xs text-warning">
            {{ lastUpdated }}
          </p>
        </div>
      </div>
      <div v-else class="text-xs mt-3">
        <p>No users in this group.</p>
      </div>
    </div>
    <div class="flex flex-col flex-grow mt-3" :key="dataUpdated.value">
      <div class="flex justify-center mt-auto gap-2">
        <a :href="anchor"><button class="btn w-24 self-center mb-3">Select</button></a>
      </div>
      <SelectGroup
        :group="group.id"
        :users="users"
        @skip="nextUser"
        @reset="resetSelection"
      />
    </div>
    <div class="bg-gray-100 pt-[7px]"></div>
  </div>
</template>

<script setup lang="ts">
import type { LogData } from "custom-types";
import { ListResult } from "pocketbase";

const pb = useNuxtApp().$pb;
pb.autoCancellation(false);
const props = defineProps<{ group: string }>();
const anchor: string = "#" + props.group + "select";
const updateCard = ref(0);
const selectedUser = ref(0);
const loading = ref(true);
const dataUpdated = useDataUpdated();

// query for groups and users
let group = await pb.collection("groups").getOne(props.group);
const groupUsers = await pb
  .collection("users")
  .getList(1, 100, { filter: `memberOf~"${props.group}"` });

const lastUpdated = ref(useFormatDate(new Date(group.updated)));

// generate counters and replace old ones.
if (await counterIsEmpty(props.group, groupUsers)) {
  await useMakeCounter(props.group, groupUsers);
} else await useUpdateCounter(props.group, groupUsers);

async function counterIsEmpty(group: string, users: ListResult) {
  const counters = await pb
    .collection("counter")
    .getList(1, 1000, { filter: `group="${group}"` });
  if (counters.totalItems === users.totalItems) return false;
  else return true;
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

let users = ref(await useGetSortedUsers(props.group));

onMounted(async () => {
  users.value = await useGetSortedUsers(props.group);
  loading.value = false;
});

// subscribe to changes in the counter
pb.collection("counter").subscribe("*", async function (e) {
  users.value = await useGetSortedUsers(props.group);
  updateCard.value++;
});

pb.collection("users").subscribe("*", async function (e) {
  users.value = await useGetSortedUsers(props.group);
  updateCard.value++;
});

pb.collection("groups").subscribe(props.group, async () => {
  group = await pb.collection("groups").getOne(props.group);
  lastUpdated.value = useFormatDate(new Date(group.updated));
});

async function updatedCase(group: string) {
  let result = { status: "failed", message: "" };
  const logData: LogData = {
    user: useCurrentUser()!.username,
    type: "checked for new cases",
    details: `in ${await useGetGroupName(group)}`,
  };
  try {
    const res = await useUpdateGroup(group);
    result.status = res.status;
    result.message = res.message;
    await logActivity(logData);
    useShowToast(result.message, result.status);
    updateCard.value++;
  } catch (e: any) {
    console.log(e.message);
  }
}
</script>

<style scoped></style>
