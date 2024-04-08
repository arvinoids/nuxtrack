<template>
  <div class="modal" :id="`${group}select`">
    <div class="modal-box">
      <h3 class="text-lg font">
        Assign case to
        <span class="text-accent">{{ firstUser ? firstUser.fullname : null }}</span>
      </h3>

      <p class="py-4">
        <input
          type="text"
          placeholder="CAS-XXXXXXXXXXX"
          class="input input-bordered my-2 w-[300px]"
          v-model="caseId"
        />
      </p>

      <div v-if="firstUser">
        <div class="text-xs text-neutral-500 capitalize">
          {{ firstUser.status }}
        </div>
        <div
          class="flex flex-row justify-center items-center"
          v-if="firstUser.status !== 'Available'"
        >
          <input type="checkbox" v-model="forced" /><label class="text-xs mx-2"
            >Force assign</label
          >
        </div>
      </div>
      <div class="text-xs text-error pt-2">{{ message }}</div>

      <div class="modal-action justify-center">
        <a class="btn btn-outline btn-warning" @click="previousUser(userlist)"
          >Previous</a
        >
        <a class="btn btn-outline btn-secondary" @click="nextUser(userlist)">Skip</a>
        <a
          href="#"
          class="btn btn-primary"
          :class="{
            hidden:
              caseExists ||
              caseId === '' ||
              (firstUser.status !== 'Available' && !forced) ||
              invalidFormat === true,
          }"
          @click="submitCase(caseId, firstUser.id, group)"
          >Assign</a
        >
        <a
          href="#"
          class="btn btn-warning btn-primary"
          v-if="groupName !== 'l1_na'"
          :class="{
            hidden:
              !caseExists ||
              disableEscalate ||
              (firstUser.status !== 'Available' && !forced),
          }"
          @click="escalateCase(caseId, firstUser.id, group)"
          >Escalate</a
        >
        <a href="#" class="btn btn-outline btn-error" @click="resetSelection()">Cancel</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { user } from "pocketbase-types";
import type { LogData, notification, result } from "custom-types";
import { miniToast } from "../composables/viewhelpers";
const pb = useNuxtApp().$pb;

const props = defineProps<{
  group: string;
  users: user[];
}>();

let userlist = ref(props.users);
const firstUser = computed(() => {
  return userlist.value[0];
});

const emit = defineEmits(["shift", "reset", "update"]);
const loggedInUser = useLoggedInUsername();
let caseId = ref(useCaseId().value);
let cursor = ref(0);
const caseExists = ref(false);
const caseIsEscalated = ref(false);
const message = ref("");
const disableEscalate = ref(false);
const caseIsBlank = ref(false);
const forced = ref(false);
const currentUser = pb.authStore.model!.fullname;
const groupName: string = await useGetGroupName(props.group);
const invalidFormat = ref(false);

function nextUser(users: user[]) {
  let firstUser = users.shift();
  users.push(firstUser!);
  emit("shift", users);
  cursor.value++;
}

function previousUser(users: user[]) {
  let lastUser = users.pop();
  users.unshift(lastUser!);
  logActivity({
    user: loggedInUser.value,
    type: "skipped user",
    details: `${lastUser!.username} was moved to top.`,
  });
  emit("shift", users);
  cursor.value--;
}

async function submitCase(caseId: string, userId: string, group: string) {
  const res: notification = await useSubmitCase(caseId, userId, group);
  const currentTime = useFormatDate(new Date(Date.now()));
  miniToast(res.status, res.message);
  await resetSelection();
  useDataUpdated().value++;
  if (res.status === "success") {
    const user = await pb.collection("users").getOne(userId);
    emit("update");
    const email = {
      to: user.email,
      subject: "New case assigned to you",
      body: `Hi ${user.fullname}, \n\n${caseId} in ${groupName} has been assigned to you by ${currentUser} on ${currentTime}.\n\nRotation Tracker`,
    };
    const emailres: result = (await useSendEmail(email)) as result;
    miniToast(emailres.status, emailres.message);
  }
  const logData: LogData = {
    user: loggedInUser.value,
    type: "assigned case",
    details: `assigned ${caseId} to ` + (await useGetUsernameFromId(userId)),
  };

  logActivity(logData);
}

async function escalateCase(caseId: string, userId: string, group: string) {
  const res = await useEscalateCase(caseId, userId, group);
  miniToast(res.status, res.message);
  const currentTime = useFormatDate(new Date(Date.now()));
  // await resetSelection();

  useDataUpdated().value++;
  if (res.status === "success") {
    const user = await pb.collection("users").getOne(userId);
    emit("update");
    const email = {
      to: user.email,
      subject: "New case assigned to you",
      body: `Hi ${user.fullname}, \n\n${caseId} in ${groupName} has been assigned to you by ${currentUser} on ${currentTime}.\n\nRotation Tracker`,
    };
    const emailres: notification = (await useSendEmail(email)) as notification;
    miniToast(emailres.status, emailres.message);
  }
  const logData: LogData = {
    user: loggedInUser.value,
    type: "assigned case",
    details: `assigned ${caseId} to ` + (await useGetUsernameFromId(userId)),
  };
  const counter = await pb
    .collection("counter")
    .getFirstListItem(`user="${userId}"&&group="${group}`);
  logActivity(logData);
}

watch(caseId, async (caseId) => {
  caseId = caseId.trim();
  caseExists.value = await useCaseExists(caseId);
  caseIsEscalated.value = await useCaseIsEscalated(caseId);
  const pattern = /CAS-\d{7}-[A-Z]\d[A-Z]\d[A-Z]\d/;

  if (caseId.includes("escalated")) {
    message.value = "Remove -escalated operator.";
  } else {
    message.value = errorMessage(caseExists.value, caseIsEscalated.value, caseId);
  }
  if (caseId === "") {
    message.value = "Please enter a value.";
    caseIsBlank.value = true;
  }
  if (!pattern.test(caseId)) {
    message.value = "Incorrect case format.";
    invalidFormat.value = true;
  }
});

function errorMessage(caseExists: boolean, caseIsEscalated: boolean, caseId: string) {
  if (caseExists && caseIsEscalated) {
    disableEscalate.value = true;
    return "Already escalated. Please check case number.";
  }
  if (caseExists && !caseIsEscalated) {
    if (groupName === "l1_na") {
      return "This case is in the database. Please select an L3 group to escalate.";
    } else return "This case is in the database. Escalate to proceed.";
  }
  if (!caseExists) {
    invalidFormat.value = false;
    return "Assign case to proceed.";
  } else return "";
}

async function resetSelection() {
  await pb.collection("logs").create({
    user: pb.authStore.model!.username,
    type: "canceled assign",
    details: "Canceled assign case",
  });
  emit("reset");
  caseId.value = "";
}
</script>

<style></style>
