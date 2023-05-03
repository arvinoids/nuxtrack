<template>
  <div class="p-5 flex flex-col h-screen items-center justify-start">
    <h1 class="text-center text-xl mb-5 text-secondary">
      Change your password, <span class="font-semibold">{{ name }}</span>
    </h1>
    <form
      @submit.prevent="changePassword"
      class="flex flex-col min-w-min gap-2 self-center shadow-xl p-6 bg-neutral"
    >
      <label for="current-password">Current Password</label>
      <input type="password" class="input input-bordered" v-model="data.oldPassword" />
      <label for="new-password">New Password</label>
      <input type="password" class="input input-bordered" v-model="data.password" />
      <label for="confirm-password">Confirm Password</label>
      <input
        type="password"
        class="input input-bordered"
        v-model="data.passwordConfirm"
      />
      <button type="submit" class="btn btn-warning" :disabled="!inputIsValid">
        Change Password
      </button>
      <div
        class="alert shadow-lg alert-success rounded-lg"
        :class="{ 'alert-error': !success }"
        v-if="message"
      >
        <span>{{ message }}</span>
      </div>
      <nuxt-link to="/">
        <div class="btn btn-accent" @click="$router.back()">
          <Icon name="ic:baseline-keyboard-arrow-left" size="2em" />Back
        </div>
      </nuxt-link>
    </form>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
definePageMeta({
  middleware: "auth",
});

const userId = pb.authStore.model!.id;
const name = await pb.authStore.model!.fullname.split(" ")[0];

const data = reactive({ oldPassword: "", password: "", passwordConfirm: "" });

let message = ref("");
let success = false;

async function changePassword() {
  if (data.password !== data.passwordConfirm) {
    message.value = "Passwords do not match";
    return;
  }
  try {
    const record = await pb.collection("users").update(userId, data);
    message.value = "Password has been successfully changed";
    success = true;
  } catch (error: any) {
    message.value = error.message;
  }
}

const inputIsValid = computed(() => {
  if (data.passwordConfirm === "" || data.oldPassword === "" || data.password === "")
    return false;
  else return true;
});
</script>
