<template>
  <div class="w-full">
    <div class="border flex flex-col gap-2 shadow pb-2 mb-1">
      <div
        class="px-3 py-2 text-lg font-normal bg-neutral bg-opacity-30 w-full border-b-2 border-primary"
      >
        Notes
      </div>
      <div class="py-2 px-5">
        <textarea rows="" cols="" v-model="content">{{ content }}</textarea>
        <div class="w-full flex justify-end">
          <button class="btn btn-secondary btn-sm" @click="updateNotes()">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
import type { LogData } from "custom-types";
const currentUser = useCurrentUser();

const contentRec = ref(await pb.collection("others").getFirstListItem('item="note"'));
const content = ref(contentRec.value.value);

async function updateNotes() {
  const rec = await pb.collection("others").getFirstListItem('item="note"');
  await pb.collection("others").update(rec.id, { value: content.value });
  const logData: LogData = {
    user: currentUser!.username,
    type: "changed note",
    details: "current note: " + content.value,
  };
  logActivity(logData);
}
</script>

<style></style>
