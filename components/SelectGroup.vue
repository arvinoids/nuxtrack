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

const props = defineProps<{
  group: string;
  users: expandedUsers;
}>();
const emit = defineEmits(["skip"]);

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
}

async function skipCatch(user: user) {
  useShowToast(`${user.fullname} was skipped to catch up later.`, "success");
  emit("skip");
  moveCursor();
}

async function submitCase(caseId: string, id: string, group: string) {
  const res = await useSubmitCase(caseId, id, group);
  useShowToast(res.message, res.status);
  useDataUpdated().value++;
}
</script>

<style></style>
