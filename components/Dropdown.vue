<template>
  <div class="relative">
    <!-- Dropdown toggle button -->
    <div
      class="flex items-center btn btn-ghost btn-square p-2"
      ref="menubutton"
      @click.stop="show = !show"
    >
      <button class="text-gray-200 hover:text-gray-50">
        <Icon name="ic:round-menu" class="fill-gray-200 hover:fill-gray-50" size="2rem" />
      </button>
    </div>

    <!-- Dropdown menu -->
    <transition>
      <div
        v-show="show"
        class="absolute right-0 mt-3 py-2 bg-base-100 shadow-xl w-[20rem] border z-40"
        ref="menu"
      >
        <div class="flex flex-row items-center">
          <div class="block px-4 py-2 text-sm justify-start">
            Logged in as {{ loggedInUser.toUpperCase() }}
          </div>
          <div
            class="btn btn-sm btn-outline btn-warning justify-end ml-auto mr-3 px-2 py-1"
            @click="
              {
                logout();
                show = !show;
              }
            "
          >
            Log out
          </div>
        </div>
        <div
          v-if="userRole === 'admin'"
          class="block px-4 py-2 text-sm hover:bg-neutral"
          @click="show = !show"
        >
          <NuxtLink to="/Admin">Admin</NuxtLink>
        </div>
        <div
          v-if="auth.isAuthenticated"
          class="block px-4 py-2 text-sm hover:bg-neutral"
          @click="show = !show"
        >
          <NuxtLink to="/Cases">All Cases</NuxtLink>
        </div>
        <div class="block px-4 py-2 text-sm hover:bg-neutral" @click="show = !show">
          <nuxt-link to="/user/Profile">My Page</nuxt-link>
        </div>
        <div>
          <nuxt-link
            to="/ChangePassword"
            class="block px-4 py-2 text-sm hover:bg-neutral"
            @click="show = !show"
            >Change Password</nuxt-link
          >
        </div>
      </div>
    </transition>
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

// const menu = ref(null);
// onClickOutside(
//   menu,
//   (event) => {
//     show.value = false;
//   },
//   { ignore: ["menubutton"] }
// );
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
