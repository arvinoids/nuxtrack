<template>
  <div class="navbar bg-base-100 border-b border-base-300 px-5">
    <div class="navbar-start">
      <AdaptiveLogo />
      <h1 class="mx-2 text-2xl hidden lg:block">
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

<style></style>
