<template>
  <!-- Put this part before </body> tag -->
  <input type="checkbox" :id="`delete-${id}`" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box w-min max-w-5xl rounded-none">
      <h3 class="font-bold text-lg">Deleting user...</h3>
      <!-- <p class="py-4"> {{ message }}</p> -->
      <p>Are you sure you want to delete this user?</p>

      <p class="font-bold text-error text-center">{{ username.toUpperCase() }}</p>
      <div class="modal-action">
        <label :for="`delete-${id}`" class="btn">Cancel</label>
        <label :for="`delete-${id}`" class="btn btn-warning" @click="deleteUser(id)"
          >Yes</label
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LogData } from "custom-types";
const loggedInUser = useLoggedInUsername();

const props = defineProps<{
  id: string;
  username: string;
}>();
const update = useDataUpdated();
async function deleteUser(id: string) {
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
</script>
