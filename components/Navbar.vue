<template>
  <div class="navbar bg-[#44434e]">
    <div class="navbar-start">
      <img
        src="/xerox-lexmark-logo-mono.svg"
        alt="Logo"
        class="mb-1 h-[26px] md:ml-[5rem] mr-5"
      />
      <h1 class="mx-2 text-lg text-gray-200 hidden lg:block">
        <NuxtLink to="/">{{ APP_NAME }}</NuxtLink>
        <DevOnly><span class="text-red-600 px-10 bg-base-200">DEV MODE</span></DevOnly>
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
const logo = "~";
</script>

<style></style>
