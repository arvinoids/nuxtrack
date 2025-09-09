<template>
  <!-- Put this part before </body> tag -->
  <input type="checkbox" :id="props.id + 'edit'" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box w-[400px]">
      <h3 class="font-bold text-lg text-center">Edit case...</h3>
      <div class="flex flex-col gap-3 my-2">
        <div class="flex items-center gap-2 justify-between">
          <label class="label">
            <span class="label-text">Case ID</span>
          </label>
          <input
            type="text"
            v-model="newCase"
            class="input input-bordered w-[205h]"
            :disabled="caseEditDisabled"
          />
        </div>
        <div class="flex gap-2 justify-between">
          <label class="label">
            <span class="label-text">Owner</span>
          </label>
          <select
            class="select select-bordered w-[25ch] justify-self-end"
            v-model="newUser"
          >
            <option
              v-for="user in users"
              :key="user.expand.user.id"
              :value="user.expand.user.id"
            >
              {{ user.expand.user.fullname }}
            </option>
          </select>
        </div>
        <div class="flex gap-2 justify-between">
          <label class="label">
            <span class="label-text">Product Set</span>
          </label>
          <select class="select select-bordered w-[25ch]" v-model="newGroup">
            <option v-for="group in groups" :key="group.id" :value="group.id">
              {{ group.description }}
            </option>
          </select>
        </div>
      </div>
      <div class="alert alert-success" v-if="message">
        <p>{{ message }}</p>
      </div>

      <div class="modal-action">
        <label :for="props.id + 'edit'" class="btn">Cancel</label>
        <label :for="props.id + 'edit'" class="btn btn-primary" @click="doUpdate"
          >Update</label
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LogData } from "custom-types";
import { useSendUnassignNotification } from "~/composables/generics";
const loggedInUser = useCurrentUser();
const pb = useNuxtApp().$pb;
pb.autoCancellation(false);
const props = defineProps<{
  id: string;
  caseId: string;
  owner: string;
  product: string;
  caseEditDisabled?: boolean;
}>();

let newUser = ref(props.owner);
let newCase: string = props.caseId;
let newGroup = ref(props.product);

async function getUsers(group: string) {
  const res = (await useGetSortedUsers(group)).items;
  return res;
}

const users = ref(await getUsers(props.product));

const productSets = await pb.collection("groups").getList(1, 100);
const groups = ref(productSets.items);

watch(newGroup, async () => {
  users.value = await getUsers(newGroup.value);
  newUser.value = users.value[0].expand.user.id;
});

const message = ref("");
const updated = useDataUpdated();

async function doUpdate() {
  const oldRecord = await useGetCaseRecordById(props.caseId);
  const oldUser = props.owner;
  const res = await useUpdateCase(
    props.id,
    newUser.value,
    newGroup.value,
    newCase,
    pb.authStore.model!.username
  );
  if (oldUser !== newUser.value) {
    const newRecord = await useGetCaseRecordById(props.caseId);
    await useSendUnassignNotification(oldRecord);
    await useSendAssignNotification(newRecord);
  }
  updated.value++;
  useShowToast(res.message, res.status);
  const logData: LogData = {
    user: loggedInUser.value?.username,
    type: "updated case",
    details: res.message,
  };
  logActivity(logData);
}
</script>
