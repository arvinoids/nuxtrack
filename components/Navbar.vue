<template>
  <div class="navbar bg-[#44434e] shadow-md mb-3">
    <div class="navbar-start">
      <img
        src="~/assets/img/logo_darkmode.svg"
        alt="Logo"
        class="h-[25px] md:ml-[5rem] mr-5"
      />
      <h1 class="mx-2 text-lg text-gray-200 hidden lg:block">
        <NuxtLink to="/">{{ APP_NAME }}</NuxtLink>
        <DevOnly
          ><span class="text-red-600 px-10 bg-base-200">DEVELOPMENT MODE</span></DevOnly
        >
      </h1>
    </div>
    <div class="navbar-center"></div>
    <div class="navbar-end">
      <div class="flex gap-2 items-center md:mr-[5rem]">
        <CaseFinder />
        <ColorToggle />
        <Notifier />
        <Dropdown />
      </div>
    </div>
    <MiniToast />
  </div>
</template>

<script setup lang="ts"></script>

<style></style>
