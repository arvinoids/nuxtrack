<template>
  <div class="w-full">
    <div class="border flex flex-col gap-2 shadow pb-2 mb-1">
      <div
        class="px-3 py-2 text-lg font-normal bg-neutral bg-opacity-30 w-full border-b-2 border-primary"
      >
        Advance Assign Cases
      </div>
      <div class="px-2">
        <div v-if="advancedExist">
          <ul v-for="user in users.items" :key="user.id" ref="cases">
            <div class="p-3 my-1 shadow rounded border" v-if="userCases(user.id).length">
              <div class="font-bold mb-1">{{ user.username.toUpperCase() }}</div>
              <div v-for="caseItem in userCases(user.id)">
                <div>{{ caseItem.caseId }}</div>
              </div>
            </div>
          </ul>
        </div>
        <div v-else class="text-center">None for now</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
const users = await useGetAllUsers();
const advancedCases = useAdvancedCasesStore();
function userCases(userId: string) {
  const cases = advancedCases.value.filter((item) => item.user === userId);
  return cases;
}

const advancedExist = computed(() => {
  return advancedCases.value.length > 0;
});

pb.collection("unassigned_cases").subscribe("*", async () => {
  advancedCases.value = await useGetAdvancedCases();
});
</script>

<style></style>
