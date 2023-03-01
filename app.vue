<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<style>
@import url("https://fonts.googleapis.com/css2?family=Cabin&display=swap");

body {
  font-family: "Cabin", sans-serif;
  @apply text-lg;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
