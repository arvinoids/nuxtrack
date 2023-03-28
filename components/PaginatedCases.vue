<template>
  <div :key="updateTable" class="flex flex-col gap-3">
    <div
      class="overflow-x-auto shadow-lg flex flex-col w-[1080px]"
      v-if="cases.totalItems !== 0"
    >
      <table class="table table-compact" v-if="!loading">
        <thead>
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
    <div class="btn-group justify-center">
      <button
        class="btn"
        v-for="page in cases.totalPages"
        :class="{ 'btn-active': page === cases.page }"
        @click="getPage(page)"
      >
        {{ page }}
      </button>
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

const currentPage = ref(props.pageNum);
const itemsPerPage = ref(props.perPage);

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
  console.log(cases);
  updateTable.value++;
}
</script>

<style></style>
