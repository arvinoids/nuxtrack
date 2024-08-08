<template>
  <div class="text-sm">
    <p>
      <span class="font-semibold">Case ID: </span
      ><span class="text-secondary">{{ caseRecord.case }}</span>
    </p>
    <p>
      <span class="font-semibold">Owner:</span>
      {{ caseRecord.expand.user.fullname }}
    </p>
    <p>
      <span class="font-semibold">Group:</span>
      {{ caseRecord.expand.group.description }}
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
</template>

<script setup lang="ts">
import type { BaseModel } from "pocketbase";
import type { CasesRecord } from "~/pocketbase-types";
type Texpand = {};
const props = defineProps<{
  caseRecord: CasesRecord & BaseModel & Texpand;
}>();
console.log("props passed: ", props.caseRecord);
</script>

<style></style>
