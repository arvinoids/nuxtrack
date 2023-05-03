<template>
  <div class="flex flex-col items-center gap-2">
    <h1 class="text-lg text-center">Change Password</h1>
    <div class="flex flex-row border m-2 p-5 shadow-md w-full gap-10 flex-wrap">
      <VForm action="submit" class="flex flex-col gap-4 w-[300px]">
        <div class="flex flex-col">
          <label for="username" class="label">Username: </label>
          <input
            disabled
            type="text"
            class="input input-bordered input-sm"
            name="username"
            v-model="username"
          />
        </div>
        <div class="flex flex-col">
          <label for="password" class="label">Old password: </label>
          <VField
            type="password"
            class="input input-bordered input-sm"
            v-model="data.oldPassword"
            name="oldpassword"
            :rules="{ required: true, min: 8 }"
          />
          <label for="password" class="label">New password: </label>
          <VField
            type="password"
            class="input input-bordered input-sm"
            v-model="data.password"
            name="newpassword"
            :rules="{ required: true, min: 8 }"
          />
          <VErrorMessage name="password" class="alert alert-error text-sm h-8" />
          <label for="confirm" class="label">Confirm new password: </label>
          <VField
            type="password"
            class="input input-bordered input-sm"
            v-model="data.passwordConfirm"
            name="confirmation"
            rules="confirmed:@newpassword"
          />
          <VErrorMessage name="confirmation" class="alert alert-error text-sm h-8" />
        </div>
        <div class="flex justify-center">
          <ValidatedButton @click.prevent="changePassword" class="btn btn-primary w-max"
            >Change Password</ValidatedButton
          >
        </div>
      </VForm>
      <div class="flex flex-col items-stretch">
        <div class="border p-5 w-[300px] flex-grow bg-base-100">
          <h5 class="font-semibold">Please note:</h5>
          <ul class="text-accent mt-2">
            <li>Password must be 8 characters or longer.</li>
            <li>
              It is recommended to use a strong password with a combination of uppercase
              and lowercase characters, numbers and special characters.
            </li>
          </ul>
        </div>
        <div
          class="border alert text-sm w-[300px]"
          :class="{
            'alert-error': status === 'failed',
            'alert-success': status === 'success',
          }"
          v-if="message"
        >
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
definePageMeta({
  middleware: "auth",
});

const userId = pb.authStore.model!.id;
const username = pb.authStore.model!.username;
let message = ref("");
let status = ref("failed");

const data = reactive({ oldPassword: "", password: "", passwordConfirm: "" });

async function changePassword() {
  try {
    await pb.collection("users").update(userId, data);
    message.value = "Password has been successfully changed.";
    status.value = "true";
  } catch (error: any) {
    status.value = "failed";
    message.value = error.message;
    console.log(error);
  }
  useShowToast(message.value, status.value);
}

async function getErrorMessage(error: any) {
  let message;
  message = await error.data.oldPassword.message;
  return message;
}
</script>

<style scoped>
ul {
  list-style-type: circle;
  margin-left: 2rem;
}
</style>
