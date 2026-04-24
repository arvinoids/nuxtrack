<template>
  <div class="flex flex-col items-center" :key="updateTable">
    <div class="flex flex-row justify-start gap-2 items-center my-3">
      <button class="btn" @click="updated++" title="Refresh view">
        <Icon name="mdi:refresh" size="1.2rem" />
      </button>

      <nuxt-link to="/Admin/AddUser" for="adduser" class="btn" title="Add new user">
        <Icon name="mdi:account-plus-outline" size="1.2rem"
      /></nuxt-link>
    </div>
    <div
      v-if="!loading"
      class="flex flex-col items-center overflow-x-auto w-[900px] h-[680px]"
    >
      <table
        class="table shadow-md border-base-200 border font-condensed"
        :key="updateTable"
      >
        <thead class="sticky top-0 z-20">
          <tr class="bg-base-200">
            <th class="rounded-none">Name</th>
            <th>Username</th>
            <th>Group</th>
            <th>Status</th>
            <th>Previous Status</th>
            <th class="rounded-none w-34">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users">
            <td>{{ user.fullname }}</td>
            <td>{{ user.username }}</td>
            <td>
              <span v-if="user.expand">
                <span v-for="group in user.expand.memberOf">
                  <p>{{ group.description }}</p>
                </span> </span
              ><span v-else>None</span>
            </td>

            <td>
              <AdminStatusSelect :user="user" />
            </td>
            <td>
              {{ user.previous_status }}
            </td>

            <td>
              <NuxtLink
                :to="`/Admin/User/${user.username}/Edit`"
                class="btn btn-sm btn-square btn-warning text-primary-content mx-1"
                title="Edit user details"
                ><Icon name="mdi:account-edit-outline" size="1.2rem"
              /></NuxtLink>
              <label
                :for="`delete-${user.id}`"
                class="btn btn-sm btn-square btn-primary mx-1"
                title="Delete user"
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
  const res = await pb.collection("users").getFullList(1000, {
    sort: "+fullname",
    expand: "memberOf",
    fields: "id,fullname,username,expand.memberOf,status,previous_status",
  });
  return res;
}

const unsubscribe = await pb.collection("users").subscribe("*", async (e) => {
  users.value = await getUsers();
});

onUnmounted(() => {
  unsubscribe?.();
});

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
