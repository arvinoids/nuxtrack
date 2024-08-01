<template>
  <div class="btn btn-ghost btn-circle group relative">
    <label class="swap swap-rotate">
      <!-- this hidden checkbox controls the state -->
      <input type="checkbox" v-model="checked" />
      <!-- moon icon -->
      <Icon name="ph:sun-duotone" class="swap-on text-gray-200" size="1.6rem" />
      <!-- sun icon -->
      <Icon
        name="ph:moon-stars-duotone"
        class="swap-off text-gray-200"
        size="1.6rem"
      /> </label
    ><Tooltip position="bottom">Toogle dark/light mode</Tooltip>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

function getMode() {
  return localStorage.getItem("dark") === "1" ? true : false;
}

const checked = ref(getMode());

watch(checked, (checked) => {
  if (checked === true) {
    colorMode.preference = "dark";
    localStorage.setItem("dark", "1");
  } else {
    colorMode.preference = "light";
    localStorage.setItem("dark", "0");
  }
});
</script>

<style scoped>
.d-toggle-switch {
  display: inline-flex;
  align-items: center;
}
</style>
