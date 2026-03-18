<template>
  <div class="flex flex-col items-center gap-2">
    <div
      v-if="!loading"
      class="flex flex-row border border-neutral-200 m-1 p-8 shadow-md w-full gap-10 flex-wrap"
    >
      <VForm action="submit" class="flex flex-col gap-4 w-[400px]">
        <p class="form-control flex justify-between gap-2">
          <label for="enable" class="text-sm label">Enable email notifications </label
          ><input
            name="notifications"
            type="checkbox"
            v-model="enabled"
            class="checkbox checkbox-sm checkbox-secondary text-white focus:border-2 rounded-none"
          />
        </p>
        <div class="flex flex-row gap-3 justify-between items-center">
          <label for="token" class="label w-[12ch] text-sm">Email Token</label>
          <VField
            type="text"
            name="token"
            class="input input-bordered"
            placeholder="16-digit token"
            v-model="token"
            :rules="{ required: true, min: 16 }"
          />
          <VErrorMessage name="name" class="alert alert-error" />
        </div>
        <div class="flex flex-row gap-3 justify-between items-center">
          <label for="token" class="label w-[12ch] text-sm">Email API URL</label>
          <VField
            type="text"
            name="api"
            class="input input-bordered"
            placeholder="https://path/to/api"
            v-model="api"
            :rules="{ required: true }"
          />
          <VErrorMessage name="name" class="alert alert-error" />
        </div>
        <div
          class="btn w-min self-center btn-secondary"
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
import type { SettingsResponse } from "~/pocketbase-types";

const loading = ref(true);
const pb = useNuxtApp().$pb;
const allSettings = await pb.collection<SettingsResponse>("settings").getFullList();

const enabled = ref(
  allSettings.find((setting) => setting.field === "emailnotification")!.value
);
const token = ref(allSettings.find((setting) => setting.field === "emailtoken")!.value);
const api = ref(allSettings.find((setting) => setting.field === "emailservice")!.value);

onMounted(async () => {
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
