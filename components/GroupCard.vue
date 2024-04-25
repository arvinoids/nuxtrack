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

    <div v-else>
      <div v-if="groupUsers.length > 0" :key="updateCard">
        <div>
          <div v-for="user in filteredUsers" :key="user.id" class="my-[0.1rem]">
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
          <div v-if="usersOnLeave.length > 0">
            <div class="font-bold mt-4">Users on Leave</div>
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
      </div>
      <div v-else class="text-xs mt-3">
        <p>No users in this group.</p>
      </div>
    </div>
    <div class="flex flex-col flex-grow mt-3" :key="dataUpdated">
      <div class="flex justify-center mt-auto gap-2">
        <a :href="anchor"
          ><button v-if="true" class="btn w-24 self-center mb-3">Select</button></a
        >
      </div>
      <SWSelectGroup
        :group="group.id"
        :users="displayUsers"
        @shift="updateDisplayUsers"
        @reset="resetOrder"
        @update="updateSequence"
      />
    </div>
    <div class="bg-gray-100 pt-[7px]"></div>
  </div>
</template>

<script setup lang="ts">
import type { group, user, userSequence } from "pocketbase-types";
const props = defineProps<{
  group: group;
  users: user[];
  usersequence: userSequence | undefined;
}>();
const groupUserCount = ref(props.users.length);
const initialUsers = [...props.users]; // all the users in this group
const filteredUsers = ref(initialUsers.filter((user) => user.status !== "On leave")); // users that are not on leave
const usersOnLeave: Ref<user[]> = ref(
  initialUsers.filter((user) => !filteredUsers.value.includes(user))
);
const userIdsOnLeave: Ref<string[]> = computed(() => {
  return usersOnLeave.value.map((user) => user.id);
});

const pb = useNuxtApp().$pb;
const loading = ref(true);
const orderedUsers: Ref<string[]> = ref([]);
const groupUsers = ref(filteredUsers);
const displayUsers = ref<user[]>([]);
const anchor: string = "#" + props.group.id + "select";
const updateCard = ref(0);
const dataUpdated = ref(0);
const sequenceId = ref("");
const initialOrder = ref();

//
onMounted(async () => {
  try {
    const res = await pb
      .collection("usersequence")
      .getFirstListItem(`group="${props.group.id}"`);
    // the user order currently stored in the databse
    const storedOrder: string[] = res.user_order;
    console.log("Stored sequence length: ", storedOrder.length);

    // if some users came back from leave
    console.log("filteredUsers length: ", filteredUsers.value.length);
    if (filteredUsers.value.length > storedOrder.length) {
      const filteredUserIds = filteredUsers.value.map((user) => user.id);
      // console.log(filteredUserIds.length);
      const usersFromLeave = filteredUserIds.filter(
        (user) => !storedOrder.includes(user)
      );
      console.log("Users from leave: ", usersFromLeave);

      // add the user to the list and update the stored order
      const newSequence = [...usersFromLeave, ...storedOrder];
      console.log("Old sequence: ", filteredUsers.value);
      console.log("New sequence: ", newSequence);
      await pb.collection("usersequence").update(res.id, { user_order: newSequence });
      orderedUsers.value = newSequence;
    }
    // if someone went on leave, remove the user from the sequence and update db
    if (userIdsOnLeave.value.length > 0) {
      const newSequence: string[] = storedOrder.filter(
        (userId) => !userIdsOnLeave.value.includes(userId)
      );
      await pb.collection("usersequence").update(res.id, { user_order: newSequence });
      orderedUsers.value = newSequence;
    } else {
      orderedUsers.value = res.user_order;
    }
    sequenceId.value = res.id;
  } catch {
    const usersequence = groupUsers.value.map((item) => item.id);
    const res = await pb
      .collection("usersequence")
      .create({ group: props.group.id, user_order: usersequence });
    orderedUsers.value = res.user_order;
    sequenceId.value = res.id;
  }

  // update the displayed users with the orderedUsers value
  for (let user of orderedUsers.value) {
    let userInfo = filteredUsers.value.find((item) => item.id === user);
    displayUsers.value.push(userInfo!);
  }

  // remember this initial value so that it can be reset in case the transaction is cancelled
  initialOrder.value = [...displayUsers.value];
  loading.value = false;
});

async function updateDisplayUsers(users: user[]) {
  displayUsers.value = users;
}

const currentOrder = computed(() => {
  return [...displayUsers.value];
});

async function updateSequence() {
  let firstUser = currentOrder.value.shift();
  currentOrder.value.push(firstUser!);
  initialOrder.value = [...currentOrder.value];
  await pb.collection("usersequence").update(sequenceId.value, {
    user_order: getOrderedUserIds(currentOrder.value),
  });
}

function resetOrder() {
  displayUsers.value = [...initialOrder.value];
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

// realtime updates to sequence
pb.collection("usersequence").subscribe("*", async () => {
  loading.value = true;
  await refreshCard();
  loading.value = false;
});

pb.collection("users").subscribe("*", async () => {
  loading.value = true;
  await refreshCard();
  loading.value = false;
});

async function refreshCard() {
  const currentGroupUsers = await useGetUsersOfGroup(props.group.id).then(
    (res) => res.items
  );
  groupUserCount.value = currentGroupUsers.length;

  const newSequence = await useGetUserSequenceData(props.group.id).then(
    (res) => res.user_order
  );
  filteredUsers.value = []; // reinitialize list
  for (let user of newSequence) {
    let userInfo = currentGroupUsers.find((item) => item.id === user);
    filteredUsers.value.push(userInfo!);
  }

  // update people on leave
  const onLeaveUsers = currentGroupUsers.filter((user) => user.status === "On leave");
  const onLeaveUsersList = onLeaveUsers.map((user) => user.id);
  usersOnLeave.value = []; // reinitialize list
  for (let user of onLeaveUsersList) {
    let userInfo = currentGroupUsers.find((item) => item.id === user);
    usersOnLeave.value.push(userInfo!);
  }
  console.log("current users: ", filteredUsers.value);
  groupUsers.value = filteredUsers.value;
}
</script>
