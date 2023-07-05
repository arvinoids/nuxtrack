<template>
  <div :key="updateTable" class="flex flex-col gap-3">
    <div
      class="overflow-x-auto shadow-lg flex flex-col w-[1080px] h-[600px]"
      v-if="cases.totalItems !== 0"
    >
      <table class="table table-compact" v-if="!loading">
        <thead class="sticky top-0 z-20">
          <tr>
            <th class="rounded-none">Owner</th>
            <th>Case ID</th>
            <th>Product Set</th>
            <th>Assigned By</th>
            <th class="rounded-none">Assigned on</th>
            <th v-if="userIsAdmin()" class="rounded-none">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in (cases as unknown as expandedCaseRecordList).items"
            :key="item.id"
            class="hover"
          >
            <td class="rounded-none">{{ item.expand.user.username }}</td>
            <td>{{ item.case }}</td>
            <td>{{ item.expand.group.description }}</td>
            <td>{{ item.assignedBy }}</td>
            <td>{{ useFormatDate(new Date(item.created)) }}</td>
            <td v-if="userIsAdmin()" class="rounded-none">
              <label :for="item.id + 'edit'" class="btn btn-sm btn-warning mx-1"
                >Edit</label
              >
              <EditCase
                :id="item.id"
                :caseId="item.case"
                :owner="item.user"
                :product="item.group"
              />
              <label :for="item.id + 'del'" class="btn btn-sm btn-error mx-1"
                >Delete</label
              >
              <DeleteCase :id="item.id" :caseId="item.case" :caseOwner="item.user" />
            </td>
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
        <button class="btn">Page {{ currentPage }} of {{ cases?.totalPages }}</button>
        <button
          class="btn"
          :class="{ 'btn-disabled': currentPage === cases?.totalPages }"
          @click="currentPage++"
        >
          »
        </button>
        <button
          class="btn"
          :class="{ 'btn-disabled': currentPage === 1 }"
          @click="currentPage = cases!.totalPages"
        >
          ›
        </button>
      </div>
    </div>
    <p class="text-center my-3 text-sm">
      Total <span class="text-accent">{{ cases.totalItems }}</span> Cases
    </p>
  </div>
</template>

<script setup lang="ts">
import { expandedCaseRecordList } from "pocketbase-types";
const pb = useNuxtApp().$pb;
const props = defineProps<{
  userId?: string;
  group?: string;
  pageNum?: number;
  perPage?: number;
}>();

const updated = useDataUpdated();
const loading = ref(true);
const updateTable = ref(0);

const currentPage = ref(props.pageNum ?? 1);
const itemsPerPage = ref(props.perPage);
if (props.perPage === undefined) itemsPerPage.value = 10;

async function getCases(page: number) {
  const record = await useGetFilteredCases(
    props.userId,
    props.group,
    page,
    itemsPerPage.value
  );

  const cases = record;
  loading.value = false;
  return cases;
}

let page = props.pageNum === undefined ? 1 : props.pageNum;

let cases = await getCases(page);

function userIsAdmin() {
  if (pb.authStore.model!.role === "lead" || pb.authStore.model!.role === "admin")
    return true;
  else return false;
}

watch(updated, async () => {
  cases = await getCases(1);
  updateTable.value++;
});

async function getPage(page: number) {
  cases = await getCases(page);
  updateTable.value++;
}

// watch(itemsPerPage, async () => {
//   getPage(1);
//   cases = await getCases(1);
//   updateTable.value++;
// });

// new watchers
watch(itemsPerPage, async () => {
  getPage(1);
  currentPage.value = 1;
  loading.value = true;
  cases = await getCases(1);
  loading.value = false;
  updateTable.value++;
});

watch(currentPage, async (p = currentPage.value) => {
  getPage(p);
  cases = await getCases(p);
  updateTable.value++;
});
</script>
