<template>
  <div>
    <div class="font-semibold">Archive old cases</div>
    <div v-for="group in groups.items">
      <div>
        Cases in {{ group.description }} older than 30 days:
        {{ groupCasesOlderThan(group.id, 30).length }} <button @click="archiveCases(groupCasesOlderThan(group.id, 30))"></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { jsonToCSV, useGetFullCases, useSaveFileToDb } from "~/composables/casefunctions";
import type { CasesRecord } from "~/pocketbase-types";

const groups = await useGetAllGroups();
const cases = await useGetFullCases();

function groupCasesOlderThan(groupId: string, days: number) {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);
  const filteredCases = cases.filter(
    (item) => new Date(item.created) < daysAgo && item.group === groupId
  );
  return filteredCases;
}

async function archiveCases(cases: CasesRecord[]) {
  const csvData = jsonToCSV(cases);
  const res = await useSaveFileToDb(csvData);
  miniToast(res.status, res.message);
}


</script>

<style></style>
