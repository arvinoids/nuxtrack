<template>
  <div class="flex flex-col items-center gap-2">
    <h1 class="text-lg text-center">Email Settings</h1>
    <div
      v-if="!loading"
      class="flex flex-row border m-2 p-10 shadow-md w-full gap-10 flex-wrap"
    >
      <VForm action="submit" class="flex flex-col gap-4 w-[400px]">
        <p class="form-control flex-row justify-between">
          <label for="enable">Enable email notifications </label
          ><input
            name="notifications"
            type="checkbox"
            v-model="enabled"
            class="checkbox checkbox-sm checkbox-secondary focus:border-2"
          />
        </p>
        <div class="flex flex-row gap-3 justify-between items-center">
          <label for="token" class="">Email Token</label>
          <VField
            type="text"
            name="token"
            class="input input-bordered input-sm"
            placeholder="16-digit token"
            v-model="token"
            :rules="{ required: true, min: 16 }"
          />
          <VErrorMessage name="name" class="alert alert-error" />
        </div>
        <div class="flex flex-row gap-3 justify-between items-center">
          <label for="token" class="">Email API URL</label>
          <VField
            type="text"
            name="api"
            class="input input-bordered input-sm"
            placeholder="https://path/to/api"
            v-model="api"
            :rules="{ required: true }"
          />
          <VErrorMessage name="name" class="alert alert-error" />
        </div>
        <div
          class="btn w-min self-center bg-neutral-500 text-neutral"
          @click.prevent="updateEmailSettings()"
        >
          Save
        </div>
      </VForm>
    </div>
    <div v-else>
      <Spinner />
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(true);
const pb = useNuxtApp().$pb;

const enabled = ref("");
const token = ref("");
const api = ref("");

onMounted(async () => {
  enabled.value = (
    await pb.collection("settings").getFirstListItem('field="emailnotification"')
  ).value;
  token.value = (
    await pb.collection("settings").getFirstListItem('field="emailtoken"')
  ).value;
  api.value = (
    await pb.collection("settings").getFirstListItem('field="emailservice"')
  ).value;
  loading.value = false;
});

async function updateEmailSettings() {
  try {
    await pb
      .collection("settings")
      .update("dx0sbq59vcmerh1", { field: "emailnotification", value: enabled.value });
    await pb
      .collection("settings")
      .update("kehpxgso94vqzn8", { field: "emailtoken", value: token.value });
    await pb
      .collection("settings")
      .update("com5bbmi4t9zy9w", { field: "emailservice", value: api.value });
    useShowToast("Settings have been updated.", "success");
  } catch (e: any) {
    useShowToast(e.message, "failed");
  }
}
</script>

<style scoped>
label {
  @apply text-sm;
}
</style>
