<template>
  <div class="navbar bg-[#44434e] shadow-md mb-3">
    <div class="navbar-start">
      <img src="logo_darkmode.svg" alt="Logo" class="h-[25px] md:ml-[5rem] mr-5" />
      <h1 class="mx-2 text-lg text-gray-200 hidden lg:block">
        <NuxtLink to="/">Rotation Tracker</NuxtLink>
      </h1>
    </div>
    <div class="navbar-center"></div>
    <div class="navbar-end">
      <Notifier />
      <div class="dropdown dropdown-end" v-if="auth.isAuthenticated">
        <label
          tabindex="0"
          class="btn btn-ghost btn-circle text-secondary mx-3 md:mr-[5rem]"
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
        </label>
        <ul
          tabindex="0"
          v-if="auth"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <label
              >Color Mode
              <ColorToggle />
            </label>
          </li>
          <li>
            <div v-if="userRole === 'admin'">
              <NuxtLink to="/Admin">Admin</NuxtLink>
            </div>
          </li>
          <li>
            <div v-if="auth.isAuthenticated">
              <NuxtLink to="/Cases">All Cases</NuxtLink>
            </div>
          </li>
          <li><nuxt-link to="/ChangePassword">Change Password</nuxt-link></li>
          <li>
            <nuxt-link to="/user/Profile">My Page</nuxt-link>
          </li>

          <li>
            <div @click="logout()">Logout</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
const auth = useAuth();
const loggedInUser = useLoggedInUsername();
const userRole = ref(pb.authStore.model!.role);
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
