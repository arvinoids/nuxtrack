<template>
  <!-- Put this part before </body> tag -->
  <input type="checkbox" :id="props.id + 'del'" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box w-min max-w-5xl">
      <h3 class="font-bold text-lg">Deleting case...</h3>
      <!-- <p class="py-4"> {{ message }}</p> -->
      <p>Are you sure you want to delete this case?</p>

      <p>{{ caseId }} under {{ user }}</p>
      <div class="modal-action">
        <label :for="props.id + 'del'" class="btn">Cancel</label>
        <label
          :for="props.id + 'del'"
          class="btn btn-warning"
          @click="deleteCase(props.id)"
          >Yes</label
        >
      </div>
    </div>
  </div>
  <input type="checkbox" id="deleted" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box w-min">
      <p>{{ message }}</p>
      <div class="modal-action">
        <label for="deleted" class="btn">OK</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string;
  caseId: string;
  caseOwner: string;
}>();
const user = props.caseOwner;
const caseId = props.caseId;
const message = ref("");
const update = useDataUpdated();
async function deleteCase(id: string) {
  const res = await useDeleteCase(id);
  update.value++;
  message.value = res.message;
}
</script>

<style></style>
