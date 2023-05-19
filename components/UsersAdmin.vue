<template>
  <div class="flex flex-col items-center" :key="updateTable">
    <div v-if="!loading" class="flex flex-col items-center">
      <table class="table table-zebra table-compact shadow-md" :key="updateTable">
        <thead>
          <tr>
            <th class="rounded-none">Name</th>
            <th>Username</th>
            <th>Group</th>
            <th>Created</th>
            <th>Status</th>
            <th>Status Message</th>
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
              <AdminStatusSelect :user="user" />
            </td>
            <td>
              {{ user.statusmessage }}
            </td>
            <td>
              <NuxtLink
                :to="`/Admin/User/${user.username}/Edit`"
                class="btn btn-sm btn-warning"
                ><Icon name="mdi:account-edit-outline" size="1.2rem"
              /></NuxtLink>
              <label :for="`delete-${user.id}`" class="btn btn-sm btn-warning"
                ><Icon name="mdi:account-remove-outline" size="1.2rem"
              /></label>
              <DeleteUser :id="user.id" :username="user.username" />
            </td>
          </tr>
        </tbody>
      </table>

      <nuxt-link to="/Admin/AddUser" for="adduser" class="btn my-3">Add User</nuxt-link>
      <AddUser class="max-w-min" />
    </div>
    <div v-else><Spinner /></div>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
pb.autoCancellation(false);

const loading = ref(true);
const updated = useDataUpdated();

let users = ref();

onMounted(async () => {
  users.value = await getUsers();
  loading.value = false;
});

async function getUsers() {
  const res = await pb
    .collection("users")
    .getFullList(1000, { sort: "+username", expand: "memberOf" });
  return res;
}

// const groups = await pb.collection("groups").getFullList(100);

let updateTable = ref(0);
watch(updated, async () => {
  users.value = await getUsers();
  updateTable.value++;
});
</script>

<style scoped></style>
