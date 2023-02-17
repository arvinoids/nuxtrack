<template>
  <div class="modal" :id="props.id">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Skip - Out of office</h3>
      <p class="py-4">You are skipping {{ props.fullName }}. Click OK to continue.</p>
      <div class="modal-action">
        <a href="#" :for="props.id" class="btn btn-outline btn-warning">Cancel</a>
        <a href="#" :for="props.id" class="btn" @click="skipOut()">OK</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  fullName: String,
  userId: String,
  id: String,
  groupId: String,
});

const updated = useDataUpdated();

async function skipOut() {
  const res = await useSkipOut(props.userId!, props.groupId!);
  console.log(res);
  useShowToast(res.message, res.status);
  updated.value++;
}
</script>
