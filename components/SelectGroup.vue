<template>
  <div class="modal" :id="`${group}select`">
    <div class="modal-box">
      <h3 class="text-lg font">
        Assign case to
        <span class="text-accent">{{ taggedUser.fullname }}</span>
      </h3>
      <p class="text-sm">Status: <span class="font-semibold" :class="{ [`text-${getColor(taggedUser.status)}`]: true }">{{
        taggedUser.status }}</span></p>
      <p class="py-4">
        <input type="text" placeholder="CAS-XXXXXXXXXXX" class="input input-bordered my-2 w-[300px]" v-model="caseId" />
      <div class="flex flex-row justify-center items-center" v-if="taggedUser.status !== 'Available'"><input type="checkbox"
          v-model="forced" /><label class="text-xs mx-2">Force assign</label></div>
      <div class="text-xs text-error pt-2">{{ message }}</div>
      </p>
      <div class="modal-action justify-center">
        <a class="btn btn-outline btn-secondary" @click="skipCatch(taggedUser)">Skip</a>
        <!-- <div>
          <a class="btn btn-outline btn-secondary"  @click="skipOut(taggedUser.id, group)">Out of Office</a>
        </div> -->
        <a href="#" class="btn btn-primary"
          :class="{ hidden: (caseExists || caseId === '') || ((taggedUser.status !== 'Available') && !forced) }"
          @click="submitCase(caseId, taggedUser.id, group)">Assign</a>
        <a href="#" class="btn btn-warning btn-primary" v-if="groupName!=='l1_na'"
          :class="{ hidden: (!caseExists || disableEscalate) || ((taggedUser.status !== 'Available') && !forced) }"
          @click="escalateCase(caseId, taggedUser.id, group)">Escalate</a>
        <a href="#" class="btn btn-outline btn-error" @click=" resetSelection(); showCanceledToast();">Cancel</a>
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
const caseExists = ref(false);
const caseIsEscalated = ref(false);
const message = ref("");
const disableEscalate = ref(false);
const caseIsBlank = ref(false)
const forced = ref(false)
const currentUser = pb.authStore.model!.fullname
const groupName:string = await useGetGroupName(props.group)


let userlist = ref(await useGetSortedUsers(props.group))

//const taggedUser = ref(userlist.value.items[cursor.value].expand.user as user);
pb.collection('users').subscribe('*', async () => {
  userlist.value = await useGetSortedUsers(props.group)
})

const taggedUser = computed(() => {
  return userlist.value.items[cursor.value].expand.user
})

function moveCursor() {
  if (cursor.value === props.users.totalItems - 1) {
    cursor.value = 0;
  } else cursor.value++;
}

async function skipCatch(user: user) {
  const message = `${user.fullname} was skipped.`;
  // useShowToast(message, "success");
  emit("skip");
  moveCursor();
  const logData: LogData = {
    user: loggedInUser.value,
    type: "skipped user",
    details: message,
  };
  logActivity(logData);
}

async function submitCase(caseId: string, userId: string, group: string) {
  const res = await useSubmitCase(caseId, userId, group);
  const currentTime = useFormatDate(new Date(Date.now()));
  useShowToast(res.message, res.status);
  await resetSelection();
  useDataUpdated().value++;
  if (res.status === 'success') {
    const user = (await pb.collection('users').getOne(userId))
    const email = {
      to: user.email,
      subject: "New case assigned to you",
      body: `Hi ${user.fullname}, \n\n${caseId} in ${groupName} has been assigned to you by ${currentUser} on ${currentTime}.\n\nRotation Tracker`
    }
    const emailres: result = (await useSendEmail(email)) as result
    useShowToast(emailres.message, emailres.status)
  }
  const logData: LogData = {
    user: loggedInUser.value,
    type: "assigned case",
    details: `assigned ${caseId} to ` + (await useGetUsernameFromId(userId)),
  };
  logActivity(logData);
}

async function escalateCase(caseId: string, id: string, group: string) {
  const res = await useEscalateCase(caseId, id, group);
  useShowToast(res.message, res.status);
  const currentTime = useFormatDate(new Date(Date.now()));
  await resetSelection();
  useDataUpdated().value++;
  if (res.status === 'success') {
    const user = (await pb.collection('users').getOne(id))
    const email = {
      to: user.email,
      subject: "New case assigned to you",
      body: `Hi ${user.fullname}, \n\n${caseId} in ${groupName} has been assigned to you by ${currentUser} on ${currentTime}.\n\nRotation Tracker`
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

watch(caseId, async (caseId) => {
  caseId=caseId.trim()
  caseExists.value = await useCaseExists(caseId);
  caseIsEscalated.value = await useCaseIsEscalated(caseId);
  if (caseId.includes("escalated")) {
    message.value = "Remove -escalated operator.";
  } else {
    message.value = errorMessage(caseExists.value, caseIsEscalated.value, caseId);
  }
  if (caseId === '') { message.value = 'Please enter a value.'; caseIsBlank.value = true }
});

function errorMessage(caseExists: boolean, caseIsEscalated: boolean, caseId: string) {
  if (caseExists && caseIsEscalated) {
    disableEscalate.value = true;
    return "Already escalated. Please check case number.";
  }
  if (caseExists && !caseIsEscalated) {
    if (groupName === 'l1_na') { return "This case is in the database. Please select an L3 group to escalate." }
    else return "This case is in the database. Escalate to proceed."
  };
  if (!caseExists) return "Assign case to proceed.";
  else return "";
}

async function resetSelection() {
  if (cursor.value > 0) {
    await pb.collection('logs').create({ user: pb.authStore.model!.username, type: 'canceled assign', details: "Canceled assign case" })
  }
  emit('reset')
  caseId.value = "";
}

async function showCanceledToast() {
  if (cursor.value > 0)
    useShowToast("Canceled assign after skips", "warn")
  cursor.value = 0
}

pb.collection('users').subscribe('*', async () => {
  userlist.value = await useGetSortedUsers(props.group)
})

</script>

<style></style>
