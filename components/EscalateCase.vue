<template>
  <div>
    <input type="checkbox" :id="caseId + 'escalate'" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box w-[400px]">
        <h3 class="font-bold text-lg text-center">Escalate Case</h3>
        <div class="flex flex-col gap-3 my-2">
          <div class="flex items-center gap-2 justify-between">
            <label class="label">
              <span class="label-text text-sm">Case ID</span>
            </label>
            <div class="text-accent text-sm">{{ caseId }}</div>
          </div>
          <div class="flex gap-2 justify-between">
            <label class="label">
              <span class="label-text text-sm">Product Set</span>
            </label>
            <select class="select select-bordered w-[25ch]" v-model="selectedGroup">
              <option v-for="group in groups.items" :key="group.id" :value="group.id">
                {{ group.description }}
              </option>
            </select>
          </div>
          <div class="flex gap-2 justify-between">
            <label class="label">
              <span class="label-text text-sm">Owner</span>
            </label>
            <select
              class="select select-bordered w-[25ch] justify-self-end"
              v-model="selectedUser"
            >
              <option
                v-for="user in displayUsers"
                :key="user.expand.user.id"
                :value="user.expand.user.id"
              >
                {{ user.expand.user.fullname }}
              </option>
            </select>
          </div>
        </div>

        <div class="modal-action">
          <label
            :for="caseId + 'escalate'"
            class="btn"
            @click="
              selectedGroup = groups.items[0].id;
              selectedUser = displayUsers[0]?.expand.user.id;
            "
            >Cancel</label
          >
          <label
            :for="caseId + 'escalate'"
            class="btn btn-primary"
            @click="doEscalate"
            :disabled="!selectedUser || !selectedGroup"
          >
            Escalate</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const groups = await useGetAllGroups();

const props = defineProps<{
  caseId: string;
}>();

const selectedGroup = ref(groups.items[0].id);

const allCounters = useCounters();
const displayUsers = computed(() => {
  return allCounters.value.filter((counter) => counter.group === selectedGroup.value);
});

const selectedUser = ref(displayUsers.value[0]?.expand.user.id || "");

watch(selectedGroup, () => {
  selectedUser.value = displayUsers.value[0]?.expand.user.id || "";
});

async function doEscalate() {
  try {
    const res = await useEscalateCase(
      props.caseId,
      selectedUser.value,
      selectedGroup.value
    );
    miniToast(res.status, res.message);
  } catch (error) {
    miniToast("failed", "Failed to escalate case");
  } finally {
    selectedUser.value = "";
    selectedGroup.value = "";
    document.getElementById(props.caseId + "escalate")?.click();
  }
}
</script>

<style></style>
