<template>
  <div>
    <div class="font-semibold">Delete old cases</div>
    <div v-for="group in groups.items">
      <div>
        Cases in {{ group.description }} older than 30 days:
        {{ groupCasesOlderThan(group.id, 30).length }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const groups = await useGetAllGroups();
const cases = await useGetAllCases();
function groupCasesOlderThan(groupId: string, days: number) {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);
  const filteredCases = cases.filter(
    (item) => new Date(item.created) < daysAgo && item.group === groupId
  );
  return filteredCases;
}
</script>

<style></style>
