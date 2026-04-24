<template>
  <div class="container mx-auto">
    <div class="w-40">
      <HeadlessListbox v-model="selected">
        <div class="relative mt-1">
          <HeadlessListboxButton
            class="relative w-full cursor-default bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          >
            <span
              class="block truncate"
              :class="`text-${getColor(selected)} font-semibold`"
              >{{ selected }}</span
            >
            <span
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <Icon
                name="carbon:chevron-sort"
                size="1.2rem"
                class="h-5 w-5 text-gray-500"
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
              class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm z-10"
            >
              <HeadlessListboxOption
                v-for="choice in choices"
                v-slot="{ active, selected }"
                :key="choice.status"
                :value="choice.status"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-10 pr-4',
                  ]"
                >
                  <span
                    :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']"
                    >{{ choice.status }}</span
                  >
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                  >
                    <Icon name="ic:sharp-check" size="1.2rem" />
                  </span>
                </li>
              </HeadlessListboxOption>
            </HeadlessListboxOptions>
          </transition>
        </div>
      </HeadlessListbox>
    </div>
    <GlobalLoading :show="changingStatus">{{ loadingMessage }}</GlobalLoading>
  </div>
</template>

<script setup lang="ts">
import type { statuschoice, LogData, LogsCreate } from "custom-types";
import type { user } from "pocketbase-types";
import { LogsTypeOptions, type LeavesReasonOptions } from "~/pocketbase-types";
const pb = useNuxtApp().$pb;

const props = defineProps<{
  user: user;
}>();

const changingStatus = ref(false);
const loadingMessage = ref("");
const choices = STATUS_CHOICES;
const selected = ref(props.user.status);

watch(selected, async (newStatus, oldStatus) => {
  await useChangeUserStatus(props.user.id, newStatus as statuschoice, "");
  if (newStatus === "On leave" || newStatus === "Rest day") {
    loadingMessage.value = `Updating ${props.user.username} status from ${oldStatus} to ${newStatus}`;
    changingStatus.value = true;
    await useUserOnLeaveOrRestDay(props.user.id, newStatus as LeavesReasonOptions);
  }
  if (oldStatus === "On leave" || oldStatus === "Rest day") {
    loadingMessage.value = `Updating ${props.user.username} status from ${oldStatus} to ${newStatus}`;
    changingStatus.value = true;
    await useUserIsBackFromLeaveOrRestDay(
      props.user.id,
      oldStatus as LeavesReasonOptions
    );
  }
  const message = `${props.user.username} status was changed to ${selected.value}`;
  useShowToast(message, "success");
  loadingMessage.value = "Logging to database";
  const logData: LogsCreate = {
    user: pb.authStore.model!.username,
    type: LogsTypeOptions["changed status"],
    details: message,
  };

  await logActivity(logData);
  changingStatus.value = false;
});
</script>
