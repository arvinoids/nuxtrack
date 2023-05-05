<template>
  <div class="relative">
    <label
      class="flex items-center btn btn-ghost btn-circle p-2"
      @click.stop="show = true"
      for="finder"
    >
      <Icon name="ic:baseline-search" size="1.8rem" class="text-gray-200" />
    </label>
    <input type="checkbox" id="finder" class="modal-toggle" />

    <!-- Dialog -->
    <label for="finder" class="modal cursor-pointer">
      <label class="modal-box relative w-[22rem] flex flex-col gap-2" for="">
        <h3 class="text-lg font-bold">Find a case</h3>
        <label for="caseId"
          ><input
            class="input my-3 bg-neutral text-center w-[19rem]"
            type="text"
            v-model="caseId"
            placeholder="Enter CAS here"
          />
        </label>

        <div v-if="caseFound">
          <div class="text-sm">
            <p>
              <span class="font-semibold">Case ID: </span
              ><span class="text-secondary">{{ caseData.data.case }}</span>
            </p>
            <p>
              <span class="font-semibold">Owner:</span>
              {{ caseData.data.expand.user.fullname }}
            </p>
            <p>
              <span class="font-semibold">Group:</span>
              {{ caseData.data.expand.group.description }}
            </p>
            <p>
              <span class="font-semibold">Date assigned:</span>
              {{ useFormatDate(caseData.data.created) }}
            </p>
            <p>
              <span class="font-semibold">Assigned by:</span>
              {{ caseData.data.assignedBy.toUpperCase() }}
            </p>
            <div class="border p-3 text-sm my-3">
              To escalate the case, close this window and select a group in the homepage.
            </div>
          </div>
        </div>
        <div v-else>
          <p class="text-accent text-center" v-if="caseId">Case not found</p>
        </div>
        <label for="finder" class="btn btn-sm w-min self-center text-sm">Close</label>
      </label>
    </label>
  </div>
</template>

<script setup lang="ts">
const escPressed = ref(false);
const show = ref(false);
const caseFound = ref(false);
const caseId = ref("");

let caseData = ref();

watch(caseId, async (caseId) => {
  caseData.value = await useFindCase(caseId);
  if (caseData.value.data !== null) caseFound.value = true;
  else caseFound.value = false;
  if (caseId === "") caseFound.value = false;
});
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.modal-box {
  position: fixed;
  top: 5rem;
}
</style>
