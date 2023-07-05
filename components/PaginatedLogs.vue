<template>
  <div>
    <div :key="updateTable" class="flex flex-col gap-3">
      <div
        class="overflow-x-auto shadow-md flex flex-col w-[1080px] h-[600px]"
        v-if="logs!.totalItems !== 0"
      >
        <table class="table table-compact" v-if="!loading">
          <thead class="sticky top-0 z-20">
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
          <option>10</option>
          <option>20</option>
          <option>100</option>
        </select>

        <div class="btn-group">
          <button
            class="btn"
            :class="{ 'btn-disabled': currentPage === 1 }"
            @click="currentPage = 1"
          >
            ‹
          </button>
          <button
            class="btn"
            :class="{ 'btn-disabled': currentPage === 1 }"
            @click="currentPage--"
          >
            «
          </button>
          <button class="btn">Page {{ currentPage }} of {{ logs?.totalPages }}</button>
          <button
            class="btn"
            :class="{ 'btn-disabled': currentPage === logs?.totalPages }"
            @click="currentPage++"
          >
            »
          </button>
          <button
            class="btn"
            :class="{ 'btn-disabled': currentPage === 1 }"
            @click="currentPage = logs!.totalPages"
          >
            ›
          </button>
        </div>
      </div>
      <p class="text-center my-3 text-sm">
        Total <span class="text-accent">{{ logs!.totalItems }}</span> Cases
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type?: string;
  pageNum?: number;
  perPage?: number;
}>();
const loading = ref(true);
const updateTable = ref(0);
const currentPage = ref(1);

onMounted(async () => {
  let pageData = localStorage.getItem("tracker-currentpagelogs");
  let page = pageData === "NaN" || pageData === "0" ? 1 : Number(pageData);
  currentPage.value = page;

  logs = await getLogs(page);
  loading.value = false;
});

// const currentPage = ref(props.pageNum);
const itemsPerPage = ref(props.perPage);
if (props.perPage === undefined) itemsPerPage.value = 10;

async function getLogs(page: number | null | undefined) {
  if (page === null || page === undefined || page === 0) page = 1;
  const record = await useGetFilteredLogs(props.type, page, itemsPerPage.value);

  const logs = record;
  loading.value = false;
  return logs;
}

let page = props.pageNum === undefined ? 1 : props.pageNum;

let logs = await getLogs(page);

async function getPage(page: number | null) {
  if (page === null || page === 0) {
    page = 1;
  }
  logs = await getLogs(page);
  currentPage.value = page;
  localStorage.setItem("tracker-currentpagelogs", currentPage.value!.toString());
  updateTable.value++;
}

watch(itemsPerPage, async () => {
  getPage(1);
  currentPage.value = 1;
  loading.value = true;
  logs = await getLogs(1);
  loading.value = false;
  updateTable.value++;
});

watch(currentPage, async (p = currentPage.value) => {
  getPage(p);
  logs = await getLogs(p);
  updateTable.value++;
});
</script>
