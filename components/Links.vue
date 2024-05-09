<template>
  <div class="w-full">
    <div class="border flex flex-col gap-2 shadow pb-2 mb-1">
      <div
        class="px-3 py-2 text-lg font-normal bg-neutral bg-opacity-30 w-full border-b-2 border-primary"
      >
        Links
      </div>
      <div class="py-2 px-5">
        <ul v-for="link in links">
          <li class="list-item">
            <a :href="link.url" target="_blank" class="hover:text-primary">{{
              link.title
            }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const links = await useGetLinks();
</script>

<style></style>
