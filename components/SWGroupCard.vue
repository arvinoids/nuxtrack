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
        <div class="flex items-center mx-2">
          <div class="tooltip tooltip-top tooltip-accent" data-tip="Update count">
            <button
              class="btn btn-sm btn-circle btn-secondary text-white btn-ghost"
              @click="updateUserCount"
            >
              <Icon name="ic:round-refresh" size="1.6rem" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loading" class="m-10"><Spinner /></div>

    <div v-else class="">
      <div v-if="activeUsers.length > 0">
        <div :key="listUpdated">
          <div v-for="user in activeUsers" :key="user.id" class="my-[0.1rem]">
            <nuxt-link
              :to="`/${group.name}/${user.username}`"
              class="tooltip tooltip-top"
              :data-tip="
                user.username.toUpperCase() +
                ' is ' +
                user.status +
                ' - ' +
                user.cases +
                ' cases'
              "
            >
              <Icon
                name="ic:sharp-circle"
                :class="`text-${getColor(user.status)}`"
                class="mx-1"
                size="0.5rem"
              />
              <span class="hover:font-semibold hover:text-accent">
                {{ user.fullname }}
              </span>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div v-else class="text-xs mt-3">
        <p>No users are currently active.</p>
      </div>
      <div v-if="usersOnLeave.length > 0" :key="listUpdated">
        <div class="font-bold mt-3">Users on Leave</div>
        <div v-for="user in usersOnLeave" :key="user.id" class="my-[0.1rem]">
          <nuxt-link
            :to="`/${group.name}/${user.username}`"
            class="tooltip tooltip-top"
            :data-tip="
              user.username.toUpperCase() +
              ' is ' +
              user.status +
              ' - ' +
              user.cases +
              ' cases'
            "
          >
            <Icon
              name="ic:sharp-circle"
              :class="`text-${getColor(user.status)}`"
              class="mx-1"
              size="0.5rem"
            />
            <span class="hover:font-semibold hover:text-accent">
              {{ user.fullname }}
            </span>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col flex-grow mt-2"
      :key="listUpdated"
      v-if="activeUsers.length > 0"
    >
      <div class="flex justify-center mt-auto gap-2">
        <a :href="anchor"
          ><button v-if="true" class="btn w-24 self-center mb-3">Select</button></a
        >
      </div>
      <SWSelectGroup
        :group="group.id"
        :users="activeUsers"
        @shift="updateDisplayUsers"
        @reset="resetOrder"
        @update="updateSequence"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { group, user, userSequence } from "pocketbase-types";
const props = defineProps<{
  group: group;
  users: user[];
  usersequence: userSequence | undefined;
}>();
// initialize db
const pb = useNuxtApp().$pb;
pb.autoCancellation(false);

// background variables
// const dataUpdated = ref(0);
const anchor: string = "#" + props.group.id + "select";
const initialOrder: Ref<user[]> = ref([]);
const listUpdated = ref(0);

// reactive variables
const loading = ref(true);
const activeUsers: Ref<user[]> = ref([]);
const usersOnLeave: Ref<user[]> = ref([]);
const sequenceData = ref(await getOrCreateSequence(props.group.id));

async function getOrCreateSequence(groupId: string) {
  let res = await useGetUserSequenceData(props.group.id);
  if (!res) {
    // create sequence from props.user
    let sequence = props.users.map((user) => user.id);
    res = await pb
      .collection("usersequence")
      .create({ group: props.group.id, use_order: sequence });
  }
  return res;
}

for (let user of sequenceData.value.user_order) {
  let userData = props.users.find((item) => item.id === user);
  activeUsers.value.push(userData!);
}

onMounted(() => {
  initialOrder.value = [...activeUsers.value];
  refreshCard();
  loading.value = false;
});

usersOnLeave.value = props.users.filter((item) => item.status === "On leave");

async function updateDisplayUsers(users: user[]) {
  activeUsers.value = users;
}

function resetOrder() {
  activeUsers.value = [...initialOrder.value];
}

// track current order with computed value
const currentOrder = computed(() => {
  return [...activeUsers.value];
});

async function updateSequence() {
  let firstUser = currentOrder.value.shift();
  currentOrder.value.push(firstUser!);
  initialOrder.value = [...currentOrder.value];
  await pb.collection("usersequence").update(sequenceData.value.id, {
    user_order: getOrderedUserIds(currentOrder.value),
  });
}

async function updateUserCount() {
  loading.value = true;
  try {
    const cases = await pb.collection("cases").getFullList({ fields: "user" });
    for (let user of props.users) {
      const userCases = cases.filter((item) => item.user === user.id);
      await pb.collection("users").update(user.id, { cases: userCases.length });
    }
    miniToast("success", `User count for ${props.group.description} has been updated.`);
  } catch (e: any) {
    miniToast("failed", e.message);
  }
  loading.value = false;
}

/** update the displayed users */
async function refreshCard() {
  const newSequence = await useGetUserSequenceData(props.group.id);
  const storedOrder = newSequence.user_order;
  // refresh user data
  const currentUsersData = await useGetUsersOfGroup(props.group.id).then(
    (res) => res.items
  );

  // check sequence if all users are not on leave, otherwise remove.
  const newActiveUsers = currentUsersData
    .filter((user) => user.status !== "On leave")
    .map((user) => user.id);
  const newFilteredSequence = storedOrder.filter((user) => newActiveUsers.includes(user));
  if (storedOrder.length !== newFilteredSequence.length) {
    await useUpdateUserSequence(props.group.id, newFilteredSequence);
  }

  // check sequence if all users are in the list, otherwise add on top.
  if (storedOrder.length < newActiveUsers.length) {
    const userFromLeave = newActiveUsers.filter(
      (userId) => !storedOrder.includes(userId)
    );
    const updatedSequence = [...userFromLeave, ...storedOrder];
    await pb
      .collection("usersequence")
      .update(sequenceData.value.id, { user_order: updatedSequence });
  }
  // update active users
  activeUsers.value = [];
  for (let userId of storedOrder) {
    let userInfo = currentUsersData.find((user) => user.id === userId);
    activeUsers.value.push(userInfo!);
  }

  // update users on leave
  usersOnLeave.value = []; // reinitiate
  const onLeaveUsers = currentUsersData.filter((user) => user.status === "On leave");
  if (onLeaveUsers.length > 0) {
    const onLeaveUsersList = onLeaveUsers.map((user) => user.id);
    usersOnLeave.value = [];
    for (let userId of onLeaveUsersList) {
      let userInfo = currentUsersData.find((item) => item.id === userId);
      usersOnLeave.value.push(userInfo!);
    }
  }
}

// watchers
pb.collection("usersequence").subscribe(sequenceData.value.id, async () => {
  loading.value = true;
  await refreshCard();
  listUpdated.value++;
  loading.value = false;
});

pb.collection("users").subscribe("*", async () => {
  await refreshCard();
  listUpdated.value++;
});
</script>
