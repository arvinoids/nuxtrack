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
        <div class="border my-2 py-2 px-3 text-sm text-warning" v-if="message">
          <p>{{ message }}</p>
        </div>

        <div class="modal-action">
          <a
            href="#"
            class="btn btn-primary"
            :class="{ hidden: caseExists || caseId === '' }"
            @click="submitCase(caseId, user.id, selectedGroupId)"
            >Assign</a
          >
          <a
            href="#"
            class="btn btn-warning btn-primary"
            :class="{ hidden: !caseExists || disableEscalate }"
            @click="escalateCase(caseId, user.id, selectedGroupId)"
            >Escalate</a
          >
          <label for="assignToSelf" class="btn btn-outline btn-warning">Cancel</label>
        </div>
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { Record } from "pocketbase";
import { LogData } from "custom-types";
const pb = useNuxtApp().$pb;
const caseId = ref("");
const message = ref("");
const currentUser = pb.authStore.model!;

const user = await pb.collection("users").getOne(currentUser.id, { expand: "memberOf" });
const groups = user.expand.memberOf as Record[];
const selectedGroupId = ref(groups[0].id);
const caseExists = ref(false);
const caseIsEscalated = ref(false);
const caseIsBlank = ref(false);
const disableEscalate = ref(false);

async function doAssign() {
  useAssignCase(caseId.value, user.id, selectedGroupId.value);
}

async function submitCase(caseId: string, userId: string, group: string) {
  const groupName = useGetGroupName(group);
  const res = await useSubmitCase(caseId, userId, group);
  const currentTime = useFormatDate(new Date(Date.now()));
  useShowToast(res.message, res.status);
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
    useShowToast(emailres.message, emailres.status);
  }
  const logData: LogData = {
    user: currentUser!.username,
    type: "assigned case",
    details: `assigned ${caseId} to ` + (await useGetUsernameFromId(userId)),
  };
  logActivity(logData);
}

async function escalateCase(caseId: string, id: string, group: string) {
  const groupName = useGetGroupName(group);
  const res = await useEscalateCase(caseId, id, group);
  useShowToast(res.message, res.status);
  const currentTime = useFormatDate(new Date(Date.now()));
  useDataUpdated().value++;
  if (res.status === "success") {
    const user = await pb.collection("users").getOne(id);
    const email = {
      to: user.email,
      subject: "New case assigned to you",
      body: `Hi ${user.fullname}, \n\n${caseId} in ${groupName} has been assigned to you by ${currentUser} on ${currentTime}.\n\nRotation Tracker`,
    };
    const emailres = await useSendEmail(email);
    useShowToast(emailres.message, emailres.status);
  }
  const logData: LogData = {
    user: currentUser!.username,
    type: "assigned case",
    details: `assigned ${caseId} to ` + (await useGetUsernameFromId(id)),
  };
  logActivity(logData);
}

watch(caseId, async (caseId) => {
  caseExists.value = await useCaseExists(caseId.trim());
  caseIsEscalated.value = await useCaseIsEscalated(caseId.trim());
  if (caseId.trim().includes("escalated")) {
    message.value = "Remove -escalated operator.";
  } else {
    message.value = errorMessage(caseExists.value, caseIsEscalated.value, caseId);
  }
  if (caseId.trim() === "") {
    message.value = "Please enter a value.";
    caseIsBlank.value = true;
  }
});

function errorMessage(caseExists: boolean, caseIsEscalated: boolean, caseId: string) {
  if (caseExists && caseIsEscalated) {
    disableEscalate.value = true;
    return "Already escalated. Please check case number.";
  }
  if (caseExists && !caseIsEscalated)
    return "This case is in the database. Escalate to continue.";
  if (!caseExists) return "Assign case to proceed.";
  else return "";
}
</script>

<style></style>
