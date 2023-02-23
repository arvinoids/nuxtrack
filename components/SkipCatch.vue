<template>
  <div class="modal" :id="props.group">
    <div class="modal-box w-2/3 max-w-5xl">
      <h3 class="font-bold text-lg">Skipping {{ firstUser.expand.fullName }}</h3>
      <div class="flex flex-col items-center">
        <p class="py-4">The ticket will be assigned to {{ nextUser.expand.fullName }}</p>
        <input
          type="text"
          placeholder="CAS-XXXXXXXXXXX"
          class="input input-bordered my-2 w-[300px]"
          v-model="caseId"
        />
      </div>
      <div class="modal-action justify-center">
        <a @click="skipToNextUser" class="btn btn-outline">Skip - Catch up later</a>
        <a :href="'#' + skipAnchorOut" class="btn btn-outline">Skip - Out of office</a>
        <a href="#">
          <label class="btn btn-secondary" @click="submitCase">Assign</label></a
        >
        <a href="#" class="btn btn-warning">Cancel</a>
      </div>
    </div>
  </div>
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
const pb = useNuxtApp().$pb;
const props = defineProps<{
  users: any;
  group: string;
}>();
const position = ref(0);

let firstUser = props.users.items[position.value];
let nextUser = props.users.items[position.value + 1];

const caseId = useCaseId();
let str1 = props.group;
let str2 = props.nextUserId;
const skipAnchorCatch: string = str1!.concat(str2!, "Catch");
const skipAnchorOut: string = str1!.concat(str2!, "Out");
const submitStatus = ref("");
const updated = useDataUpdated();

async function submitCase() {
  const res = await assignCase(caseId.value, props.nextUserId, props.groupId);
  submitStatus.value = res.status;
  if (submitStatus.value === "success") {
    useShowToast(res.message, res.status);
    updated.value++;
  } else useShowToast(res.message, res.status);
}

async function skipToNextUser() {
  position.value = position.value++;
}

async function skipCatchUp() {}
</script>
