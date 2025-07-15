<template>
  <div class="min-h-screen flex items-center justify-center">
    <slot />
  </div>
</template>

<style lang="postcss">
@import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap");

:root {
  --shift-x: 0px;
  --shift-y: 0px;
}

body {
  @apply m-0 p-0 min-h-screen w-full;
  font-family: "Roboto", "Roboto Condensed", Arial, sans-serif;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  background: url("@/assets/img/gb6.jpg") center / cover no-repeat;
  transform: translate(var(--shift-x), var(--shift-y)) scale(1.08);
  transform-origin: center;
  will-change: transform;
  z-index: -1;
}
</style>
