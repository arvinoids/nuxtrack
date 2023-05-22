<template>
  <div class="flex flex-col items-center" :key="updateTable">
    <div class="flex flex-row justify-start gap-2 items-center my-3">
      <div class="tooltip tooltip-top tooltip-accent" data-tip="Refresh View">
        <button class="btn" @click="updated++">
          <Icon name="mdi:refresh" size="1.2rem" />
        </button>
      </div>
      <div class="tooltip tooltip-top tooltip-accent" data-tip="Add User">
        <nuxt-link to="/Admin/AddUser" for="adduser" class="btn">
          <Icon name="mdi:account-plus-outline" size="1.2rem"
        /></nuxt-link>
      </div>
    </div>
    <div v-if="!loading" class="flex flex-col items-center">
      <table class="table table-zebra table-compact shadow-md" :key="updateTable">
        <thead>
          <tr>
            <th class="rounded-none">Name</th>
            <th>Username</th>
            <th>Group</th>
            <th>Status</th>
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

            <td>
              <AdminStatusSelect :user="user" />
            </td>

            <td>
              <NuxtLink
                :to="`/Admin/User/${user.username}/Edit`"
                class="btn btn-sm btn-warning mx-1 btn-outline"
                ><Icon name="mdi:account-edit-outline" size="1.2rem"
              /></NuxtLink>
              <label
                :for="`delete-${user.id}`"
                class="btn btn-sm btn-error mx-1 btn-outline"
                ><Icon name="mdi:account-remove-outline" size="1.2rem"
              /></label>
              <DeleteUser :id="user.id" :username="user.username" />
            </td>
          </tr>
        </tbody>
      </table>
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
  loading.value = true;
  users.value = await getUsers();
  updateTable.value++;
  loading.value = false;
});
</script>

<style scoped></style>
