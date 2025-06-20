<template>
  <div class="w-full collapse bg-base-100 border-neutral-200 border shadow-md">
    <input type="checkbox" />
    <div class="font-semibold collapse-title">Reporter</div>
    <div class="collapse-content">
      <div class="border border-neutral-200 p-3 bg-base-200">
        <div>
          <div class="flex gap-4">
            <div>
              <div class="flex items-center gap-3">
                <label for="agent" class="w-[7ch] label text-sm">Agent</label
                ><select
                  class="select select-bordered select-sm w-[25ch]"
                  v-model="agentId"
                >
                  <option v-for="user in allUsers.items" :value="user.id">
                    {{ user.fullname }}
                  </option>
                </select>
              </div>
              <div class="flex items-center gap-3">
                <label for="group" class="w-[7ch] label text-sm">Group</label
                ><select
                  class="select select-bordered select-sm w-[25ch]"
                  v-model="groupId"
                >
                  <option v-for="group in allGroups.items" :value="group.id">
                    {{ group.description }}
                  </option>
                </select>
              </div>
            </div>
            <div>
              <div class="flex gap-3 items-center">
                <label for="start" class="w-[7ch] label text-sm">From</label
                ><input
                  type="datetime-local"
                  class="input input-sm input-bordered"
                  v-model="startTime"
                />
              </div>
              <div class="flex gap-3 items-center">
                <label for="end" class="w-[7ch] label text-sm">To</label
                ><input
                  type="datetime-local"
                  class="input input-bordered input-sm"
                  v-model="endTime"
                />
              </div>
            </div>
            <button
              class="btn btn-sm btn-warning"
              @click="generate"
              :disabled="isDisabled"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table
          v-if="cases"
          class="table table-xs table-compact my-2 w-full"
          id="tableData"
        >
          <thead v-if="cases.totalItems > 0">
            <tr>
              <th></th>
              <th>Case</th>
              <th>Owner</th>
              <th>Created</th>
              <th>Assigned by</th>
              <th>Modified</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in cases.items">
              <th>{{ index + 1 }}</th>
              <td>{{ item.case }}</td>
              <td>{{ item.expand.user.username }}</td>
              <td>{{ useFormatDate(item.created) }}</td>
              <td>{{ item.assignedBy }}</td>
              <td>{{ useFormatDate(item.updated) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="alert w-auto bg-warning/20 m-2 p-1">
          Please specify the filters above to generate a report.
        </div>
        <div class="flex justify-between mt-2">
          <div class="text-center my-2" v-if="cases">
            Cases found: {{ cases.totalItems }}
          </div>
          <button
            class="btn btn-sm btn-secondary"
            @click="exportCSV"
            v-if="cases && cases.totalItems > 0"
          >
            Export to CSV
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
let agentId = ref("");
let groupId = ref("");
let startTime = ref();
let endTime = ref();

const allUsers = await useGetAllUsers();
const allGroups = await useGetAllGroups();
const cases = ref();

async function generate() {
  console.log(startTime, endTime);
  cases.value = await useGetCaseReport(
    agentId.value,
    groupId.value,
    startTime.value,
    endTime.value
  );
}

const isDisabled = computed(() => {
  return !agentId.value || !groupId.value || !startTime.value || !endTime.value;
});

function exportCSV() {
  exportTableToCSV("tableData");
}
</script>

<style></style>
