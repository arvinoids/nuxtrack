<template>
  <!-- Put this part before </body> tag -->
  <input type="checkbox" :id="props.id + 'edit'" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box w-min max-w-5xl rounded-none">
      <h3 class="font-bold text-lg text-center">Edit case...</h3>
      <div class="flex gap-4 my-2">
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Case ID</span>
          </label>
          <input type="text" v-model="newCase" class="input input-bordered" />
        </div>
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Owner</span>
          </label>
          <select class="select select-bordered w-[30ch]" v-model="newUser">
            <option
              v-for="user in users"
              :key="user.expand.user.id"
              :value="user.expand.user.id"
            >
              {{ user.expand.user.fullname }}
            </option>
          </select>
        </div>
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Product Set</span>
          </label>
          <select class="select select-bordered" v-model="newGroup">
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
        <label :for="props.id + 'edit'" class="btn btn-warning" @click="doUpdate"
          >Update</label
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LogData } from "custom-types";
const loggedInUser = useLoggedInUsername();
const pb = useNuxtApp().$pb;
pb.autoCancellation(false);
const props = defineProps<{
  id: string;
  caseId: string;
  owner: string;
  product: string;
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
  const res = await useUpdateCase(
    props.id,
    newUser.value,
    newGroup.value,
    newCase,
    pb.authStore.model!.username
  );
  updated.value++;
  useShowToast(res.message, res.status);
  const logData: LogData = {
    user: loggedInUser.value,
    type: "updated case",
    details: res.message,
  };
  logActivity(logData);
}
</script>
