<template>
  <div class="flex flex-col justify-center items-center gap-2 w-full">
    <p class="font-bold text-center">Case Archiver</p>
    <p class="text-sm text-center w-auto font-condensed">
      Archive cases that exceed a certain number of cases to keep for a user.
    </p>
    <table class="table font-condensed border-neutral-200 border flex" v-if="allCounters">
      <thead class="bg-base-200">
        <tr>
          <th>User</th>
          <th>Group</th>
          <th>Cases</th>
          <th>Archived</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody v-for="counter in allCounters.items" class="w-full">
        <tr
          :class="[{ 'bg-error/15': counter.count > casesToKeep }]"
          class="hover:bg-base-200/50"
        >
          <td>{{ counter.expand.user.fullname }}</td>
          <td>{{ counter.expand.group.description }}</td>
          <td>
            {{ counter.count }}
            <div
              class="btn btn-xs btn-ghost btn-primary btn-square mx-1"
              :title="
                'Archive ' +
                (counter.count - casesToKeep) +
                ' cases for ' +
                counter.expand.user.fullname
              "
              v-if="counter.count > casesToKeep"
              @click="
                archiveAndDeleteCaseForUserInGroup(counter.expand.user, counter.group)
              "
            >
              <Icon name="mdi:zip-box-outline" size="20px" />
            </div>
            <FullScreenProcessing v-if="archiveSingleUser"
              >Archiving {{ counter.count - casesToKeep }} cases for
              {{ counter.expand.user.fullname }}</FullScreenProcessing
            >
          </td>
          <td>{{ counter.archived }}</td>
          <td>{{ counter.total_count }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else><LoadingBlockPage /></div>
    <ProgressDialog
      id="progressDialog"
      :actionable="false"
      title="Archive Cases"
      :open="archiveSingleUser"
      >Archiving cases for {{ currentUserName }}</ProgressDialog
    >
    <div class="flex gap-2 items-center">
      <div>Latest cases to keep:</div>
      <input
        type="number"
        v-model="casesToKeep"
        class="input input-bordered input-sm w-20 text-center"
        min="1"
      />
    </div>
    <button class="btn btn-primary btn-sm" @click="archiveOldCases">Archive Cases</button>
    <!-- <ProgressBar
      :progress-value="(100 * progressCounter) / allCounters.totalItems"
      message="Archiving cases"
      v-if="progressCounter !== allCounters.totalItems"
    /> -->
    <div
      v-if="progressCounter !== allCounters.totalItems"
      class="flex flex-col justify-start w-full"
    >
      <LoadingBlockPage
        ><p>Archiving cases for {{ currentUserName }} ({{ progress.toFixed(0) }}%)</p>
        <p>Do not navigate away from this page.</p>
        <progress
          class="progress progress-success w-56"
          :value="progress"
          max="100"
        ></progress>
      </LoadingBlockPage>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UsersResponse } from "~/pocketbase-types";

const casesToKeep = ref(100);
const allCounters = await useGetAllCounters();
const progressCounter = ref(allCounters.totalItems);
const progress = computed(() => (100 * progressCounter.value) / allCounters.totalItems);
const currentUserName = ref();
const archiveSingleUser = ref(false);
const progressSingle = ref(0);

const archiveCases = ref();
async function archiveOldCases() {
  progressCounter.value = 0;
  for (const counter of allCounters.items) {
    if (counter.count > casesToKeep.value) {
      currentUserName.value = counter.expand.user.fullname;
      await useArchiveOldCases(counter.user, counter.group, casesToKeep.value);
    }
    progressCounter.value++;
  }
}

async function archiveAndDeleteCaseForUserInGroup(user: UsersResponse, groupId: string) {
  archiveSingleUser.value = true;
  currentUserName.value = user.fullname;
  progressSingle.value = 0;
  const res = await useArchiveAndDeleteCasesForUserInGroup(
    user.id,
    groupId,
    casesToKeep.value
  );
  progressSingle.value = 100;
  archiveSingleUser.value = false;
  useShowToast(res.message, res.status);
}
</script>

<style></style>
