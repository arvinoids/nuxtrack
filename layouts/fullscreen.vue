<template>
  <div>
    <slot />
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cabin&family=Inter:wght@300&family=Poppins:wght@300;500;600&display=swap");

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

<script setup>
const bodyStyle = `background-image: url('/TeamPicHD.jpg'); 
  background-repeat: no-repeat; 
  background-attachment: fixed; 
  background-size: cover; 
  background-position: auto; 
  background-position-x: center; 
  background-position-y: center`;

useHead({
  bodyAttrs: {
    style: bodyStyle,
  },
});
</script>
