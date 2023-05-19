<template>
  <div class="flex flex-col justify-center items-center gap-2 w-auto">
    <p class="text-sm font-bold self-start">Case Stats</p>
    <div v-if="!loading" class="h-[320px] w-[450px]">
      <table class="border table table-compact table-zebra rounded-none">
        <thead>
          <th class="rounded-none">Group</th>
          <th>Total</th>
          <th>Highest</th>
          <th>Lowest</th>
          <th class="rounded-none">Actions</th>
        </thead>
        <tbody>
          <tr v-for="stat in stats">
            <td>{{ stat.description }}</td>
            <td>{{ stat.totalCases }}</td>
            <td>{{ stat.highestCount }}</td>
            <td>{{ stat.lowestCount }}</td>
            <td>
              <label
                for="deleteCases"
                class="btn btn-outline btn-warning btn-xs"
                @click="
                  selectedGroup = stat.group;
                  selectedGroupDescription = stat.description;
                "
                >Delete All</label
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-else
      class="border h-[320px] w-[450px] flex flex-col justify-center items-center"
    >
      <Spinner />
    </div>
    <div class="btn btn-sm btn-warning" @click="refresh">Refresh</div>
    <div>
      <input type="checkbox" id="deleteCases" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box relative">
          <label for="deleteCases" class="btn btn-xs absolute right-2 top-2">✕</label>
          <h3 class="text-lg font-bold">
            Deleting case in
            {{ selectedGroupDescription }}
          </h3>
          <p class="py-4">
            This will delete all cases in
            <span class="font-semibold">{{ selectedGroupDescription }}</span
            >. This cannot be undone.
          </p>
          <p>Proceed?</p>
          <div class="modal-action center">
            <label
              for="deleteCases"
              class="btn btn-sm btn-error btn-outline"
              @click="deleteGroupCases(selectedGroup)"
              >Yes</label
            >
            <label for="deleteCases" class="btn btn-warning btn-outline btn-sm">No</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LogData } from "custom-types";

const selectedGroup = ref("");
const selectedGroupDescription = ref("");
const loading = ref(true);
const groups = (await useGetAllGroups()).items;
const casesChanged = useCaseCountChanged();

async function deleteGroupCases(group: string) {
  const res = await useDeleteGroupCases(group);
  useShowToast(res.message, res.status);
  const logData: LogData = {
    user: useCurrentUser()!.username,
    type: "deleted case",
    details: `Deleted all cases in group ${group}`,
  };
  logActivity(logData);
  casesChanged.value++;
}

interface groupStat {
  group: string;
  description: string;
  totalCases: number;
  highestCount: number;
  lowestCount: number;
}

const stats = ref<groupStat[]>();

async function getGroupStats() {
  // returns an array of groupstats with each item composed of totalCases, highestCount and lowestCount
  let data: groupStat[] = [];
  for (let i = 0; i < groups.length; i++) {
    let group = groups[i];
    let res = await useGetGroupStats(group.id, group.description);
    data.push(res);
  }

  return data;
}

async function refresh() {
  loading.value = true;
  await useRefreshAll();
  stats.value = await getGroupStats();
  console.log(stats.value);
  loading.value = false;
}

onMounted(async () => {
  stats.value = await getGroupStats();
  loading.value = false;
});

watch(casesChanged, async () => {
  await refresh();
});
</script>

<style></style>
