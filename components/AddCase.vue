<template>
  <div class="modal" :id="props.groupId">
    <div class="modal-box w-2/3 max-w-5xl">
      <h3 class="font-bold text-lg">Assign ticket to {{ props.groupDescription }}</h3>
      <div class="flex flex-col items-center">
        <p class="py-4">The ticket will be assigned to {{ props.nextUserName }}</p>
        <input
          type="text"
          placeholder="CAS-XXXXXXXXXXX"
          class="input input-bordered my-2 w-[300px]"
          v-model="caseId"
        />
        <div
          v-if="message"
          class="alert alert-success my-2 w-max"
          :class="{ 'alert-error': submitStatus === 'failed' }"
        >
          {{ message }}
        </div>
      </div>
      <div class="modal-action justify-center">
        <a :href="'#' + skipAnchorCatch" class="btn btn-outline">Skip - Catch up later</a>
        <a :href="'#' + skipAnchorOut" class="btn btn-outline">Skip - Out of office</a>
        <label class="btn btn-success" @click="submitCase">Assign</label>
        <a href="#" class="btn btn-warning">Cancel</a>
      </div>
    </div>
  </div>
  <SkipCatch
    :userId="props.nextUserId"
    :id="skipAnchorCatch"
    :groupId="props.groupId"
    :fullName="props.nextUserName"
  />
  <SkipOut
    :userId="props.nextUserId"
    :id="skipAnchorOut"
    :groupId="props.groupId"
    :fullName="props.nextUserName"
  />
  <CaseValidation
    :user="props.nextUserId"
    :id="props.groupId + props.nextUserId"
    :group="props.groupId"
    :fullName="props.nextUserName"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  groupId: string;
  groupDescription: string;
  nextUserId: string;
  nextUserName: string;
}>();
const caseId = useCaseId();
let str1 = props.groupId;
let str2 = props.nextUserId;
const skipAnchorCatch: string = str1!.concat(str2!, "Catch");
const skipAnchorOut: string = str1!.concat(str2!, "Out");
const message = ref("");
const submitStatus = ref("");
const updated = useDataUpdated();

async function submitCase() {
  const res = await assignCase(caseId.value, props.nextUserId, props.groupId);
  message.value = res.message;
  submitStatus.value = res.status;
  if (submitStatus.value === "success") {
    // setTimeout(() => {
    //   window.location.reload();
    //   console.log("reloading window");
    // }, 1000);
    updated.value++;
  }
}
</script>
