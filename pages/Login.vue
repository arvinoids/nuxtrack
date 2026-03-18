<template>
  <div>
    <div class="fieldset rounded-lg p-8 text-center border border-neutral/30 shadow-lg">
      <form @submit.prevent="login" class="flex flex-col gap-2 w-90">
        <h2 class="text-2xl mb-5">
          <img
            src="/img/x-l-vertical.png"
            alt="Xerox"
            class="justify-self-center logo-img w-40"
          />
        </h2>
        <div class="flex items-center gap-3">
          <div class="flex flex-col gap-1">
            <div class="flex flex-col gap-1">
              <input
                type="text"
                class="input input-sm text-center"
                required
                v-model="username"
                placeholder="username"
              />
            </div>
            <div class="flex flex-col">
              <input
                type="password"
                class="input input-sm text-center"
                placeholder="password"
                required
                v-model="password"
              />
            </div>
            <div class="flex items-center justify-between font-condensed">
              <NuxtLink
                to="/forgot-password"
                class="text-info no-underline hover:underline"
              >
                Forgot password?
              </NuxtLink>
            </div>
            <button
              type="submit"
              class="btn btn-sm btn-primary font-condensed cursor-pointer"
            >
              Log In
            </button>
          </div>
          <div>OR</div>
          <div>
            <button class="btn btn-info" @click.prevent="loginWithMS">
              Login with Microsoft
            </button>
          </div>
        </div>
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

definePageMeta({
  layout: "login",
});

let username = "";
let password = "";
let message = ref("");
const authenticated = useAuth();
const currentUser = useCurrentUser();
const pb = useNuxtApp().$pb;

async function loginWithMS() {
  try {
    const authData = await pb.collection("users").authWithOAuth2({
      provider: "microsoft",
      createData: {
        emailVisibility: true,
      },
    });
    currentUser.value = pb.authStore.model;
    authenticated.value.isAuthenticated = pb.authStore.isValid;
    authenticated.value.role = authData.record.role;

    if (authData.meta?.accessToken) {
      try {
        const photoResponse = await fetch(
          "https://graph.microsoft.com/v1.0/me/photo/$value",
          {
            headers: {
              Authorization: `Bearer ${authData.meta.accessToken}`,
            },
          }
        );

        if (photoResponse.ok) {
          const blob = await photoResponse.blob();
          const formData = new FormData();
          formData.append("avatar", blob, "avatar.jpg");

          await pb.collection("users").update(authData.record.id, formData);
        }
      } catch (err) {
        console.error("Failed to fetch Microsoft avatar:", err);
      }
    }

    navigateTo("/");
  } catch (e: any) {
    miniToast("failed", e.message);
  }
}
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
