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
        <div class="flex items-center">
          <div
            class="tooltip tooltip-bottom tooltip-accent"
            data-tip="Click this if you checked for new cases."
          ></div>
        </div>
      </div>
    </div>
    <div v-if="loading" class="m-10"><Spinner /></div>

    <div v-else>
      <div v-if="displayUsers.length > 0" :key="updateCard">
        <div v-for="(user, id) in displayUsers" :key="user.id" class="my-[0.1rem]">
          <nuxt-link
            :to="`/${group.name}/${user.username}`"
            class="tooltip tooltip-top"
            :data-tip="user.username.toUpperCase() + ' is ' + user.status + ' - '"
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
        @update="updateOrder"
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
const filteredUsers = props.users.filter((user) => user.status !== "On leave");
const usersOnLeave: user[] = props.users.filter((user) => !filteredUsers.includes(user));
const userIdsOnLeave: string[] = usersOnLeave.map((user) => user.id);

const pb = useNuxtApp().$pb;
const loading = ref(true);
const orderedUsers = ref();
const groupUsers = ref(filteredUsers);
const displayUsers = ref<user[]>([]);
const anchor: string = "#" + props.group.id + "select";
const updateCard = ref(0);
const dataUpdated = ref(0);
const sequenceId = ref("");
const initialOrder = ref();

onMounted(async () => {
  try {
    const res = await pb
      .collection("usersequence")
      .getFirstListItem(`group="${props.group.id}"`);
    const storedOrder: string[] = res.user_order;
    // if some users came back from leave
    if (filteredUsers.length > storedOrder.length) {
      const filteredUserIds = filteredUsers.map((user) => user.id);
      const usersFromLeave = filteredUserIds.filter(
        (user) => !storedOrder.includes(user)
      );
      const newOrder = [...usersFromLeave, storedOrder];
      await pb.collection("usersequence").update(res.id, { user_sequence: newOrder });
    }
    // if someone went on leave
    if (userIdsOnLeave.length > 0 && res.user_order.length > 0) {
      const updatedSequence: string[] = storedOrder.filter(
        (userId) => !userIdsOnLeave.includes(userId)
      );
      await pb.collection("usersequence").update(res.id, { user_order: updatedSequence });
      orderedUsers.value = updatedSequence;
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

  for (let user of orderedUsers.value) {
    let userInfo = filteredUsers.find((item) => item.id === user);
    displayUsers.value.push(userInfo!);
  }
  initialOrder.value = [...displayUsers.value];
  loading.value = false;
});

async function updateDisplayUsers(users: user[]) {
  displayUsers.value = users;
}

const currentOrder = computed(() => {
  return [...displayUsers.value];
});

async function updateOrder() {
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

// realtime updates to sequence
pb.collection("usersequence").subscribe("*", async () => {
  const res = await getOrderedUsers(props.group.id);
  if (displayUsers.value !== res) displayUsers.value = res;
});
</script>
