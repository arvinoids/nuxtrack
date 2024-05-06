<template>
  <div class="border flex flex-col items-center gap-2 shadow w-fit pb-2 mb-1">
    <div
      class="px-3 py-2 text-lg font-normal bg-neutral bg-opacity-30 w-full border-b-2 border-primary"
    >
      {{ title }}
    </div>
    <div class="flex items-center py-2 px-2">
      <div v-for="(user, index) in hosts" :key="index">
        <div
          class="mx-2 w-[12ch] text-center bg-warning bg-opacity-40 rounded-md p-3 shadow-md border-4 border-transparent"
          :class="{ selected: isCurrentHost(index) }"
        >
          {{ user.toUpperCase() }}
        </div>
      </div>
      <div class="tooltip tooltip-top" data-tip="Move to next host">
        <button class="btn btn-accent shadow-lg rounded mr-2" @click="nextHost()">
          <Icon name="ph:fast-forward-duotone" size="1.6rem" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LogData } from "custom-types";

const pb = useNuxtApp().$pb;
const rec = await pb.collection("settings").getOne("r2nh8eqdweest7b");
const hosts = JSON.parse(rec.value);
const currentHost: Ref<number> = ref(await getCurrentHostValue()); // this is a zero-index value.
const loggedInUser = useLoggedInUsername();

const title = await pb
  .collection("settings")
  .getOne("tmemz0wt8thg3f0")
  .then((res) => res.value);

async function nextHost() {
  const current = currentHost.value;
  const currentHostName = hosts[currentHost.value];
  let newHost;
  newHost = current >= hosts.length - 1 ? 0 : current + 1;
  await pb.collection("settings").update("3dvpgm4sesir4kq", { value: newHost });
  currentHost.value = newHost;
  const logInfo: LogData = {
    user: loggedInUser.value,
    type: "clicked next host",
    details: `Previous host was ${currentHostName}`,
  };
  logActivity(logInfo);
}

async function getCurrentHostValue() {
  const rec = await pb.collection("settings").getOne("3dvpgm4sesir4kq");
  return Number(rec.value);
}

function isCurrentHost(index: number) {
  return index === currentHost.value;
}

onMounted(async () => {
  currentHost.value = await getCurrentHostValue();
});
</script>

<style>
.selected {
  @apply border-primary font-semibold;
}
</style>
