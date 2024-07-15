<template>
  <div class="w-full">
    <div class="border flex flex-col gap-2 shadow pb-2 mb-1">
      <div
        class="px-3 py-2 text-lg font-normal bg-neutral bg-opacity-30 w-full border-b-2 border-primary"
      >
        Notes
      </div>
      <div class="py-1 px-1">
        <textarea rows="" cols="" class="w-full md:h-[60ch] textarea" v-model="content">{{
          content
        }}</textarea>
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
  try {
    await pb.collection("others").update(rec.id, { value: content.value });
    const logData: LogData = {
      user: currentUser!.username,
      type: "changed note",
      details: "current note: " + content.value,
    };
    logActivity(logData);
    miniToast("success", "Note has been updated");
  } catch (e: any) {
    miniToast("failed", e.message);
  }
}
</script>

<style></style>
