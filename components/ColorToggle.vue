<template>
  <div
    class="btn btn-ghost btn-circle btn-primary group relative"
    title="Toggle dark/light mode"
  >
    <label class="swap swap-rotate">
      <!-- this hidden checkbox controls the state -->
      <input type="checkbox" v-model="isDarkMode" @change="toggleTheme" />
      <!-- sun icon (shows in dark mode) -->
      <Icon name="ph:sun-duotone" class="swap-on" size="1.6rem" />
      <!-- moon icon (shows in light mode) -->
      <Icon name="ph:moon-stars-duotone" class="swap-off" size="1.6rem" />
    </label>
  </div>
</template>

<script setup lang="ts">
// Check if user prefers dark mode or has previously selected it
const isDarkMode = ref(false);

// Initialize theme based on localStorage or system preference
onMounted(() => {
  // Check localStorage first
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    isDarkMode.value = savedTheme === "xrx-dark";
    applyTheme(savedTheme);
    useIsDarkMode().value = isDarkMode.value;
  } else {
    // Check system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    isDarkMode.value = prefersDark;
    applyTheme(prefersDark ? "xrx-dark" : "xrx");
    useIsDarkMode().value = isDarkMode.value;
  }
});

// Toggle between themes
function toggleTheme() {
  const newTheme = isDarkMode.value ? "xrx-dark" : "xrx";
  applyTheme(newTheme);
  localStorage.setItem("theme", newTheme);
  useIsDarkMode().value = isDarkMode.value;
}

// Apply theme to document
function applyTheme(theme: string) {
  document.documentElement.setAttribute("data-theme", theme);
}
</script>

<style scoped>
.d-toggle-switch {
  display: inline-flex;
  align-items: center;
}
</style>
