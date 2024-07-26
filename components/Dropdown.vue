<template>
  <div class="relative">
    <!-- Dropdown toggle button -->
    <div
      class="flex items-center btn btn-ghost btn-square p-2"
      ref="menubutton"
      @click.stop="show = !show"
      v-if="!show"
    >
      <button class="text-gray-200 hover:text-gray-50">
        <Icon name="ic:round-menu" class="fill-gray-200 hover:fill-gray-50" size="2rem" />
      </button>
    </div>
    <div class="flex items-center btn btn-ghost btn-square p-2" ref="menubutton" v-else>
      <button class="text-gray-200 hover:text-gray-50">
        <Icon name="ic:round-menu" class="fill-gray-200 hover:fill-gray-50" size="2rem" />
      </button>
    </div>

    <!-- Dropdown menu -->
    <transition>
      <div
        v-show="show"
        class="absolute right-0 mt-3 py-2 bg-base-100 shadow-xl min-w-[400px] border z-40 flex flex-row"
        ref="menu"
      >
        <UserStatusCard />
        <div class="flex flex-col">
          <NuxtLink
            to="/Admin"
            v-if="userIsAdmin()"
            class="block px-4 py-2 text-sm hover:bg-neutral"
            @click="show = !show"
          >
            Admin</NuxtLink
          >
          <NuxtLink
            to="/Cases"
            v-if="auth.isAuthenticated"
            class="block px-4 py-2 text-sm hover:bg-neutral"
            @click="show = !show"
          >
            All Cases
          </NuxtLink>
          <NuxtLink
            to="/User/Profile"
            class="block px-4 py-2 text-sm hover:bg-neutral"
            @click="show = !show"
          >
            My Page
          </NuxtLink>

          <NuxtLink
            to="/ChangePassword"
            class="block px-4 py-2 text-sm hover:bg-neutral"
            @click="show = !show"
            >Change Password</NuxtLink
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
const auth = useAuth();
const currentUser = useCurrentUser();
const show = ref(false);

function userIsAdmin() {
  return currentUser.value!.role === "admin" || currentUser.value!.role === "lead";
}

currentUser.value = pb.authStore.model;

if (pb.authStore.isValid) {
  auth.value.isAuthenticated = true;
}

const menu = ref(null);
onClickOutside(menu, () => {
  show.value = false;
});
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
