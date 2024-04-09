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

      <div v-if="firstUser" class="text-xs">
        User is
        <span class="text-xs text-neutral-500 capitalize">
          {{ firstUser.status }}
        </span>

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
        <a
          v-if="cursor !== 0"
          class="btn btn-outline btn-warning"
          @click="previousUser(userlist)"
          >Previous</a
        >
        <a class="btn btn-outline btn-secondary" @click="nextUser(userlist)">Skip</a>
        <a
          href="#"
          class="btn btn-primary"
          :class="{
            hidden: hideSubmit,
          }"
          @click="submitCase(caseId, firstUser.id, group)"
          >Assign</a
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
const originalList = [...props.users];
const firstUser = computed(() => {
  return userlist.value[0];
});

const emit = defineEmits(["shift", "reset", "update"]);
const loggedInUser = useLoggedInUsername();
let caseId = ref("");
let cursor = ref(0);
const message = ref("");
const forced = ref(false);
const currentUser = pb.authStore.model!.fullname;
const groupName: string = await useGetGroupName(props.group);

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

const invalidFormat = computed(() => {
  const pattern = /CAS-\d{7}-[A-Z]\d[A-Z]\d[A-Z]\d/;
  return !pattern.test(caseId.value.trim());
});

const caseIsBlank = computed(() => {
  return caseId.value === "";
});

const hideSubmit = ref(true);

watch([caseId, forced], async () => {
  message.value = "";
  if (caseIsBlank.value) {
    message.value = "Please enter a case ID.";
    hideSubmit.value = true;
  } else if (invalidFormat.value) {
    message.value = "Incorrect case ID format. Please recheck.";
    hideSubmit.value = true;
  } else if (await useCaseExists(caseId.value)) {
    message.value = "This case is already assigned. Please use search.";
    hideSubmit.value = true;
  } else if (firstUser.value.status !== "Available" && !forced.value) {
    hideSubmit.value = true;
  } else {
    hideSubmit.value = false;
  }
  console.log(
    caseIsBlank.value,
    invalidFormat.value,
    firstUser.value.status !== "Available" && !forced.value
  );
});

async function resetSelection() {
  userlist.value = [...originalList];
  await pb.collection("logs").create({
    user: pb.authStore.model!.username,
    type: "canceled assign",
    details: "Canceled assign case",
  });
  emit("reset");
  caseId.value = "";
  cursor.value = 0;
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
</script>

<style></style>
