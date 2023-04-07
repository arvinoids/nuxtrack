<template>
  <div :key="updateTable" class="flex flex-col gap-3">
    <div
      class="overflow-x-auto shadow-lg flex flex-col w-[1080px]"
      v-if="logs!.totalItems !== 0"
    >
      <table class="table table-compact" v-if="!loading">
        <thead>
          <tr>
            <th class="rounded-none">User</th>
            <th>Transaction</th>
            <th>Details</th>
            <th class="rounded-none">Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs!.items" :key="log.id" class="hover">
            <td class="rounded-none">{{ log.user }}</td>
            <td>{{ log.type }}</td>
            <td>{{ log.details }}</td>
            <td>{{ useFormatDate(new Date(log.created)) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="text-center" v-else>Loading...</div>
    </div>
    <div class="flex flex-row gap-10">
      <select class="select select-bordered w-full max-w-xs" v-model="itemsPerPage">
        <option disabled>Items per page</option>
        <option selected>10</option>
        <option>20</option>
        <option>100</option>
      </select>
      <div class="btn-group justify-center" :key="updateTable">
        <button
          class="btn"
          v-for="page in logs!.totalPages"
          :class="{ 'btn-active btn-disabled': page === logs!.page }"
          @click="getPage(page)"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <p class="text-center my-3 text-sm">
      Total <span class="text-accent">{{ logs!.totalItems }}</span> Cases
    </p>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
const props = defineProps<{
  type?: string;
  pageNum?: number;
  perPage?: number;
}>();
const loading = ref(true);
const updateTable = ref(0);

const currentPage = ref(props.pageNum);
const itemsPerPage = ref(props.perPage);

async function getLogs(page: number) {
  const record = await useGetFilteredLogs(props.type, page, itemsPerPage.value);

  const logs = record;
  loading.value = false;
  return logs;
}

let page = props.pageNum === undefined ? 1 : props.pageNum;

let logs = await getLogs(page);

async function getPage(page: number) {
  logs = await getLogs(page);
  updateTable.value++;
}
</script>
