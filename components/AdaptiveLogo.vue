<template>
  <label class="swap">
    <!-- this hidden checkbox controls the state -->
    <input type="checkbox" :checked="isDark" />

    <!-- volume on icon -->
    <img
      :src="darkLogo"
      alt="Logo"
      class="swap-on fill-current mb-1 h-[26px] md:ml-[5rem] mr-5"
    />

    <!-- volume off icon -->
    <img
      :src="logo"
      alt="Logo"
      class="swap-off fill-current mb-1 h-[26px] md:ml-[5rem] mr-5"
    />
  </label>
</template>
<script setup lang="ts">
const isDark = useIsDarkMode();
import darkLogo from "~/assets/img/xerox-lexmark-logo-white.svg";
import logo from "~/assets/img/xerox-lexmark-logo-black.svg";
</script>
