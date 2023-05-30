<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="flex flex-col bg-white h-[22rem] w-[25rem] border shadow-2xl">
      <div class="flex flex-col p-6 gap-3">
        <div class="font-bold text-lg self-center">Reset Password</div>
        <div class="text-sm">
          This form will send a reset password link to the Lexmark email address
          associated with your account. Please make sure to use the correct email address.
        </div>
      </div>
      <div class="text-center py-2 text-sm h-[8rem]" v-if="message">
        <div class="mb-2">{{ message }}</div>
        <div class="btn btn-sm btn-outline btn-accent mx-1" @click="message = ''">
          Try again
        </div>
        <div class="btn btn-sm btn-outline btn-accent mx-1" @click="navigateTo('/Login')">
          Log In
        </div>
      </div>
      <form v-else class="flex flex-col gap-3 px-20 h-[8rem]">
        <input
          type="email"
          class="input input-sm input-bordered text-center"
          placeholder="email@lexmark.com"
          v-model="email"
          required
        />
        <button class="btn btn-accent button-sm" @click.prevent="reset">
          Send Password Reset Email
        </button>
        <nuxt-link to="/Login" class="text-sm text-center">Back to Login</nuxt-link>
      </form>
      <Footer class="text-xs" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "fullscreen",
});

const pb = useNuxtApp().$pb;

let email = ref("");
let message = ref("");

async function reset() {
  try {
    await pb.collection("users").requestPasswordReset(email.value);
    email.value = "";
    message.value = "Password reset email sent!";
  } catch (e: any) {
    message.value = e.message;
  }
}
</script>

<style></style>
