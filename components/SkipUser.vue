<template>
  <div class="modal" :id="group.id">
    <div class="modal-box w-2/3 max-w-5xl">
      <h3 class="font-bold text-lg">Skipping {{ firstUser.expand.fullName }}</h3>
      <div class="flex flex-col items-center">
        <p class="py-4">The ticket will be assigned to {{ nextUser.expand.fullName }}</p>
        <input
          type="text"
          placeholder="CAS-XXXXXXXXXXX"
          class="input input-bordered my-2 w-[300px]"
          v-model="caseId"
        />
      </div>
      <div class="modal-action justify-center">
        <a @click="skipToNextUser" class="btn btn-outline">Skip - Catch up later</a>
        <a :href="'#' + skipAnchorOut" class="btn btn-outline">Skip - Out of office</a>
        <a href="#">
          <label class="btn btn-secondary" @click="submitCase">Assign</label></a
        >
        <a href="#" class="btn btn-warning">Cancel</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ListResult, Record } from "pocketbase";

const props = defineProps<{
  users: ListResult;
  group: Record;
}>();

let caseId = useCaseId();

const position = ref(0);

let firstUser = props.users.items[position.value];
let nextUser = props.users.items[position.value + 1];

function skipToNextUser() {
  position.value++;
}
</script>

<style></style>
