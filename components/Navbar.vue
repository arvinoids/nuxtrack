<template>
  <div class="navbar bg-secondary shadow-md mb-3">
    <div class="navbar-start">
      <div class="dropdown" v-if="auth.isAuthenticated">
        <label tabindex="0" class="btn btn-ghost btn-circle text-secondary mx-3">
          <svg
            class="btn-circle text-primary w-15 h-10 fill-gray-200 btn btn-ghost"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
          >
            <!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) -->
            <path
              d="M248 104c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 144c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm0-240C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-49.7 0-95.1-18.3-130.1-48.4 14.9-23 40.4-38.6 69.6-39.5 20.8 6.4 40.6 9.6 60.5 9.6s39.7-3.1 60.5-9.6c29.2 1 54.7 16.5 69.6 39.5-35 30.1-80.4 48.4-130.1 48.4zm162.7-84.1c-24.4-31.4-62.1-51.9-105.1-51.9-10.2 0-26 9.6-57.6 9.6-31.5 0-47.4-9.6-57.6-9.6-42.9 0-80.6 20.5-105.1 51.9C61.9 339.2 48 299.2 48 256c0-110.3 89.7-200 200-200s200 89.7 200 200c0 43.2-13.9 83.2-37.3 115.9z"
            />
          </svg>
        </label>
        <ul
          tabindex="0"
          v-if="auth"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <label>Color Mode <ColorToggle /></label>
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
    <div class="navbar-center">
      <h1 class="mx-2 text-xl font-bold text-gray-200">
        <NuxtLink to="/">Rotation Tracker</NuxtLink>
      </h1>
    </div>
    <div class="navbar-end">
      <h1 class="mx-2 font-bold text-gray-200 text-lg">
        <NuxtLink to="/Cases">All Cases</NuxtLink>
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
const auth = useAuth();
const user = useSelector();
if (await pb.authStore.isValid) auth.value.isAuthenticated = true;
async function logout() {
  pb.authStore.clear();
  navigateTo("/Login");
  auth.value.isAuthenticated = false;
}

function setUserPage() {
  user.value.user = pb.authStore.model.id;
}
</script>

<style></style>
