<template>
  <div class="flex flex-col justify-start w-full">
    <p class="text-sm mb-2 font-bold">Create dummy cases for user</p>
    <div class="flex items-center gap-2">
      <HeadlessListbox v-model="selectedUser">
        <div class="relative">
          <HeadlessListboxButton
            class="border relative w-[200px] cursor-default bg-white py-2 pl-3 pr-10 text-left shadow-md sm:text-sm"
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
              class="absolute mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm z-10"
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
                    :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']"
                    >{{ user.fullname }}</span
                  >
                </li>
              </HeadlessListboxOption>
            </HeadlessListboxOptions>
          </transition>
        </div>
      </HeadlessListbox>

      <HeadlessListbox v-model="selectedGroup">
        <div class="relative">
          <HeadlessListboxButton
            class="border relative w-[200px] cursor-default bg-white py-2 pl-3 pr-10 text-left shadow-md sm:text-sm"
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
                    :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']"
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
        class="input input-bordered h-[38px] w-20"
        v-model="tickets"
      />

      <div
        class="btn shadow-md btn-outline btn-warning btn-sm h-[38px] max-w-min border cursor-default"
        @click.prevent="AddDummyCases"
      >
        Create
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ListResult } from "pocketbase";
import type { LogData } from "custom-types";

const casesChanged = useCaseCountChanged();
const users: ListResult = await useGetAllUsers();
const tickets = ref(1);
const validUsers = getValidUsers();
const selectedUser = ref(validUsers[0]);
const availableGroups = computed(() => {
  return selectedUser.value.expand.memberOf;
});

// show only users with elements inside memberOf[]
function getValidUsers() {
  const filtered = users.items.filter((item) => {
    return !(item.memberOf == ![]);
  });
  return filtered;
}

const firstGroup = ref(selectedUser.value.expand.memberOf[0]);

const selectedGroup = ref(firstGroup);

watch(selectedUser, () => {
  firstGroup.value = selectedUser.value.expand.memberOf[0];
});

async function AddDummyCases() {
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
    user: useCurrentUser()!.username,
    type: "assigned case",
    details: `${tickets.value} cases assigned to ${selectedUser.value.username} in ${selectedGroup.value.description}`,
  };
  logActivity(data);
  casesChanged.value++;
}
</script>

<style></style>
