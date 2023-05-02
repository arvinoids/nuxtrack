<template>
  <div class="navbar bg-[#44434e] shadow-md mb-3">
    <div class="navbar-start">
      <img
        src="~/assets/img/logo_darkmode.svg"
        alt="Logo"
        class="h-[25px] md:ml-[5rem] mr-5"
      />
      <h1 class="mx-2 text-lg text-gray-200 hidden lg:block">
        <NuxtLink to="/">Rotation Tracker</NuxtLink>
      </h1>
    </div>
    <div class="navbar-center"></div>
    <div class="navbar-end">
      <Notifier />
      <div class="relative mx-3 md:mr-[5rem]">
        <!-- Dropdown toggle button -->
        <button
          @click="show = !show"
          class="flex items-center btn btn-ghost btn-square p-2 text-secondary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="text-primary w-5 fill-gray-200"
            viewBox="0 0 448 512"
          >
            <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
            />
          </svg>
        </button>

        <!-- Dropdown menu -->
        <div
          v-show="show"
          class="absolute right-0 mt-2 py-2 bg-base-100 shadow-xl w-44 border z-40"
        >
          <div class="flex flex-row items-center gap-2">
            <label class="block px-4 text-sm hover:bg-neutral">Color </label>
            <ColorToggle />
          </div>
          <div
            v-if="userRole === 'admin'"
            class="block px-4 py-2 text-sm hover:bg-neutral"
          >
            <NuxtLink to="/Admin">Admin</NuxtLink>
          </div>
          <div
            v-if="auth.isAuthenticated"
            class="block px-4 py-2 text-sm hover:bg-neutral"
          >
            <NuxtLink to="/Cases">All Cases</NuxtLink>
          </div>
          <div>
            <nuxt-link to="/user/Profile" class="block px-4 py-2 text-sm hover:bg-neutral"
              >My Page</nuxt-link
            >
          </div>
          <div>
            <nuxt-link
              to="/ChangePassword"
              class="block px-4 py-2 text-sm hover:bg-neutral"
              >Change Password</nuxt-link
            >
          </div>
          <div
            class="block px-4 py-2 text-sm hover:bg-neutral cursor-pointer"
            @click="logout()"
          >
            Logout
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
const auth = useAuth();
const loggedInUser = useLoggedInUsername();
const userRole = ref(pb.authStore.model!.role);
const show = ref(false);
// const newEvent = useNotify();

if (await pb.authStore.isValid) {
  auth.value.isAuthenticated = true;
  loggedInUser.value = pb.authStore.model!.username;
}

async function logout() {
  pb.authStore.clear();
  navigateTo("/Login");
  auth.value.isAuthenticated = false;
}
</script>

<style></style>
