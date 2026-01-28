<template>
  <div
    class="absolute w-screen z-50 h-screen flex items-center justify-center backdrop-grayscale"
  >
    <div
      class="flex items-center justify-center relative p-5 bg-base-100 border border-neutral-200 gap-4 z-50 mx-10 backdrop-blur-2xl shadow-xl w-[500px]"
    >
      You are changing status from {{ fromStatus }} to {{ toStatus }}.

      <div v-for="leave in userLeaveRecords">
        <div>{{ groupName(leave.group) }}</div>
        <div>Cases before leave: {{ leave.total_cases }}</div>
        <div>Cases today: {{ casesToday(leave.group) }}</div>
        <div>
          Total cases created while on leave:
          {{ casesToday(leave.group) - leave.total_cases }}
        </div>
        <div>Group members: {{ groupMemberCount(leave.group) }}</div>
        <div>Cases to add = Total cases created divided by the number of members</div>
        <div>
          Cases to add:
          {{
            (casesToday(leave.group) - leave.total_cases) / groupMemberCount(leave.group)
          }}
          =
          {{
            Math.round(
              (casesToday(leave.group) - leave.total_cases) /
                groupMemberCount(leave.group)
            )
          }}
        </div>
        <div class="btn btn-primary">Accept</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { statuschoice } from "custom-types";
import type { GroupsRecord } from "~/pocketbase-types";

const props = defineProps<{
  fromStatus: "Rest day" | "On leave";
  toStatus: statuschoice;
  userGroups: GroupsRecord[];
}>();

const casesCounter = await useGetAllCases();
const allGroups = await useGetAllGroups();
const currentUser = useCurrentUser();
const allUsers = await useGetAllUsers();
const activeLeaves = useActiveLeaves();
const userLeaveRecords = activeLeaves.value.filter(
  (l) => l.user === currentUser.value?.id
);

function groupName(groupId: string) {
  const group = allGroups.items?.find((g) => g.id === groupId);
  return group?.name;
}

function casesToday(groupId: string) {
  const casesInGroup = casesCounter.filter((c) => c.group == groupId);
  return casesInGroup.length;
}

function groupMemberCount(groupId: string) {
  const members = allUsers.items.filter((u) => u.memberOf.includes(groupId));
  return members.length;
}

const rawData = ref();
const teamCalc = ref();
const leaveFrom = ref();
const leaveTo = ref();
const calculatedCases = ref(0);
const tickets = ref(0);

async function getCalculations() {
  rawData.value = await useComputeDummyCases(
    teamCalc.value,
    leaveFrom.value,
    leaveTo.value
  );
  calculatedCases.value = rawData.value.casesToAdd;
  tickets.value = rawData.value.casesToAdd;
  console.log("rawData", rawData.value);
}

async function accept() {}
</script>

<style></style>
