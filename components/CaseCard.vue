<template>
  <div class="border border-neutral-200 p-4 shadow m-3">
    <div class="text-sm">
      <p>
        <span class="font-semibold">Case ID: </span
        ><span class="text-secondary">{{ caseRecord.case }}</span>
      </p>
      <p>
        <span class="font-semibold">Owner:</span>
        {{ caseRecord.expand?.user.fullname }}
      </p>
      <p>
        <span class="font-semibold">Group:</span>
        {{ caseRecord.expand?.group.description }}
      </p>
      <p>
        <span class="font-semibold">Date assigned:</span>
        {{ useFormatDate(new Date(caseRecord.created)) }}
      </p>
      <p>
        <span class="font-semibold">Assigned by:</span>
        {{ caseRecord.assignedBy?.toUpperCase() }}
      </p>
    </div>
    <div class="flex flex-row justify-end gap-3 pt-2">
      <label
        class="btn btn-sm"
        :for="caseRecord.case + 'escalate'"
        v-if="!caseRecord.case.includes('-escalated') && !caseIsEscalated"
        >Escalate</label
      >
      <label
        class="btn btn-sm"
        :for="caseRecord.id + 'edit'"
        v-if="
          !caseRecord.case.includes('-escalated') &&
          user &&
          (user.role === 'admin' || user.role === 'lead')
        "
        >Reassign</label
      >
      <label
        class="btn btn-warning btn-sm"
        :for="caseRecord.id + 'del'"
        v-if="user && (user.role === 'admin' || user.role === 'lead')"
        >Delete</label
      >
    </div>
    <EscalateCase :case-id="caseRecord.case" />

    <EditCase
      :id="caseRecord.id"
      :caseId="caseRecord.case"
      :owner="caseRecord.user"
      :product="caseRecord.group"
      :case-edit-disabled="true"
    />
    <DeleteCase
      :id="caseRecord.id"
      :case-id="caseRecord.case"
      :case-owner="caseRecord.user"
    />
  </div>
</template>

<script setup lang="ts">
import type { CasesResponse, GroupsResponse, UsersResponse } from "~/pocketbase-types";
type Texpand = {
  user: UsersResponse;
  group: GroupsResponse;
};
const props = defineProps<{
  caseRecord: CasesResponse<Texpand>;
}>();

const user = useCurrentUser();

const caseIsEscalated = await useCaseIsEscalated(props.caseRecord.case);

const pb = useNuxtApp().$pb;
pb.autoCancellation(false);
const caseRecord = ref(props.caseRecord);
pb.collection("cases").subscribe(props.caseRecord.id, async () => {
  caseRecord.value = await pb
    .collection("cases")
    .getOne<CasesResponse<Texpand>>(props.caseRecord.id, {
      expand: "user,group",
    });
});
</script>

<style></style>
