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
</style>
