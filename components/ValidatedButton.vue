<script setup lang="ts">
import { useIsFormDirty, useIsFormValid } from "vee-validate";

const isDirty = useIsFormDirty();
const isValid = useIsFormValid();

const isDisabled = computed(() => {
  return !isDirty.value || !isValid.value;
});
</script>

<template>
  <button :disabled="isDisabled">Submit</button>
</template>
