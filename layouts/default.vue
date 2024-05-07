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
@import url("https://fonts.googleapis.com/css2?family=Cabin&family=Inter:wght@300;400;500;600;700;900&family=Poppins:wght@400;500;600;700&display=swap");

body {
  font-family: "Inter", sans-serif;
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
