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
      <div v-if="displayUsers.length > 0" :key="updateCard">
        <div v-for="(user, id) in displayUsers" :key="user.id" class="my-[0.1rem]">
          <nuxt-link
            :to="`/${group.name}/${user.expand.user.username}`"
            class="tooltip tooltip-top"
            :data-tip="
              user.expand.user.username.toUpperCase() +
              ' is ' +
              user.expand.user.status +
              ' - ' +
              user.count +
              ' case(s)'
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
    <div class="flex flex-col flex-grow mt-3" :key="dataUpdated">
      <div class="flex justify-center mt-auto gap-2">
        <a :href="anchor"
          ><button v-if="users.length" class="btn w-24 self-center mb-3">
            Select
          </button></a
        >
      </div>
      <div v-if="users.length">
        <NewSelectGroup
          :group="group.id"
          :users="users"
          @skip="nextUser"
          @reset="resetSelection"
        />
      </div>
    </div>
    <div class="bg-gray-100 pt-[7px]"></div>
  </div>
</template>

<script setup lang="ts">
import { useNewMakeCounter, useNewUpdateCounter } from "~/composables/casefunctions";
import type { LogData } from "custom-types";
import { useCounters } from "~/composables/states";
import type { expandedCounter, group, user } from "pocketbase-types";
import { miniToast } from "../composables/viewhelpers";
import type { notification } from "custom-types";

const props = defineProps<{
  users: user[];
  group: group;
  counters: expandedCounter[] | undefined;
}>();

const loading = ref(false);
const selectedUser = ref(0);
const dataUpdated = ref(0);
const updateCard = ref(0);
const lastUpdated = ref(useFormatDate(new Date(props.group.updated)));
const anchor: string = "#" + props.group.id + "select";
const allCounters = useCounters();

let users: expandedCounter[] = allCounters.value.filter(
  (user) => user.group === props.group.id
);

const displayUsers = ref(users);
const pb = useNuxtApp().$pb;
pb.collection("counter").subscribe("*", async () => {
  const res = await pb.collection("counter").getList(1, 30, {
    filter: `group="${props.group.id}"`,
    expand: "user,group",
    sort: "+count",
  });
  displayUsers.value = (res.items as unknown) as expandedCounter[];
});
//console.log(props.counters.length);
if (props.counters?.length === 0) {
  await useNewMakeCounter(props.group.id, props.users);
} // else await useNewUpdateCounter(props.group.id, props.users);

function nextUser() {
  const cursor = selectedUser.value;
  if (cursor === props.users.length - 1) {
    selectedUser.value = 0;
  } else selectedUser.value++;
}

function resetSelection() {
  selectedUser.value = 0;
}

async function updatedCase(group: string) {
  let result = { status: "failed", message: "" };
  const logData: LogData = {
    user: useCurrentUser()!.username,
    type: "checked for new cases",
    details: `in ${await useGetGroupName(group)}`,
  };
  try {
    const res: notification = await useUpdateGroup(group);
    await logActivity(logData);
    miniToast(res.status, result.message);
    updateCard.value++;
  } catch (e: any) {
    console.log(e.message);
  }
}
</script>
