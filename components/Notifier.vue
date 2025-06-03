<template>
  <div class="indicator">
    <nuxt-link to="/Logs" class="btn btn-circle btn-primary btn-ghost">
      <Icon
        name="ic:baseline-notifications-active"
        size="1.8rem"
        :class="newEvent ? 'text-error' : 'text-gray-200'"
        @click="newEvent = false"
      />
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
const newEvent = useNotify();
const currentUser = pb.authStore.model!.username;

// Subscribe to changes in any logs record
pb.collection("logs").subscribe("*", async () => {
  const latest = await pb
    .collection("logs")
    .getList(1, 1, { filter: `created >="${Date.now()}"`, sort: "-created" });
  const update = latest.items[0];

  if (currentUser !== update.user) {
    //useShowToast(`${update.user} ${update.type} ${update.details}`, "success");
    miniToast("success", `${update.user} ${update.type} ${update.details}`);
  }
  newEvent.value = true;
});

watch(newEvent, (x = newEvent.value) => {
  localStorage.setItem("newEvent-tracker", x ? "true" : "false");
});

onMounted(() => {
  newEvent.value = useGetBooleanFromLocalStorage(
    localStorage.getItem("newEvent-tracker")
  );
});
</script>

<style></style>
