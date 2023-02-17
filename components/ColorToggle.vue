<template>
  <div class="d-toggle-switch">
    <label class="label">
      <input type="checkbox" v-model="mode" class="toggle toggle-sm" />
      <span class="label-text ml-2">{{ colorMode.preference }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const storedMode = ref(localStorage.getItem("colorMode"));
let mode = ref(getStoredMode());
function getStoredMode() {
  if (storedMode.value === "dark" || storedMode.value === null) return true;
  else return false;
}
watch(mode, (mode) => {
  if (mode === true) {
    colorMode.preference = "dark";
    localStorage.setItem("colorMode", "dark");
  } else {
    colorMode.preference = "light";
    localStorage.setItem("colorMode", "light");
  }
});
</script>

<style scoped>
.d-toggle-switch {
  display: inline-flex;
  align-items: center;
}
</style>
