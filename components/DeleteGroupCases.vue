<template>
  <div>
    <p>Delete Cases in group:</p>
    <div>
      <table class="table table-zebra table-compact border">
        <thead>
          <tr>
            <th class="rounded-none">Group</th>
            <th class="rounded-none">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="group in groups">
            <td class="text-sm">{{ group.description }}</td>
            <td>
              <label
                for="deleteCases"
                class="btn btn-warning btn-xs"
                @click="
                  selectedGroup = group.id;
                  selectedGroupDescription = group.description;
                "
                >Delete Cases</label
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <input type="checkbox" id="deleteCases" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box relative">
          <label for="deleteCases" class="btn btn-xs absolute right-2 top-2">✕</label>
          <h3 class="text-lg font-bold">
            Deleting case in
            {{ selectedGroupDescription }}
          </h3>
          <p class="py-4">
            This will delete all cases in
            <span class="font-semibold">{{ selectedGroupDescription }}</span
            >. This cannot be undone.
          </p>
          <p>Proceed?</p>
          <div class="modal-action center">
            <label for="deleteCases" class="btn btn-warning">No</label>
            <label
              for="deleteCases"
              class="btn btn-error"
              @click="deleteGroupCases(selectedGroup)"
              >Yes</label
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LogData } from "custom-types";

const groupsData = await useGetAllGroups();
const groups = groupsData.items;
const selectedGroup = ref("");
const selectedGroupDescription = ref("");

async function deleteGroupCases(group: string) {
  const res = await useDeleteGroupCases(group);
  useShowToast(res.message, res.status);
  const logData: LogData = {
    user: useCurrentUser()!.username,
    type: "deleted case",
    details: `Deleted all cases in group ${group}`,
  };
  logActivity(logData);
}
</script>

<style></style>
