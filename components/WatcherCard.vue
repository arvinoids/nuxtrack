<template>
  <div class="shadow border w-fit mb-1">
    <h1
      class="px-3 py-2 text-lg bg-neutral bg-opacity-30 w-full border-b-2 border-primary"
    >
      Shift Watch
    </h1>
    <div class="p-5 flex justify-center lg:flex-row flex-col gap-3">
      <div v-for="zone in timezones">
        <WatcherTimeZone
          :geo="zone.zone"
          :range="zone.range"
          :watchers="getWatchers(zone.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { watcher } from "custom-types";
const pb = useNuxtApp().$pb;

const watchersrec = await pb.collection("settings").getOne("wzqow6lg9fwd0yq");
const watchers = JSON.parse(watchersrec.value);

const timezonesrec = await pb.collection("settings").getOne("rqtx3itc0fiy5wv");
const timezones = JSON.parse(timezonesrec.value);

function getWatchers(zoneId: string) {
  return watchers.filter((watcher: watcher) => watcher.zoneId === zoneId);
}

[
  { id: "ap", zone: "AP/ANZ", range: "6a-4p" },
  { id: "emea", zone: "EMEA", range: "4p-11p" },
  { id: "na", zone: "NA/LAD", range: "11p-6a" },
  { id: "oem", zone: "OEM", range: "12a-12p" },
];
</script>

<style></style>
