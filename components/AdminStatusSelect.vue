<template>
  <div class="container mx-auto">
    <div class="w-40">
      <HeadlessListbox v-model="selected">
        <div class="relative mt-1">
          <HeadlessListboxButton
            class="relative w-full cursor-default bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          >
            <span class="block truncate" :class="`text-${getColor(selected)}`">{{
              selected
            }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { statuschoice, LogData } from "custom-types";
import { user } from "pocketbase-types";
const pb = useNuxtApp().$pb;
const changer = useUserWhoChangedStatus();

const props = defineProps<{
  user: user;
}>();
const choices = STATUS_CHOICES;
const selected = ref(props.user.status);

watch(selected, async (newStatus, oldStatus) => {
  await useChangeUserStatus(props.user.id, newStatus as statuschoice, "");
  if (newStatus === "On leave") {
    await useUserOnLeave(props.user.id);
  }
  if (oldStatus === "On leave") {
    await useUserIsBackFromLeave(props.user.id);
  }
  const message = `${props.user.username.toUpperCase()} status was changed to ${selected.value.toUpperCase()} by ${pb.authStore.model!.username.toUpperCase()}`;
  useShowToast(message, "success");
  const logData: LogData = {
    user: pb.authStore.model!.username,
    type: "changed status",
    details: message,
  };

  await logActivity(logData);
});

// pb.collection("users").subscribe(props.user.id, async () => {
//   selected.value = (await pb.collection("users").getOne(props.user.id)).status;
// });
</script>
