<template>
  <div class="flex flex-col text-center m-1 w-[250px] shadow border bg-base-100">
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
    <div v-if="loading" class="m-10 relative" :style="`height:${userBoxHeight}`">
      <Spinner />
    </div>

    <div v-else>
      <div v-if="activeUsers.length > 0">
        <div :key="listUpdated" class="flex flex-col items-center" ref="userBox">
          <div v-for="user in activeUsers" :key="user.id" class="hovered-user">
            <nuxt-link
              :to="`/${group.name}/${user.username}`"
              class="tooltip tooltip-right"
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
                size="0.7rem"
              />
              <span class="hover:text-accent">
                {{ user.fullname }}
              </span>
            </nuxt-link>
            <div class="text-[0.6rem] text-warning">
              {{ useFormatDate(user.last_assigned) }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-xs mt-3">
        <p>No users are currently active.</p>
      </div>

      <div v-if="inactiveUsers.length > 0" :key="listUpdated">
        <div class="font-bold mt-3">Inactive users</div>
        <div v-for="user in inactiveUsers" :key="user.id" class="my-[0.1rem]">
          <nuxt-link
            :to="`/${group.name}/${user.username}`"
            class="tooltip tooltip-right"
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
              size=".7rem"
            />
            <span class="hover:text-accent">
              {{ user.fullname }}
            </span>
          </nuxt-link>
          <div class="text-[0.6rem] text-warning">
            {{ useFormatDate(user.last_assigned) }}
          </div>
        </div>
      </div>
      <div v-if="usersOnLeave.length > 0" :key="listUpdated">
        <div class="font-bold mt-3">Users on Leave</div>
        <div v-for="user in usersOnLeave" :key="user.id" class="my-[0.1rem]">
          <nuxt-link
            :to="`/${group.name}/${user.username}`"
            class="tooltip tooltip-right"
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
              size=".7rem"
            />
            <span class="hover:text-accent">
              {{ user.fullname }}
            </span>
          </nuxt-link>
          <div class="text-[0.6rem] text-warning">
            {{ useFormatDate(user.last_assigned) }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col flex-grow mt-3"
      :key="listUpdated"
      v-if="activeUsers.length > 0"
    >
      <div class="flex justify-center mt-auto gap-1">
        <a :href="anchor"
          ><button
            v-if="true"
            class="btn btn-secondary btn-outline w-24 self-center mb-3"
          >
            Select
          </button></a
        >
      </div>
      <SWSelectGroup :group="group.id" :users="activeUsers" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { group, user } from "pocketbase-types";
const props = defineProps<{
  group: group;
  users: user[];
}>();
// initialize db
const pb = useNuxtApp().$pb;
pb.autoCancellation(false);

// background variables
// const dataUpdated = ref(0);
const anchor: string = "#" + props.group.id + "select";
const listUpdated = ref(0);
const userBox: Ref<HTMLElement | null> = ref(null);
const userBoxHeight: Ref<number | null> = ref(null);

// reactive variables
const loading = ref(true);
const activeUsers: Ref<user[]> = ref(
  props.users.filter((user) => user.status === "Available")
);
const usersOnLeave: Ref<user[]> = ref(
  props.users.filter((user) => user.status === "On leave")
);

const inactiveUsers: Ref<user[]> = ref(
  props.users.filter((user) => user.status !== "Available" && user.status !== "On leave")
);
// const sequenceData = ref(await getOrCreateSequence(props.group.id));

onMounted(() => {
  loading.value = false;
});

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

async function refreshCard() {
  const users = await useGetUsersOfGroup(props.group.id);
  activeUsers.value = users.items.filter((user) => user.status !== "On leave");
  usersOnLeave.value = users.items.filter((user) => user.status === "On leave");
}
// watchers

pb.collection("users").subscribe("*", async () => {
  await refreshCard();
  listUpdated.value++;
});

watch(userBox, () => {
  if (userBox.value) userBoxHeight.value = userBox.value.clientHeight;
});
</script>

<style scoped lang="postcss">
.hovered-user {
  @apply my-[0.05rem] hover:border-primary hover:bg-secondary hover:bg-opacity-10 border border-transparent w-fit px-3 rounded-lg duration-300 ease-in-out;
}
</style>
