<template>
  <div :key="updateTable">
    <div class="overflow-x-auto border rounded-lg shadow-md" v-if="cases.length > 0">
      <table class="table table-compact w-full" v-if="!loading">
        <thead class="">
          <tr>
            <th>Owner</th>
            <th>Case ID</th>
            <th>Product Set</th>
            <th>Assigned By</th>
            <th>Assigned on</th>
            <th v-if="userIsAdmin()">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cases" :key="item.id" class="hover">
            <td>{{ item.expand.user.username }}</td>
            <td>{{ item.case }}</td>
            <td>{{ item.expand.group.description }}</td>
            <td>{{ item.assignedBy }}</td>
            <td>{{ item.created }}</td>
            <td v-if="userIsAdmin()">
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
    <p class="text-center my-3 text-sm">
      Total <span class="text-accent">{{ cases.length }}</span> Cases
    </p>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
const props = defineProps<{
  userId?: string;
  group?: string;
}>();
const updated = useDataUpdated();
const loading = ref(true);
async function getCases() {
  const record = await useGetFilteredCases(props.userId, props.group);
  // const record = await getUserCases(props.userId, group.value.group);
  // console.log("getting cases table for user:", props.userId);
  // console.log(record);
  const cases = record.items;
  loading.value = false;
  return cases;
}
let cases = await getCases();
// console.log("these are the cases: ", cases);

function userIsAdmin() {
  if (pb.authStore.model.role === "lead" || pb.authStore.model.role === "admin")
    return true;
  else return false;
}

let updateTable = ref(0);
watch(updated, async () => {
  cases = await getCases();
  updateTable.value++;
});
</script>

<style></style>
