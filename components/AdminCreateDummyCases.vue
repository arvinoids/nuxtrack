<template>
  <div>
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
      <p class="mb-2 font-bold text-center">Create dummy cases for user</p>
      <div class="border border-neutral-200 shadow py-8 w-[50ch] self-center mb-5">
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
            ><select class="select max-w-xs join-item select-bordered" v-model="teamCalc">
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
        <HeadlessListbox v-model="selectedUser" :disabled="creating">
          <div class="relative">
            <HeadlessListboxButton
              class="relative w-[200px] cursor-default bg-white py-2 pl-3 pr-10 border border-neutral-200 text-left shadow-md sm:text-sm"
            >
              <span class="block truncate">{{ selectedUser.fullname }}</span>
              <span
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <Icon
                  name="carbon:chevron-sort"
                  size="1.2rem"
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </HeadlessListboxButton>
            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <HeadlessListboxOptions
                class="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-lg sm:text-sm z-10"
              >
                <HeadlessListboxOption
                  v-for="user in validUsers"
                  v-slot="{ active, selected }"
                  :key="user.id"
                  :value="user"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-primary text-white' : 'text-gray-900',
                      'relative cursor-default select-none py-2 px-2',
                    ]"
                  >
                    <span
                      :class="[
                        selected ? 'font-medium' : 'font-normal',
                        'block truncate',
                      ]"
                      >{{ user.fullname }}</span
                    >
                  </li>
                </HeadlessListboxOption>
              </HeadlessListboxOptions>
            </transition>
          </div>
        </HeadlessListbox>
        <HeadlessListbox v-model="selectedGroup" :disabled="creating">
          <div class="relative">
            <HeadlessListboxButton
              class="relative w-[200px] cursor-default border border-neutral-200 bg-white py-2 pl-3 pr-10 text-left shadow-md sm:text-sm"
            >
              <span class="block truncate">{{ selectedGroup.description }}</span>
              <span
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <Icon
                  name="carbon:chevron-sort"
                  size="1.2rem"
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </HeadlessListboxButton>
            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <HeadlessListboxOptions
                class="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm z-10"
              >
                <HeadlessListboxOption
                  v-for="group in availableGroups"
                  v-slot="{ active, selected }"
                  :key="group.id"
                  :value="group"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-primary text-white' : 'text-gray-900',
                      'relative cursor-default select-none py-2 px-2',
                    ]"
                  >
                    <span
                      :class="[
                        selected ? 'font-medium' : 'font-normal',
                        'block truncate',
                      ]"
                      >{{ group.description }}</span
                    >
                  </li>
                </HeadlessListboxOption>
              </HeadlessListboxOptions>
            </transition>
          </div>
        </HeadlessListbox>
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
</template>

<script setup lang="ts">
import type { LogData } from "custom-types";

const casesChanged = useCaseCountChanged();
const users = await useGetAllUsers();
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

const selectedUser = ref(validUsers[0]);
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
