<template>
  <div class="btn btn-ghost btn-circle">
    <label class="swap swap-rotate">
      <!-- this hidden checkbox controls the state -->
      <input type="checkbox" v-model="mode" />

      <!-- moon icon -->
      <Icon name="ic:outline-brightness-5" class="swap-on text-gray-200" size="1.6rem" />

      <!-- sun icon -->
      <Icon name="ic:outline-brightness-4" class="swap-off text-gray-200" size="1.6rem" />
    </label>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const storedMode = ref(localStorage.getItem("colorMode"));
let mode = ref(getStoredMode());
onMounted(() => {
  if (storedMode.value === null) localStorage.setItem("colorMode", "light");
  mode.value = false;
});

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
