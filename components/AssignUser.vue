<template>
  <div class="modal" id="assign">
    <div class="modal-box max-w-2xl text-center">
      <h3 class="font-bold text-lg">Assigning ticket to {{ user.fullname }}</h3>
      <p class="py-4">The ticket will be directly assigned to {{ user.username }}</p>

      <div class="form-control w-full flex flex-row gap-3 justify-center">
        <input
          type="text"
          placeholder="CAS-XXXXXXXXXXX"
          class="input input-bordered max-w-min"
          v-model="caseId"
        />
        <select class="select select-bordered max-w-min" v-model="group">
          <option v-for="group in userGroups" :key="group.id" :value="group.id">
            {{ group.description }}
          </option>
        </select>
      </div>
      <div
        v-if="message"
        class="alert alert-success my-2 w-max tex-center"
        :class="{ 'alert-error': submitStatus === 'failed' }"
      >
        {{ message }}
      </div>
      <div class="modal-action justify-center">
        <label class="btn btn-success" @click="doSubmit">Assign</label>
        <a href="#" class="btn btn-warning" @click="clearForm">Cancel</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  userId: string;
}>();

const origin = useFromGroup();
let caseId = useCaseId();
let group: string = origin.value;
let message = ref("");
const submitStatus = ref("");
const updated = useDataUpdated();

const pb = useNuxtApp().$pb;
const user = await pb.collection("users").getOne(props.userId);

//figure out the groups where this user belongs
const userGroupsRec = await pb
  .collection("users")
  .getOne(props.userId, { expand: `memberOf` });
const userGroups = userGroupsRec.expand.memberOf;
if (group === "") group = userGroups[0].id;

async function doSubmit() {
  console.log("submitting case with data: ", caseId.value, props.userId, group);
  const result = await useSubmitCase(caseId.value, props.userId, group);
  message.value = result.message;
  submitStatus.value = result.submitStatus;
  updated.value++;
}

async function clearForm() {
  message.value = "";
  caseId.value = "";
}
</script>
