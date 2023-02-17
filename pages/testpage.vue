<script setup lang="ts">
let checked = ref(false);

const theme = computed((checked) => {
  if (checked.value) return "mytheme";
  else return "darkLex";
});
</script>

<template>
  <div class="flex flex-col items-center">
    <p class="text-lg">This is a testpage</p>
    <input type="checkbox" class="toggle" v-model="checked" />
  </div>
</template>
