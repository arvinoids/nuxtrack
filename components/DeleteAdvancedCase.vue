<template>
  <div>
    <label
      :for="`delete-${caseItem.id}`"
      class="cursor-pointer text-error"
      title="Delete case"
    >
      <Icon name="ic:twotone-delete-forever" size="1.2rem" />
    </label>
    <input type="checkbox" :id="`delete-${caseItem.id}`" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box rounded-none">
        <h3 class="font-bold text-lg mb-2">Deleting advanced assign case...</h3>
        <p>Are you sure you want to delete this advanced assigned case?</p>
        <p class="font-bold text-error text-center">{{ caseId }}</p>
        <div class="modal-action">
          <label :for="`delete-${caseItem.id}`" class="btn">Cancel</label>
          <label
            :for="`delete-${caseItem.id}`"
            class="btn btn-warning"
            @click="deleteAdvancedCaseCase(caseId)"
            >Yes</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LogData, emailContent } from "custom-types";
import type { BaseModel } from "pocketbase";
import type { UnassignedCasesRecord } from "~/pocketbase-types";
const loggedInUser = useLoggedInUsername();
const modalDelete = ref(false);

const props = defineProps<{
  caseItem: UnassignedCasesRecord & BaseModel;
}>();
const caseId = props.caseItem.caseId;
async function deleteAdvancedCaseCase(id: string) {
  const res = await useDeleteAdvancedCase(id);
  miniToast(res.status, caseId + " has been deleted.");
  const logData: LogData = {
    user: loggedInUser.value,
    type: "deleted case",
    details: res.message,
  };
  const owner = await useGetUserById(props.caseItem.user);
  const email: emailContent = {
    to: owner.email,
    subject: "Advanced Assigned Case has been deleted",
    body: `Hello ${owner.fullname}, \n\nThe advanced assigned case ${caseId} has been removed from your assignment.\n\nThanks,\nRotation Tracker`,
  };
  const emailres = await useSendEmail(email);
  miniToast(emailres.status, emailres.message);
  logActivity(logData);
}
</script>

<style></style>
