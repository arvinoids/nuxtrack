<template>
  <!-- Put this part before </body> tag -->
  <input type="checkbox" :id="`delete-${id}`" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box w-min max-w-5xl rounded-none">
      <h3 class="font-bold text-lg mb-2">Deleting user...</h3>
      <!-- <p class="py-4"> {{ message }}</p> -->
      <p class="mb-2">
        User
        <span class="font-bold text-error text-center">{{ username.toUpperCase() }}</span>
        will be deleted.
      </p>
      <p class="mb-2">Another user needs to own the cases from this user.</p>
      <div class="form-control w-full max-w-xs">
        <select class="select select-bordered" v-model="newUser">
          <option value="Select a user below:">Select a user below:</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.fullname }}
          </option>
        </select>
      </div>
      <div class="modal-action">
        <label :for="`delete-${id}`" class="btn">Cancel</label>
        <label
          :for="`delete-${id}`"
          class="btn btn-warning"
          :class="{ 'btn-disabled': deleteDisabled }"
          @click="deleteUser(id)"
          >Delete {{ username.toUpperCase() }}</label
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LogData } from "custom-types";
const loggedInUser = useLoggedInUsername();
const pb = useNuxtApp().$pb;
const deleteDisabled = ref(true);

const props = defineProps<{
  id: string;
  username: string;
}>();

const usersData = await pb.collection("users").getList();
const newUser = ref("Select a user below:");
const users = usersData.items;

const update = useDataUpdated();

async function deleteUser(id: string) {
  const assign = await useReassignCases(id, newUser.value);
  useShowToast(assign.message, assign.status);
  const removeGroups = await useRemoveUserFromGroups(id);
  useShowToast(removeGroups.message, removeGroups.status);
  const res = await useDeleteUser(id);
  update.value++;
  useShowToast(res.message, res.status);
  const logData: LogData = {
    user: loggedInUser.value,
    type: "deleted user",
    details: res.message,
  };
  logActivity(logData);
}

watch(newUser, () => {
  console.log("newuser ", newUser.value);
  if (newUser.value == "Select a user below:") deleteDisabled.value = true;
  else deleteDisabled.value = false;
});
</script>
