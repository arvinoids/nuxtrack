<template>
  <div class="modal" :id="`${group}select`">
    <div class="modal-box">
      <h3 class="text-lg font">
        Assign case to
        <span class="text-accent">{{ firstUser.fullname }}</span>
      </h3>
      <p class="py-4">
        <input type="text" placeholder="CAS-XXXXXXXXXXX" class="input input-bordered my-2 w-[300px]" v-model="caseId" />
      <div class="text-xs text-error">{{ message }}</div>
      </p>
      <div class="modal-action justify-center">
        <a class="btn btn-outline btn-secondary" @click="skipCatch(firstUser)">Catch Up Later</a>
        <div>
          <a class="btn btn-outline btn-secondary" @click="skipOut(firstUser.id, group)">Out of Office</a>
        </div>
        <a href="#" class="btn btn-primary" :class="{ hidden: caseExists || caseId === '' }"
          @click="submitCase(caseId, firstUser.id, group) ">Assign</a>
        <a href="#" class="btn btn-warning btn-primary" :class="{ hidden: !caseExists || disableEscalate }"
          @click="escalateCase(caseId, firstUser.id, group)">Escalate</a>
        <a href="#" class="btn btn-outline btn-error" @click="resetSelection">Cancel</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { expandedUsers, user } from "pocketbase-types";
import { LogData, result } from "custom-types";
const pb = useNuxtApp().$pb

const props = defineProps<{
  group: string;
  users: expandedUsers;
}>();

const emit = defineEmits(["skip", "reset"]);
const loggedInUser = useLoggedInUsername();
let caseId = ref(useCaseId().value);
let cursor = ref(0);
let userlist = props.users.items;
const caseExists = ref(false);
const caseIsEscalated = ref(false);
const message = ref("");
const disableEscalate = ref(false);
const caseIsBlank = ref(false)

const firstUser = ref(userlist[cursor.value].expand.user);

function moveCursor() {
  if (cursor.value === props.users.totalItems - 1) {
    cursor.value = 0;
  } else cursor.value++;
}

watch(cursor, () => {
  firstUser.value = userlist[cursor.value].expand.user;
});

async function skipOut(user: string, group: string) {
  const res = await useSkipOut(user, group);
  useShowToast(res.message, res.status);
  emit("skip");
  moveCursor();
  const logData: LogData = {
    user: loggedInUser.value,
    type: "skipped user",
    details: res.message,
  };
  logActivity(logData);
}

async function skipCatch(user: user) {
  const message = `${user.fullname} was skipped to catch up later.`;
  useShowToast(message, "success");
  emit("skip");
  moveCursor();
  console.log("cursor moved: ",cursor.value)
  const logData: LogData = {
    user: loggedInUser.value,
    type: "skipped user",
    details: message,
  };
  logActivity(logData);
}

async function submitCase(caseId: string, id: string, group: string) {
  const res = await useSubmitCase(caseId, id, group);
  const currentUser = pb.authStore.model!.fullname
  const currentTime = useFormatDate(new Date(Date.now()));
  useShowToast(res.message, res.status);
  await resetSelection();
  useDataUpdated().value++;
  if (res.status === 'success') {
    const user = (await pb.collection('users').getOne(id))
    const email = {
      to: user.email,
      subject: "New case assigned to you",
      body: `Hi ${user.fullname}, \n\n${caseId} has been assigned to you by ${currentUser} on ${currentTime}.\n\nRotation Tracker`
    }
    const emailres: result = (await useSendEmail(email)) as result
    useShowToast(emailres.message, emailres.status)
  }
  const logData: LogData = {
    user: loggedInUser.value,
    type: "assigned case",
    details: `assigned ${caseId} to ` + (await useGetUsernameFromId(id)),
  };
  logActivity(logData);
}

async function escalateCase(caseId: string, id: string, group: string) {
  const res = await useEscalateCase(caseId, id, group);
  useShowToast(res.message, res.status);
  resetSelection();
  useDataUpdated().value++;
  const logData: LogData = {
    user: loggedInUser.value,
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
  if (caseId.trim() === '') { message.value = 'Please enter a value.'; caseIsBlank.value = true }
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

async function resetSelection() {
  if(cursor.value>0){
    await pb.collection('logs').create({ user: pb.authStore.model!.username, type: 'canceled assign', details: "Canceled assign case" })
    useShowToast("Canceled assign after skips","warn")
  }
    emit('reset')
    caseId.value = "";
}
</script>

<style></style>
