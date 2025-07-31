<template>
  <div class="navbar bg-base-100 border-b border-base-300">
    <div class="navbar-start">
      <img
        src="/xerox-lexmark-logo-white.svg"
        alt="Logo"
        class="mb-1 h-[26px] md:ml-[5rem] mr-5"
        v-if="darkMode"
      />
      <img
        src="/xerox-lexmark-logo-black.svg"
        alt="Logo"
        class="mb-1 h-[26px] md:ml-[5rem] mr-5"
        v-else
      />

      <h1 class="mx-2 text-lg hidden lg:block">
        <NuxtLink to="/">{{ APP_NAME }}</NuxtLink>
        <DevOnly><span class="text-primary px-2 m-2 bg-base-200">DEV</span></DevOnly>
      </h1>
    </div>
    <div class="navbar-center"></div>
    <div class="navbar-end">
      <div class="flex gap-2 items-center md:mr-[5rem]">
        <NewCaseFinder />
        <ColorToggle />
        <Notifier />
        <Dropdown />
      </div>
    </div>
    <MiniToast />
  </div>
</template>

<script setup lang="ts">
const darkMode = useIsDarkMode();
</script>

<style></style>
