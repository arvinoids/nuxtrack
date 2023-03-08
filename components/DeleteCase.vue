<template>
  <!-- Put this part before </body> tag -->
  <input type="checkbox" :id="props.id + 'del'" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box w-min max-w-5xl rounded-none">
      <h3 class="font-bold text-lg mb-2">Deleting case...</h3>
      <p>Are you sure you want to delete this case?</p>
      <p class="font-bold text-error text-center">{{ caseId }}</p>
      <div class="modal-action">
        <label :for="props.id + 'del'" class="btn">Cancel</label>
        <label
          :for="props.id + 'del'"
          class="btn btn-warning"
          @click="deleteCase(props.id)"
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
  caseId: string;
  caseOwner: string;
}>();
const caseId = props.caseId;
const update = useDataUpdated();
async function deleteCase(id: string) {
  const res = await useDeleteCase(id);
  update.value++;
  useShowToast(res.message, res.status);
  const logData: LogData = {
    user: loggedInUser.value,
    type: "deleted case",
    details: res.message,
  };
  logActivity(logData);
}
</script>

<style></style>
