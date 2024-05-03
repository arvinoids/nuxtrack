<template>
  <span>
    <label for="assignToSelf" class="cursor-pointer hover:font-bold text-accent"
      ><slot
    /></label>
    <input type="checkbox" id="assignToSelf" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box w-min max-w-5xl rounded-none">
        <h3 class="font-bold text-lg text-center">Assign case to myself</h3>
        <div class="flex gap-4 my-2">
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Case ID</span>
            </label>
            <input type="text" v-model="caseId" class="input input-bordered input-sm" />
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Product Set</span>
            </label>
            <select class="select select-bordered select-sm" v-model="selectedGroupId">
              <option v-for="group in groups" :key="group.id" :value="group.id">
                {{ group.description }}
              </option>
            </select>
          </div>
        </div>
        <div class="border my-2 py-2 px-3 text-sm text-error" v-if="message">
          <p>{{ message }}</p>
        </div>

        <div class="modal-action">
          <label
            for="assignToSelf"
            class="btn btn-primary"
            :class="{ hidden: hideSubmit }"
            @click="submitCase(caseId, user.id, selectedGroupId)"
            >Assign</label
          >
          <label for="assignToSelf" class="btn btn-outline btn-warning">Cancel</label>
        </div>
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
import type { LogData } from "custom-types";
const pb = useNuxtApp().$pb;
const caseId = ref("");
const message = ref("");
const currentUser = pb.authStore.model!;

const user = await pb.collection("users").getOne(currentUser.id, { expand: "memberOf" });
const groups = user.expand!.memberOf;
const selectedGroupId = ref(groups[0].id);
const caseIsBlank = ref(false);
const disableEscalate = ref(false);
const hideSubmit = ref(true);
const invalidFormat = computed(() => {
  const pattern = /CAS-\d{7}-[A-Z]\d[A-Z]\d[A-Z]\d/;
  return !pattern.test(caseId.value.trim());
});

async function submitCase(caseId: string, userId: string, group: string) {
  const groupName = await useGetGroupName(group);
  const res = await useSubmitCase(caseId, userId, group);
  const currentTime = useFormatDate(new Date(Date.now()));
  await useUpdateUserLastAssigned(userId);
  miniToast(res.status, res.message);
  useDataUpdated().value++;
  if (res.status === "success") {
    const user = await pb.collection("users").getOne(userId);
    const email = {
      to: user.email,
      subject: "New case assigned to you",
      body: `Hi ${
        user.fullname
      }, \n\n${caseId} in ${groupName} has been assigned to you by ${
        currentUser!.fullname
      } on ${currentTime}.\n\nRotation Tracker`,
    };
    const emailres = await useSendEmail(email);
    miniToast(emailres.status, emailres.message);
  }
  const logData: LogData = {
    user: currentUser!.username,
    type: "assigned case",
    details: `${caseId} to ` + (await useGetUsernameFromId(userId)),
  };
  logActivity(logData);
}

watch(caseId, async (caseId) => {
  message.value = "";
  if (caseIsBlank.value) {
    message.value = "Please enter a case ID.";
    hideSubmit.value = true;
  } else if (invalidFormat.value) {
    message.value = "Incorrect case ID format. Please recheck.";
    hideSubmit.value = true;
  } else if (await useCaseExists(caseId.trim())) {
    message.value = "This case is already assigned. Please use search.";
    hideSubmit.value = true;
  } else {
    hideSubmit.value = false;
  }
});

function errorMessage(caseExists: boolean, caseIsEscalated: boolean, caseId: string) {
  if (caseExists && caseIsEscalated) {
    disableEscalate.value = true;
    return "Already escalated. Please check case number.";
  }
  if (caseExists && !caseIsEscalated)
    return "This case is already assigned. Please use search.";
  if (!caseExists) return "Assign case to proceed.";
  else return "";
}
</script>

<style></style>
