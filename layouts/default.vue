<template>
  <div>
    <Navbar />
    <UserLeaveNotification />
    <div class="flex flex-col items-center py-3">
      <slot />
    </div>
    <Footer />
    <Updater />
  </div>
</template>
<style>
@import url("https://fonts.googleapis.com/css2?family=Cabin&family=Inter:wght@300;400;500;600;700;900&family=Poppins:wght@400;500;600;700&family=Figtree:ital,wght@0,300..900;1,300..900&display=swap");

body {
  font-family: "Figtree", sans-serif;
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
</style>

<script setup lang="ts">
import UserLeaveNotification from "~/components/UserLeaveNotification.vue";

const currentUser = useCurrentUser();

const pb = useNuxtApp().$pb;
pb.collection("users").subscribe(pb.authStore.model!.id, () => {
  pb.collection("users").authRefresh();
});

pb.authStore.onChange(() => {
  currentUser.value = pb.authStore.model;
});
</script>
