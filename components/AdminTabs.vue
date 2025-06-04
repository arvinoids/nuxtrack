<template>
  <div class="flex">
    <div class="w-full bg-base-200 border-b border-base-300"></div>
    <div class="tabs tabs-lift bg-base-200 min-w-fit pt-1">
      <nuxt-link class="tab bg-base-200" active-class="tab-active" to="/Admin/Users"
        >Users</nuxt-link
      >
      <nuxt-link class="tab bg-base-200" active-class="tab-active" to="/Admin/Email"
        >Email</nuxt-link
      >
      <nuxt-link class="tab bg-base-200" active-class="tab-active" to="/Admin/Cases"
        >Cases</nuxt-link
      >
      <nuxt-link class="tab bg-base-200" active-class="tab-active" to="/Admin/Groups"
        >Groups</nuxt-link
      >
      <dev-only
        ><nuxt-link class="tab bg-base-200" active-class="tab-active" to="/Admin/System"
          >System</nuxt-link
        ></dev-only
      >
    </div>
    <div class="bg-base-200 w-full border-b border-base-300"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="postcss" scoped></style>
