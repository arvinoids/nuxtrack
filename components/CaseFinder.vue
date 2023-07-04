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
        <label for="finder" class="btn w-min self-center absolute right-3 top-3 btn-ghost hover:btn-error">✖</label>
        <input
            class="input mt-3 bg-neutral text-center w-[19rem]"
            type="search"
            v-model="caseId"
            placeholder="CAS-XXXXXXX-XXXXXX"
            id="caseInput"
          /><label for="caseInput" class='label'><span class="label-text-alt text-warning">Please note that search is case-sensitve and must be 18 characters or longer.</span></label>

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
          <p class="text-accent text-center" v-if="caseId.length>=18">
          <div v-if="loading">Looking for case...</div>
          <div v-else>Case not found</div>
          </p>
        </div>
      </label>
    </label>
  </div>
</template>

<script setup lang="ts">
const show = ref(false);
const caseFound = ref(false);
const caseId = ref("");
const loading = ref(true);

let caseData = ref();

watch(caseId, async (caseId) => {
  loading.value = true;
  if(caseId.length>=18) {
      caseData.value = await useFindCase(caseId.trim());
  }
  if (caseData.value.data !== null&&caseId.length>=18) {
     caseFound.value = true;
  }
  else caseFound.value = false;
  loading.value = false
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
