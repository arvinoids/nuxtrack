<template>
  <div class="mt-4">
    <div :key="updateTable" class="flex flex-col gap-3">
      <div
        class="overflow-x-auto shadow-md flex flex-col w-[1080px] h-[650px] font-condensed"
        v-if="logs!.totalItems !== 0"
      >
        <table class="table table-compact" v-if="!loading">
          <thead class="sticky top-0 z-20">
            <tr class="bg-base-200">
              <th class="rounded-none w-20">User</th>
              <th class="w-32">Transaction</th>
              <th class="w-auto">Details</th>
              <th class="rounded-none w-48">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="log in logs!.items.filter(log=>!log.debug)"
              :key="log.id"
              class="hover:bg-base-200"
            >
              <td class="rounded-none">{{ log.user }}</td>
              <td>{{ log.type }}</td>
              <td>{{ log.details }}</td>
              <td>{{ useFormatDate(new Date(log.created)) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="text-center mx-auto my-auto" v-else><Spinner /></div>
      </div>
      <div
        v-else
        class="overflow-x-auto bg-base-200 shadow-md flex flex-col items-center justify-center w-[1080px] h-[650px] font-condensed"
      >
        <p>No logs found. Please check your filters.</p>
      </div>
      <div class="flex">
        <div class="flex gap-5 w-full" v-if="logs!.totalItems">
          <select class="select select-bordered w-full max-w-xs" v-model="itemsPerPage">
            <option disabled>Items per page</option>
            <option>15</option>
            <option>30</option>
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
        <div v-else class="w-full"></div>
        <button class="btn btn-info" @click="showFilters">
          <Icon name="ic:round-filter-alt" size="1.2rem" />Filters
        </button>
      </div>
      <p class="text-center my-3 text-sm">
        Total <span class="text-accent">{{ logs!.totalItems }}</span> logs
      </p>
    </div>

    <dialog id="filterDialog" class="modal">
      <form method="dialog" class="modal-box">
        <h3 class="font-bold text-lg">Filters</h3>
        <div class="grid grid-cols-2 gap-4 py-4">
          <div>
            <label for="user">User:</label
            ><input type="text" name="user" id="" class="input" v-model="filters.user" />
          </div>
          <div>
            <label for="type">Type:</label
            ><select name="type" id="" class="select" v-model="filters.type">
              <option v-for="type in LogsTypeOptions" :value="type">{{ type }}</option>
            </select>
          </div>
          <div>
            <label for="dateFrom">Date From:</label
            ><input
              type="datetime-local"
              class="input"
              name="dateFrom"
              id=""
              v-model="interval.timeStart"
            />
          </div>
          <div>
            <label for="dateTo">Date To:</label
            ><input
              type="datetime-local"
              class="input"
              name="dateTo"
              id=""
              v-model="interval.timeEnd"
            />
          </div>
        </div>
        <div class="modal-action">
          <button class="btn btn-outline btn-secondary" @click.prevent="clearFilters">
            Clear Values
          </button>
          <button class="btn">Cancel</button>
          <button class="btn btn-primary" @click.prevent="applyFilters">Apply</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { LogsTypeOptions } from "~/pocketbase-types";

const props = defineProps<{
  type?: string;
  pageNum?: number;
  perPage?: number;
}>();
const loading = ref(true);
const updateTable = ref(0);
const currentPage = ref(1);

type interval = {
  timeStart: string;
  timeEnd: string;
};

type filters = {
  type?: LogsTypeOptions;
  user?: string;
  interval?: interval;
};

const filters = ref<filters>({});

const interval = ref<interval>({
  timeStart: "",
  timeEnd: "",
});

function clearFilters() {
  filters.value = {};
  interval.value = {
    timeStart: "",
    timeEnd: "",
  };
}

onMounted(async () => {
  let pageData = localStorage.getItem("tracker-currentpagelogs");
  let page = pageData === "NaN" || pageData === "0" ? 1 : Number(pageData);
  currentPage.value = page;

  logs = await getLogs(page);
  loading.value = false;
});

// const currentPage = ref(props.pageNum);
const itemsPerPage = ref(props.perPage);
if (props.perPage === undefined) itemsPerPage.value = 15;

async function getLogs(page: number | null | undefined) {
  if (page === null || page === undefined || page === 0) page = 1;
  const record = await useGetFilteredLogs(props.type, page, itemsPerPage.value);

  const logs = record;
  loading.value = false;
  return logs;
}

let logs = await getLogs(1);

watch(itemsPerPage, async () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1;
  } else {
    // if page is already 1, watcher won't fire, so fetch manually
    await getFilteredLogs();
  }
});

watch(currentPage, async (p) => {
  if (!p) return;
  localStorage.setItem("tracker-currentpagelogs", p.toString());
  await getFilteredLogs();
});

function showFilters() {
  const modal = document.getElementById("filterDialog") as HTMLDialogElement;
  if (modal) {
    modal.showModal();
  }
}

async function applyFilters() {
  const modal = document.getElementById("filterDialog") as HTMLDialogElement;
  if (modal) {
    modal.close();
  }
  if (currentPage.value !== 1) {
    currentPage.value = 1;
  } else {
    await getFilteredLogs();
  }
}

async function getFilteredLogs() {
  const intervalFilters =
    interval.value.timeStart || interval.value.timeEnd
      ? {
          timeStart: interval.value.timeStart,
          timeEnd: interval.value.timeEnd,
        }
      : undefined;

  loading.value = true;
  logs = await useGetLogsData(
    currentPage.value,
    itemsPerPage.value ?? 100,
    intervalFilters,
    filters.value.user,
    filters.value.type ? LogsTypeOptions[filters.value.type] : undefined
  );
  loading.value = false;
  updateTable.value++;
}
</script>
