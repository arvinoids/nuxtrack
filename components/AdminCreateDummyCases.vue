<template>
  <div>
    <div v-if="creating" class="flex flex-col justify-start w-full">
      <LoadingBlockPage>
        <p>Creating dummy cases ({{ percentComplete }}%)</p>
        <p>Do not navigate away from this page...</p>
        <progress
          class="progress progress-success w-56"
          :value="percentComplete"
          max="100"
        ></progress>
      </LoadingBlockPage>
    </div>

    <div class="flex flex-col justify-start w-full">
      <p class="mb-2 font-bold text-center">Create dummy cases for user</p>

      <div class="border border-neutral-200 shadow py-8 w-[50ch] self-center mb-5">
        <div class="flex flex-col items-center gap-1">
          <div class="text-sm text-center w-3/4 mb-2">
            Use this calculator to compute the dummy cases that need to be assigned if a
            user was not set to <strong>Leave</strong> or <strong>Rest day</strong>.
          </div>

          <div class="flex items-center join">
            <label class="btn join-item label w-[10rem]">Leave date/time:</label>
            <input class="input join-item" type="datetime-local" v-model="leaveFrom" />
          </div>

          <div class="flex items-center join">
            <label class="btn join-item label w-[10rem]">Return date/time:</label>
            <input class="input join-item" type="datetime-local" v-model="leaveTo" />
          </div>

          <div class="flex items-center join w-[360px] mb-2">
            <label class="btn join-item label w-[7rem]">Team</label>
            <select class="select max-w-xs join-item select-bordered" v-model="teamCalc">
              <option v-for="team in allGroups.items" :key="team.id" :value="team.id">
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
              v-if="calculatedCases > -1"
            >
              <label class="label">
                Created while on leave: {{ rawData.casesCreatedDuringLeave }}, Dummy:
                {{ calculatedCases }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 🔽 REPLACED DROPDOWNS -->
      <div class="flex justify-center items-center gap-2">
        <!-- User Select -->
        <select
          v-model="selectedUserId"
          :disabled="creating"
          class="select select-bordered w-[200px] bg-base-100 text-base-content shadow-md"
        >
          <option v-for="user in validUsers" :key="user.id" :value="user.id">
            {{ user.fullname }}
          </option>
        </select>

        <!-- Group Select -->
        <select
          v-model="selectedGroupId"
          :disabled="creating"
          class="select select-bordered w-[200px] bg-base-100 text-base-content shadow-md"
        >
          <option v-for="group in availableGroups" :key="group.id" :value="group.id">
            {{ group.description }}
          </option>
        </select>

        <input
          type="number"
          min="1"
          max="100000"
          class="input w-20 shadow-md"
          v-model="tickets"
          :class="creating ? 'input-disabled' : ''"
        />

        <div
          class="btn btn-secondary text-white w-[12ch]"
          :class="creating || tickets < 1 ? 'btn-disabled cursor-wait' : 'cursor-default'"
          @click.prevent="AddDummyCases()"
        >
          {{ creating ? "Creating..." : "Create" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LogsCreate } from "custom-types";
import { LogsTypeOptions } from "~/pocketbase-types";

const casesChanged = useCaseCountChanged();
const users = await useGetAllUsers();
const tickets = ref(1);
const currentuser = useCurrentUser();
const creating = ref(false);
const allGroups = await useGetAllGroups();

const teamCalc = ref();
const calculatedCases = ref(-1);
const leaveFrom = ref();
const leaveTo = ref();
const rawData = ref();
const percentComplete = usePercentComplete("dummy");

// ✅ filter valid users
function getValidUsers() {
  return users.items.filter((item) => item.memberOf.length > 0);
}
const validUsers = getValidUsers();

// ✅ NEW: IDs instead of objects
const selectedUserId = ref(validUsers[0]?.id);
const selectedGroupId = ref();

// ✅ computed objects
const selectedUser = computed(() =>
  validUsers.find((u) => u.id === selectedUserId.value)
);

const availableGroups = computed(() => {
  return selectedUser.value?.expand.memberOf || [];
});

const selectedGroup = computed(() =>
  availableGroups.value.find((g) => g.id === selectedGroupId.value)
);

// ✅ auto select first group when user changes
watch(
  selectedUserId,
  () => {
    selectedGroupId.value = availableGroups.value[0]?.id;
  },
  { immediate: true }
);

// 🔢 calculator
async function getCalculations() {
  rawData.value = await useComputeDummyCases(
    teamCalc.value,
    leaveFrom.value,
    leaveTo.value
  );
  calculatedCases.value = rawData.value.casesToAdd;
  if (rawData.value.casesToAdd) tickets.value = rawData.value.casesToAdd;
}

// 🚀 create dummy cases
async function AddDummyCases() {
  if (!selectedUser.value || !selectedGroup.value) return;

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
    result.message = e.message;
  }

  useShowToast(result.message, result.status);

  const data: LogsCreate = {
    user: currentuser.value?.username,
    type: LogsTypeOptions["assigned case"],
    details: `${tickets.value} cases assigned to ${selectedUser.value.username} in ${selectedGroup.value.description}`,
  };

  await logActivity(data);

  creating.value = false;
  casesChanged.value++;
}

// 🚫 disable calc
const disableCalculate = computed(() => {
  return !leaveFrom.value || !leaveTo.value || !teamCalc.value;
});
</script>

<style></style>
