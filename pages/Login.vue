<template>
  <div>
    <div
      class="w-[400px] rounded-lg p-8 text-center border border-white/50 backdrop-blur-[45px] shadow-[0_0_80px_#111111]"
    >
      <form @submit.prevent="login" class="flex flex-col">
        <h2 class="text-2xl mb-5 text-white">
          <img
            src="/img/x-l-vertical.png"
            alt="Xerox"
            class="justify-self-center logo-img"
          />
        </h2>
        <div
          v-if="message"
          class="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-2 rounded mb-4 text-sm"
        >
          {{ message }}
        </div>
        <div class="input-field">
          <input type="text" required v-model="username" />
          <label>Enter your username or email</label>
        </div>
        <div class="input-field">
          <input type="password" required v-model="password" />
          <label>Enter your password</label>
        </div>
        <div class="flex items-center justify-between my-[25px] mb-[35px] text-white">
          <NuxtLink
            to="/forgot-password"
            class="text-[#efefef] no-underline hover:underline"
          >
            Forgot password?
          </NuxtLink>
        </div>
        <button
          type="submit"
          class="bg-[#d40e2a] text-white font-medium py-3 px-5 cursor-pointer rounded-[1px] text-base border border-transparent transition-all duration-300 ease-in-out hover:text-white hover:border-white hover:bg-white/15"
        >
          Log In
        </button>
        <div class="text-center mt-8 text-white">
          <a
            class="text-xs text-gray-300"
            href="https://solutionsteam.lrdc.lexmark.com"
            target="_blank"
            >© 2025 Xerox | Solutions Team</a
          >
        </div>
      </form>
    </div>
    <div
      class="py-3 px-2 absolute right-5 top-5 border rounded border-white/50 backdrop-blur-[45px] shadow-lg flex gap-2"
    >
      <span class="label text-xs">Parallax</span>
      <input
        type="checkbox"
        v-model="animate"
        class="toggle-error toggle-xs toggle rounded"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const animate = ref(true);
let parallaxCleanup: (() => void) | null = null;

watch(
  animate,
  (enabled) => {
    if (enabled) {
      parallaxCleanup = useMouseParallax();
    } else {
      if (parallaxCleanup) {
        parallaxCleanup();
        parallaxCleanup = null;
      }
      document.documentElement.style.setProperty("--shift-x", "0px");
      document.documentElement.style.setProperty("--shift-y", "0px");
    }
  },
  { immediate: true }
);

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
      user: currentUser.value!.username,
      type: "logged in",
    });
    navigateTo("/");
  } catch (error: any) {
    message.value = error.message;
  }
}
</script>

<style scoped>
.input-field {
  position: relative;
  border-bottom: 2px solid #ccc;
  margin: 15px 0;
}

.input-field label {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  color: #fff;
  font-size: 16px;
  pointer-events: none;
  transition: 0.15s ease;
}

.input-field input {
  width: 100%;
  height: 40px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
  color: #fff;
}

.input-field input:focus ~ label,
.input-field input:valid ~ label {
  font-size: 0.8rem;
  top: 10px;
  transform: translateY(-120%);
}

.logo-img {
  max-width: 50%;
  height: auto;
  -webkit-mask-image: linear-gradient(45deg, #fff 25%, rgba(0, 0, 0, 0.2) 50%, #fff 75%);
  mask-image: linear-gradient(95deg, #fff 25%, rgba(0, 0, 0, 0.2) 50%, #fff 75%);
  -webkit-mask-size: 800%;
  mask-size: 800%;
  -webkit-mask-position: 0;
  mask-position: 0;
}

.logo-img:hover {
  transition: mask-position 2s ease, -webkit-mask-position 2s ease;
  -webkit-mask-position: 120%;
  mask-position: 120%;
  opacity: 1;
}
</style>
