<template>
  <div>
    <Navbar />
    <div class="flex flex-col items-center">
      <slot />
    </div>
    <Footer />
  </div>
</template>
<style>
@import url("https://fonts.googleapis.com/css2?family=Cabin&family=Inter:wght@400&family=Poppins:wght@300;500;600&display=swap");

body {
  font-family: "Inter", sans-serif;
  background-image: none;
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
