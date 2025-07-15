<template>
  <div class="flex flex-col justify-center items-center gap-2 w-[400px]">
    <p class="text-sm font-bold self-start">Case Stats</p>
    <div v-if="!loading">
      <table class="table font-condensed table-compact table-zebra rounded-none">
        <thead>
          <th class="rounded-none">Group</th>
          <th>Total</th>
          <th>Highest</th>
          <th class="rounded-none">Lowest</th>
        </thead>
        <tbody>
          <tr v-for="stat in stats">
            <td>{{ stat.description }}</td>
            <td>{{ stat.totalCases }}</td>
            <td>{{ stat.highestCount }}</td>
            <td>{{ stat.lowestCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else></div>
    <div class="btn btn-sm btn-warning" @click="refresh">Refresh</div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(true);
const groups = (await useGetAllGroups()).items;
interface groupStat {
  group: string | undefined;
  description: string;
  totalCases: number;
  highestCount: number;
  lowestCount: number;
}

const stats = ref<groupStat[]>();

async function getGroupStats() {
  // returns an array of groupstats with each item composed of totalCases, highestCount and lowestCount
  let data: groupStat[] = [];
  //   groups.forEach(async (group) => {
  //     let res = await useGetGroupStats(group.id, group.description);
  //     data.push(res);
  //   });
  for (let i = 0; i < groups.length; i++) {
    let group = groups[i];
    let res = await useGetGroupStats(group.id, group.description);
    data.push(res as groupStat);
  }

  return data;
}

onMounted(async () => {
  stats.value = await getGroupStats();
  loading.value = false;
});
async function refresh() {
  loading.value = true;
  await useRefreshAll();
  stats.value = await getGroupStats();
  loading.value = false;
}
</script>

<style></style>
