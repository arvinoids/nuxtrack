<template>
    <div class="relative">
      <label
        class="flex items-center btn btn-ghost btn-circle btn-primary p-2"
        @click.stop="show = true"
        for="finder"
        title="Find a case"
      >
        <Icon name="ic:baseline-search" size="2rem" class="text-gray-200" />
      </label>
      <input type="checkbox" id="finder" class="modal-toggle" />
  
      <!-- Dialog -->
      <label for="finder" class="modal cursor-pointer">
        <label class="modal-box relative w-[22rem] flex flex-col gap-2">
          <h3 class="text-lg font-bold">Find a case</h3>
          <label for="finder" class="btn w-min self-center absolute right-3 top-3 btn-ghost hover:btn-error">✖</label>
          <input
              class="input mt-3 bg-base-200 text-center w-[19rem]"
              type="search"
              v-model="caseId"
              placeholder="CAS-XXXXXXX-XXXXXX"
              id="caseInput"
            /><div class="text-center alert alert-warning">
              Please note that search is case-sensitve and must be 18 characters or longer.              
            </div>
  
          <div v-if="caseFound">
          <div v-for="caseRecord in records.items">
            <CaseCard :case-record="caseRecord" class="py-2"/>
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
  
  let records = ref();
  
  watch(caseId, async (caseId) => {
    loading.value = true;
    if(caseId.length>=18) {
        records.value = await useFindCases(caseId.trim());
        console.log(records.value)
    }
    if (records.value.totalItems>0&&caseId.length>=18) {
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
  