<template>
  <div class="modal" :id="`${group}select`">
    <div class="modal-box">
      <h3 class="text-lg font">
        Assign case to
        <span class="text-accent">{{ selectedUser ? selectedUser.fullname : null }}</span>
      </h3>

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
          >Assign</a
        >
        <div class="btn btn-outline btn-secondary" @click="skipCatch(selectedUser)">
          Skip
        </div>
        <div
          v-if="reassignButton"
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
import { useUpdateUserLastAssigned } from "~/composables/userfunctions";
const pb = useNuxtApp().$pb;
let cursor = ref(0);

const props = defineProps<{
  group: string;
  users: user[];
}>();

let userlist = ref(props.users);
const selectedUser = computed(() => {
  return props.users[cursor.value];
});

// const emit = defineEmits(["shift", "reset", "update"]);
const loggedInUser = useLoggedInUsername();
let caseId = ref("");
const message = ref("");
const forced = ref(false);
const currentUser = pb.authStore.model!.fullname;
const groupName: string = await useGetGroupName(props.group);

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
  userlist.value = props.users;
  caseId.value = "";
  await pb.collection("logs").create({
    user: pb.authStore.model!.username,
    type: "canceled assign",
    details: "Canceled assign case",
  });
}

async function submitCase(caseId: string, userId: string, group: string) {
  const res: notification = await useSubmitCase(caseId, userId, group);
  const currentTime = useFormatDate(new Date(Date.now()));
  await useUpdateUserLastAssigned(userId);
  miniToast(res.status, res.message);
  // await resetSelection();
  useDataUpdated().value++;
  if (res.status === "success") {
    const user = await pb.collection("users").getOne(userId);
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
    details:
      `assigned ${caseId} to ` + (await useGetUsernameFromId(userId)).toUpperCase(),
  };
  logActivity(logData);
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

const emit = defineEmits(["skip"]);

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
</script>

<style></style>
