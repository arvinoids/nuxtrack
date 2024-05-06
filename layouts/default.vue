<template>
  <div>
    <Navbar />
    <div class="flex flex-col items-center">
      <slot />
    </div>
    <Footer />
    <Updater />
  </div>
</template>
<style>
@import url("https://fonts.googleapis.com/css2?family=Urbanist:wght@100..900&display=swap");

body {
  font-family: "Urbanist", sans-serif;
  @apply font-normal;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
