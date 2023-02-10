<template>
  <div class="overflow-x-auto border rounded-lg shadow-md" v-if="cases.length > 0">
    <table class="table table-compact w-full" v-if="!loading">
      <thead class="">
        <tr>
          <th>Owner</th>
          <th>Case ID</th>
          <th>Product Set</th>
          <th>Assigned By</th>
          <th>Assigned on</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cases" :key="item.id" class="hover">
          <td>{{ item.expand.user.username }}</td>
          <td>{{ item.case }}</td>
          <td>{{ item.expand.group.description }}</td>
          <td>{{ item.assignedBy }}</td>
          <td>{{ item.created }}</td>
          <td>
            <label :for="item.id + 'edit'" class="btn btn-sm btn-warning mx-1"
              >Edit</label
            >
            <EditCase
              :id="item.id"
              :caseId="item.case"
              :owner="item.user"
              :product="item.group"
            />
            <label :for="item.id + 'del'" class="btn btn-sm btn-error mx-1">Delete</label>
            <DeleteCase :id="item.id" :caseId="item.case" :caseOwner="item.user" />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="text-center" v-else>Loading...</div>
  </div>

  <div v-else>
    <p class="p-10">There are no cases currently assigned to this user.</p>
  </div>

  <p class="text-center">There are {{ cases.length }} cases in this view.</p>
</template>

<script setup lang="ts">
const props = defineProps<{
  userId?: string;
}>();

const loading = ref(true);
async function getCases() {
  const record = await getUserCases(props.userId);
  const cases = record.items;
  loading.value = false;
  return cases;
}
const cases = await getCases();
</script>

<style></style>
