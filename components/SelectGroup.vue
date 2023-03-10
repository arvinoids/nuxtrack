<template>
  <div class="modal" :id="`${group}select`">
    <div class="modal-box">
      <h3 class="text-lg font">
        Assign case to
        <span class="text-accent">{{ firstUser.fullname }}</span>
      </h3>
      <p class="py-4">
        <input
          type="text"
          placeholder="CAS-XXXXXXXXXXX"
          class="input input-bordered my-2 w-[300px]"
          v-model="caseId"
        />
      </p>
      <div class="modal-action justify-center">
        <a class="btn btn-outline btn-secondary" @click="skipCatch(firstUser)"
          >Catch Up Later</a
        >
        <div>
          <a class="btn btn-outline btn-secondary" @click="skipOut(firstUser.id, group)"
            >Out of Office</a
          >
        </div>
        <a
          href="#"
          class="btn btn-primary"
          @click="submitCase(caseId, firstUser.id, group)"
          >Assign</a
        >
        <a href="#" class="btn btn-outline btn-error">Cancel</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { expandedUsers, user } from "pocketbase-types";
import { LogData } from "custom-types";

const props = defineProps<{
  group: string;
  users: expandedUsers;
}>();
const pb = useNuxtApp().$pb;
const emit = defineEmits(["skip"]);
const loggedInUser = useLoggedInUsername();

let caseId: string;
let cursor = ref(0);
let userlist = props.users.items;

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
  const logData: LogData = {
    user: loggedInUser.value,
    type: "skipped user",
    details: message,
  };
  logActivity(logData);
}

async function submitCase(caseId: string, id: string, group: string) {
  const res = await useSubmitCase(caseId, id, group);
  useShowToast(res.message, res.status);
  useDataUpdated().value++;
  const logData: LogData = {
    user: loggedInUser.value,
    type: "assigned case",
    details: `assigned ${caseId} to ` + (await useGetUsernameFromId(id)),
  };
  logActivity(logData);
}
</script>

<style></style>
