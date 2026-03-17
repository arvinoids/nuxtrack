<template>
  <div>
    <div class="fieldset rounded-lg p-8 text-center border border-neutral/30 shadow-lg">
      <form @submit.prevent="login" class="flex flex-col gap-2 w-70">
        <h2 class="text-2xl mb-5">
          <img
            src="/img/x-l-vertical.png"
            alt="Xerox"
            class="justify-self-center logo-img w-40"
          />
        </h2>
        <div class="flex flex-col">
          <label class="label font-condensed">Username</label>
          <input
            type="text"
            class="input text-center"
            required
            v-model="username"
            placeholder="username"
          />
        </div>
        <div class="flex flex-col">
          <label class="label font-condensed">Password</label>
          <input type="password" class="input text-center" required v-model="password" />
        </div>
        <div class="flex items-center justify-between font-condensed my-[25px] mb-[35px]">
          <NuxtLink to="/forgot-password" class="text-info no-underline hover:underline">
            Forgot password?
          </NuxtLink>
        </div>
        <button
          type="submit"
          class="btn font-condensed btn-primary font-medium py-3 px-5 cursor-pointer transition-all duration-300 ease-in-out"
        >
          Log In
        </button>
        <div
          v-if="message"
          class="bg-red-500/20 border border-red-500/50 px-4 py-2 rounded my-4 text-sm"
        >
          {{ message }}
        </div>
        <div class="text-center mt-8">
          <a class="text-xs" href="https://solutionsteam.lrdc.lexmark.com" target="_blank"
            >© 2025 Xerox | Solutions Team</a
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LogsTypeOptions } from "~/pocketbase-types";

const animate = ref(true);

definePageMeta({
  layout: "login",
});

let username = "";
let password = "";
let message = ref("");
const authenticated = useAuth();
const currentUser = useCurrentUser();
const pb = useNuxtApp().$pb;
async function login() {
  try {
    const authData = await pb.collection("users").authWithPassword(username, password);
    authenticated.value.isAuthenticated = pb.authStore.isValid;
    authenticated.value.role = authData.record.role;
    currentUser.value = pb.authStore.model;

    logActivity({
      user: currentUser.value?.username,
      type: LogsTypeOptions["logged in"],
    });
    navigateTo("/");
  } catch (error: any) {
    message.value = error.message;
  }
}
</script>
