<template>
  <div
    class="flex flex-col text-center m-1 w-[250px] shadow-lg transition-shadow hover:shadow-primary/30 border-neutral-200 border group relative"
  >
    <div class="bg-secondary">
      <div class="flex items-center justify-between">
        <h2
          class="ml-3 my-2 text-secondary max-w-[200px] overflow-hidden whitespace-nowrap"
        >
          <NuxtLink :to="`/${group.name}`" class="text-white font-[Roboto_Condensed]">
            {{ group.description }}
          </NuxtLink>
        </h2>
        <div class="items-center group-hover:flex hidden">
          <button
            class="btn btn-sm btn-secondary btn-ghost btn-circle"
            @click="updateCounter()"
            :disabled="loading"
            title="Update counters for this group"
          >
            <Icon name="ic:twotone-refresh" size="1.2rem" class="text-slate-50" />
          </button>

          <button
            class="btn btn-secondary btn-ghost btn-circle btn-sm mr-1"
            @click="updatedTimestamp(group.id)"
            title="Mark this group as updated now"
            :disabled="loading"
          >
            <Icon name="mdi:alarm-check" size="1.2rem" class="text-neutral-100" />
          </button>
        </div>
      </div>
    </div>
    <div v-if="loading" class="m-10"><Spinner /></div>

    <div v-else>
      <div v-if="displayUsers.length > 0" :key="updateCard" v-auto-animate>
        <div
          v-for="(user, id) in displayUsers"
          :key="user.id"
          class="my-[0.1rem] hover:scale-110 transition-transform duration-200"
        >
          <nuxt-link
            :to="`/${group.name}/${user.expand.user.username}`"
            class="mx-1 w-full flex flex-row h-auto justify-center items-center gap-1"
            :title="
              user.expand.user.username.toUpperCase() +
              ' is ' +
              user.expand.user.status +
              ' - ' +
              user.total_count +
              ' case(s)'
            "
          >
            <UserIcon :user="user.expand.user" />
            <span
              class="hover:font-semibold hover:text-primary"
              :class="id === selectedUser ? 'font-bold my-3 text-primary' : 'text-sm'"
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
      <div class="justify-center mt-auto gap-2 flex absolute right-1/2 left-1/2 bottom-2">
        <a :href="anchor"
          ><button
            v-if="users.length"
            class="btn btn-sm btn-secondary w-24 invisible opacity-0 scale-25 transform transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-hover:visible self-center mb-3 shadow-secondary shadow-lg"
          >
            Assign
          </button></a
        >
      </div>
      <div v-if="users.length" :key="updateCard">
        <NewSelectGroup
          :group="group.id"
          :users="displayUsers"
          @skip="nextUser"
          @reset="resetSelection"
        />
      </div>
    </div>
    <div class="bg-gray-100 pt-[7px]"></div>
  </div>
</template>

<script setup lang="ts">
import { useNewMakeCounter } from "~/composables/casefunctions";
import type { LogData } from "custom-types";
import { useCounters } from "~/composables/states";
import { miniToast } from "../composables/viewhelpers";
import type { notification } from "custom-types";
import type { CounterResponse, GroupsResponse, UsersResponse } from "~/pocketbase-types";

const props = defineProps<{
  users: UsersResponse[];
  group: GroupsResponse;
  counters: CounterResponse<{ user: UsersResponse; group: GroupsResponse }>[];
}>();

const loading = ref(false);
const selectedUser = ref(0);
const dataUpdated = ref(0);
const updateCard = ref(0);
const lastUpdated = ref(useFormatDate(new Date(props.group.updated)));
const anchor: string = "#" + props.group.id + "select";
const allCounters = useCounters();
const currentUser = useCurrentUser();

let users = allCounters.value.filter((user) => user.group === props.group.id);

const displayUsers = ref(users);
const pb = useNuxtApp().$pb;
pb.collection("counter").subscribe("*", async () => {
  type Texpand = {
    user: UsersResponse;
    group: GroupsResponse;
  };
  const res = await pb.collection("counter").getList<CounterResponse<Texpand>>(1, 30, {
    filter: `group="${props.group.id}"`,
    expand: "user,group",
    sort: "+total_count",
  });
  displayUsers.value = res.items;
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
  updateCard.value++;
  selectedUser.value = 0;
}

async function updatedTimestamp(group: string) {
  lastUpdated.value = "Updating...";
  let result = { status: "failed", message: "" };
  const logData: LogData = {
    user: currentUser.value!.username,
    type: "checked for new cases",
    details: `in ${await useGetGroupName(group)}`,
  };
  try {
    const res: notification = await useUpdateGroup(group);
    await logActivity(logData);
    result.message = "Group timestamp updated";
    miniToast(res.status, result.message);
    updateCard.value++;
  } catch (e: any) {
    console.log(e.message);
  }
}

async function updateCounter() {
  loading.value = true;
  await useForceUpdateCounters(props.group.id);
  loading.value = false;
}

pb.collection("groups").subscribe(props.group.id, async () => {
  const group = await pb.collection("groups").getOne(props.group.id);
  lastUpdated.value = useFormatDate(new Date(group.updated));
});
</script>
