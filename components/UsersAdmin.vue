<template>
  <div class="flex flex-col items-center" :key="updateTable">
    <table class="table table-zebra table-compact shadow-md" :key="updateTable">
      <thead>
        <tr>
          <th class="rounded-none">Name</th>
          <th>Username</th>
          <th>Group</th>
          <th>Created</th>
          <th class="rounded-none">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users">
          <td>{{ user.fullname }}</td>
          <td>{{ user.username }}</td>
          <td>
            <span v-for="group in user.expand.memberOf">
              <p>{{ group.description }}</p>
            </span>
          </td>
          <td>{{ useFormatDate(new Date(user.created)) }}</td>
          <td>
            <label :for="`delete-${user.id}`" class="btn btn-sm btn-warning"
              >Delete</label
            >
            <DeleteUser :id="user.id" :username="user.username" />
          </td>
        </tr>
      </tbody>
    </table>
    <nuxt-link to="/Admin/AddUser" for="adduser" class="btn my-3">Add User</nuxt-link>
    <AddUser />
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;

const updated = useDataUpdated();

let users = await getUsers();

async function getUsers() {
  const res = await pb
    .collection("users")
    .getFullList(1000, { sort: "+username", expand: "memberOf" });
  return res;
}

// const groups = await pb.collection("groups").getFullList(100);

let updateTable = ref(0);
watch(updated, async () => {
  users = await getUsers();
  updateTable.value++;
});
</script>

<style></style>
