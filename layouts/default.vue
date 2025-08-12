<template>
  <div>
    <Navbar />
    <UserLeaveNotification />
    <div class="flex flex-col items-center">
      <slot />
    </div>
    <Footer />
    <Updater />
  </div>
</template>
<style lang="postcss">
@import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap");
body {
  font-family: "Roboto", "Roboto Condensed", Arial, sans-serif;
}

body::before {
  content: none;
  background: none;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

html {
  overflow-y: scroll;
}
</style>

<script setup lang="ts">
const currentUser = useCurrentUser();

const pb = useNuxtApp().$pb;

if (!currentUser.value || currentUser.value.length === 0) {
  currentUser.value = pb.authStore.model;
}

pb.collection("users").subscribe(pb.authStore.model!.id, () => {
  pb.collection("users").authRefresh();
});

pb.authStore.onChange(() => {
  currentUser.value = pb.authStore.model;
});
</script>
