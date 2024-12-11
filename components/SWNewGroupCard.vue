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
          <div>
            <button
              class="btn btn-sm btn-circle btn-secondary text-white btn-ghost"
              title="Force check advanced cases"
              @click="checkForAdvancedCases()"
            >
              <Icon name="ic:round-check-circle-outline" size="1.6rem" />
            </button>
            <button
              class="btn btn-sm btn-circle btn-secondary text-white btn-ghost"
              title="Check for advanced cases"
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
      <div
        :key="listUpdated"
        class="flex flex-col items-center"
        ref="userBox"
        v-if="activeUsers.length > 0"
        v-auto-animate
      >
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
      <div v-else class="text-xs mt-3">
        <p>No users are currently active.</p>
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
      v-if="activeUsers.length > 0"
      :key="listUpdated"
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
      <SWSelectGroup
        :group="group.id"
        :users="activeUsers"
        @assign="checkForAdvancedCases()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LogData, notification, result } from "custom-types";
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
  props.users.filter((user) => user.status !== "On leave")
);
const usersOnLeave: Ref<user[]> = ref(
  props.users.filter((user) => user.status === "On leave")
);
const advancedCases = useAdvancedCasesStore();
const loggedInUser = useLoggedInUsername();

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
});

async function checkForAdvancedCases() {
  miniToast("success", "Checking for advanced cases...");
  const firstUser = activeUsers.value[0];
  console.log("user", firstUser.id, firstUser.username);
  console.log("cases", advancedCases.value);

  const userCases = advancedCases.value.filter((item) => item.user === firstUser.id);
  console.log(userCases);
  if (userCases.length) {
    try {
      await submitCase(userCases[0].caseId, firstUser.id, props.group.id).then(() =>
        console.log("Case assigned.")
      );
      await useDeleteAdvancedCase(userCases[0].caseId);
      const logData: LogData = {
        user: loggedInUser.value,
        type: "assigned case",
        details: `${userCases[0].caseId} assigned to ${firstUser.fullname} from advanced assign.`,
      };
      miniToast("success", `Auto assigned advance case to ${firstUser.fullname}`);
      logActivity(logData);
      await checkForAdvancedCases();
    } catch (e: any) {
      miniToast("failed", `Error moving from advanced to assigned: ${e.message}`);
    }
  }
}

async function submitCase(newCaseId: string, userId: string, group: string) {
  const res: notification = await useSubmitCase(newCaseId, userId, group);
  const currentTime = useFormatDate(new Date(Date.now()));
  await useUpdateUserLastAssigned(userId);
  miniToast(res.status, res.message);
  if (res.status === "success") {
    const user = await pb.collection("users").getOne(userId);
    const email = {
      to: user.email,
      subject: "New case assigned to you",
      body: `Hi ${user.fullname}, \n\n${newCaseId} in ${props.group.description} has been assigned to you from advanced cases on ${currentTime}.\n\nRotation Tracker`,
    };
    const emailres: result = (await useSendEmail(email)) as result;
    miniToast(emailres.status, emailres.message);
  }
  const logData: LogData = {
    user: loggedInUser.value,
    type: "assigned case",
    details: `${newCaseId} to ` + (await useGetUsernameFromId(userId)).toUpperCase(),
  };
  logActivity(logData);
}

watch(userBox, () => {
  if (userBox.value) userBoxHeight.value = userBox.value.clientHeight;
});
</script>

<style scoped lang="postcss">
.hovered-user {
  @apply my-[0.05rem] hover:border-primary hover:bg-secondary hover:bg-opacity-10 border border-transparent w-fit px-3 rounded-lg duration-300 ease-in-out;
}
</style>
