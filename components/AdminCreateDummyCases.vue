<template>
  <div class="collapse bg-base-100 border-neutral-200 border shadow-md">
    <input type="checkbox" />
    <div class="collapse-title font-semibold">Create dummy cases for user</div>
    <div class="collapse-content">
      <div v-if="creating" class="flex flex-col justify-start w-full">
        <LoadingBlockPage
          ><p>Creating dummy cases ({{ percentComplete }}%)</p>
          <p>Do not navigate away from this page...</p>
          <progress
            class="progress progress-success w-56"
            :value="percentComplete"
            max="100"
          ></progress>
        </LoadingBlockPage>
      </div>
      <div class="flex flex-col justify-start w-full">
        <div class="bg-base-200/50 py-6 w-[50ch] self-center mb-5">
          <div class="flex flex-col items-center gap-1">
            <div class="text-sm text-center w-3/4 mb-2">
              Use this calculator to compute the dummy cases that need to be assigned if a
              user was not set to <strong>Leave</strong> or <strong>Rest day</strong> .
            </div>
            <div class="flex items-center join">
              <label for="fromDate" class="btn join-item label w-[10rem]"
                >Leave date/time:</label
              ><input class="input join-item" type="datetime-local" v-model="leaveFrom" />
            </div>
            <div class="flex items-center join">
              <label for="toDate" class="btn join-item label w-[10rem]"
                >Return date/time:</label
              ><input class="input join-item" type="datetime-local" v-model="leaveTo" />
            </div>
            <div class="flex items-center join w-[360px] mb-2">
              <label for="team" class="btn join-item label w-[7rem]">Team</label
              ><select
                class="select max-w-xs join-item select-bordered"
                v-model="teamCalc"
              >
                <option v-for="team in allGroups.items" :value="team.id">
                  {{ team.description }}
                </option>
              </select>
            </div>
            <div class="flex flex-row gap-3 w-[360px] items-center justify-between">
              <div
                class="btn btn-info"
                @click="getCalculations"
                :class="[{ 'btn-disabled': disableCalculate }]"
              >
                Calculate
              </div>
              <div
                class="flex items-center bg-warning/20 alert h-[40px]"
                v-if="calculatedCases"
              >
                <label for="team" class="label"
                  >Created while on leave: {{ rawData.casesCreatedDuringLeave }}, Dummy:
                  {{ calculatedCases }}</label
                >
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center items-center gap-2">
          <input
            type="number"
            min="1"
            max="100000"
            class="input h-[38px] w-20 shadow-md"
            v-model="tickets"
            :class="creating ? 'input-disabled' : ''"
          />
          <div
            class="btn btn-secondary text-white btn-sm w-[15ch] h-[38px]"
            :class="creating ? 'btn-disabled cursor-wait' : 'cursor-default'"
            @click.prevent="AddDummyCases()"
          >
            {{ creating ? "Creating..." : "Create" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ListResult } from "pocketbase";
import type { user, group } from "pocketbase-types";
import type { LogData } from "custom-types";

const casesChanged = useCaseCountChanged();
const users: ListResult<user> = await useGetAllUsers();
const tickets = ref(1);
const validUsers = getValidUsers();
const currentuser = useCurrentUser();
const creating = ref(false);
const allGroups = await useGetAllGroups();
const teamCalc = ref();
const calculatedCases = ref(0);
const leaveFrom = ref();
const leaveTo = ref();
const rawData = ref();
const percentComplete = usePercentComplete("dummy");

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

console.log("allGroups", allGroups);
type userExpandedMemberOf = user & {
  expand: {
    memberOf: group[];
  };
};
const selectedUser: Ref<userExpandedMemberOf> = ref(
  validUsers[0] as userExpandedMemberOf
);
const availableGroups = computed(() => {
  return selectedUser.value.expand.memberOf;
});

// show only users with elements inside memberOf[]
function getValidUsers() {
  const filtered = users.items.filter((item) => item.memberOf.length > 0);
  return filtered;
}

const firstGroup = ref(selectedUser.value.expand.memberOf[0]);

const selectedGroup = ref(firstGroup);

watch(selectedUser, () => {
  firstGroup.value = selectedUser.value.expand.memberOf[0];
});

async function AddDummyCases() {
  creating.value = true;
  const result = { status: "failed", message: "" };
  try {
    const res = await useAddDummyCases(
      tickets.value,
      selectedUser.value.id,
      selectedGroup.value.id,
      "Dummy"
    );
    result.status = res.status;
    result.message = res.message;
  } catch (e: any) {
    console.log(e);
    result.message = e.message;
  }
  useShowToast(result.message, result.status);
  const data: LogData = {
    user: currentuser.value?.username,
    type: "assigned case",
    details: `${tickets.value} cases assigned to ${selectedUser.value.username} in ${selectedGroup.value.description}`,
  };
  await logActivity(data);
  creating.value = false;
  casesChanged.value++;
}

const disableCalculate = computed(() => {
  return !leaveFrom.value || !leaveTo.value || !teamCalc.value;
});
</script>

<style></style>
