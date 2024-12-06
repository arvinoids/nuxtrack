<template>
  <div class="modal" :id="`${group}select`">
    <div class="modal-box">
      <h3 class="text-lg font">
        Assign case to
        <span class="text-accent">{{ selectedUser.fullname }}</span>
      </h3>
      <div
        v-if="!userIsTop"
        class="text-sm text-warning flex items-center justify-center gap-3"
        title="Activate this to assign a case to you in advance"
      >
        <input type="checkbox" class="toggle toggle-sm" v-model="assignToSelf" /><label
          for="assignToSelf"
          >Advance assign to self</label
        >
      </div>

      <p class="py-4">
        <input
          type="text"
          placeholder="CAS-XXXXXXX-XXXXXX"
          class="input input-bordered my-2 w-[300px]"
          v-model="caseId"
        />
      </p>

      <div v-if="selectedUser" class="text-xs">
        User is
        <span class="text-xs text-neutral-500 capitalize">
          {{ selectedUser.status }}
        </span>

        <div
          class="flex flex-row justify-center items-center"
          v-if="selectedUser.status !== 'Available'"
        >
          <input type="checkbox" v-model="forced" /><label class="text-xs mx-2"
            >Force assign</label
          >
        </div>
      </div>
      <div class="text-xs text-error pt-2">{{ message }}</div>

      <div class="modal-action justify-center">
        <a
          href="#"
          class="btn btn-primary"
          :class="{
            hidden: hideSubmit,
          }"
          @click="submitCase(caseId, selectedUser.id, group)"
          v-if="!assignToSelf"
          >Assign</a
        >
        <a
          href="#"
          v-if="assignToSelf"
          class="btn btn-primary"
          :class="{
            hidden: hideSubmit,
          }"
          @click="advanceAssign(caseId, group)"
          >Advance Assign</a
        >
        <div
          class="btn btn-outline btn-secondary"
          @click="skipCatch(selectedUser)"
          v-if="!assignToSelf"
        >
          Skip
        </div>
        <div
          v-if="reassignButton && !assignToSelf"
          class="btn btn-outline btn-warning"
          @click="reassignCase(caseId, selectedUser.id)"
        >
          Reassign
        </div>
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
let cursor = ref(0);
const assignToSelf = ref(false);

const props = defineProps<{
  group: string;
  users: user[];
}>();

const selectedUser = computed(() => {
  if (assignToSelf.value && pb.authStore.model) {
    return pb.authStore.model as user;
  }
  return props.users[cursor.value];
});

const loggedInUser = useLoggedInUsername();
let caseId = ref("");
const message = ref("");
const forced = ref(false);
const currentUser = pb.authStore.model!.fullname;
const groupName: string = await useGetGroupName(props.group);
const advancedCases = useAdvancedCasesStore();

const userIsTop = computed(() => {
  return loggedInUser.value === props.users[0].username;
});

const invalidFormat = computed(() => {
  const pattern = /CAS-\d{7}-[A-Z]\d[A-Z]\d[A-Z]\d/;
  return !pattern.test(caseId.value.trim());
});

const caseIsBlank = computed(() => {
  return caseId.value.trim() === "";
});

const hideSubmit = ref(true);
const reassignButton = computed(() => {
  return message.value === "This case is already assigned. Reassign or use Search.";
});

watch([caseId, forced, cursor], async () => {
  message.value = "";
  if (caseIsBlank.value) {
    message.value = "Please enter a case ID.";
    hideSubmit.value = true;
  } else if (invalidFormat.value) {
    message.value = "Incorrect case ID format. Please recheck.";
    hideSubmit.value = true;
  } else if (await useCaseExists(caseId.value.trim())) {
    message.value = "This case is already assigned. Reassign or use Search.";
    hideSubmit.value = true;
  } else if (selectedUser.value.status !== "Available" && !forced.value) {
    hideSubmit.value = true;
  } else {
    hideSubmit.value = false;
  }
});

async function resetSelection() {
  cursor.value = 0;
  caseId.value = "";
  assignToSelf.value = false;
  await pb.collection("logs").create({
    user: pb.authStore.model!.username,
    type: "canceled assign",
    details: "Canceled assign case",
  });
}

async function submitCase(newCaseId: string, userId: string, group: string) {
  const res: notification = await useSubmitCase(newCaseId, userId, group);
  const currentTime = useFormatDate(new Date(Date.now()));
  await useUpdateUserLastAssigned(userId);
  miniToast(res.status, res.message);
  // await resetSelection();
  // useDataUpdated().value++;
  if (res.status === "success") {
    const user = await pb.collection("users").getOne(userId);
    const email = {
      to: user.email,
      subject: "New case assigned to you",
      body: `Hi ${user.fullname}, \n\n${newCaseId} in ${groupName} has been assigned to you by ${currentUser} on ${currentTime}.\n\nRotation Tracker`,
    };
    const emailres: result = (await useSendEmail(email)) as result;
    miniToast(emailres.status, emailres.message);
  }
  const logData: LogData = {
    user: loggedInUser.value,
    type: "assigned case",
    details: `${newCaseId} to ` + (await useGetUsernameFromId(userId)).toUpperCase(),
  };
  logActivity(logData);
  emit("assign");
  caseId.value = "";
  assignToSelf.value = false;
}

async function reassignCase(caseId: string, newOwnerId: string) {
  const currentTime = useFormatDate(new Date(Date.now()));
  try {
    const res = await useReassignCase(caseId, newOwnerId);
    miniToast(res.status, res.message);
    await useUpdateUserLastAssigned(newOwnerId);
    if (res.status === "success") {
      const user = await pb.collection("users").getOne(newOwnerId);
      const email = {
        to: user.email,
        subject: "New case assigned to you",
        body: `Hi ${user.fullname}, \n\n${caseId} in ${groupName} has been reassigned to you by ${currentUser} on ${currentTime}.\n\nRotation Tracker`,
      };
      const emailres: result = (await useSendEmail(email)) as result;
      miniToast(emailres.status, emailres.message);
      const logData: LogData = {
        user: loggedInUser.value,
        type: "assigned case",
        details:
          `reassigned ${caseId} to ` +
          (await useGetUsernameFromId(newOwnerId)).toUpperCase(),
      };
      logActivity(logData);
    }
  } catch (e: any) {
    miniToast("failed", "Reassign has failed");
  }
}

const emit = defineEmits(["skip", "assign"]);

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

function moveCursor() {
  if (cursor.value === props.users.length - 1) {
    cursor.value = 0;
  } else cursor.value++;
}

async function advanceAssign(newCaseId: string, groupId: string) {
  const res: notification = await useAdvanceAssign(
    newCaseId,
    selectedUser.value.id,
    groupId
  );
  miniToast(res.status, res.message);
  if (res.status === "success") {
    const user = selectedUser.value;
    const email = {
      to: user.email,
      subject: "New advanced case assigned to you",
      body: `Hi ${user.fullname},\nYou have assigned in advance ${newCaseId} in ${groupName} to yourself.\n\nRotation Tracker`,
    };
    const emailres: result = (await useSendEmail(email)) as result;
    miniToast(emailres.status, emailres.message);
    advancedCases.value = await useGetAdvancedCases();
  }
  caseId.value = "";
  assignToSelf.value = false;
  const logData: LogData = {
    user: loggedInUser.value,
    type: "advance assigned case",
    details: `${newCaseId} to self`,
  };
  logActivity(logData);
}
</script>
