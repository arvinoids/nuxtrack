<template>
  <div id="updater" class="modal" :class="{ 'modal-open': show }">
    <form method="dialog" class="modal-box">
      <h3 class="font-bold text-lg">{{ APP_NAME }}</h3>
      <p class="py-4">
        The Rotation Tracker has been updated! This requires a reload of the page.
      </p>
      <div class="modal-action">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn btn-secondary" @click="refreshPage()">Reload now</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const show = ref(false);
const pb = useNuxtApp().$pb;
const { id } = await pb.collection("settings").getFirstListItem('field="version"');
pb.collection("settings").subscribe(id, () => {
  console.log("version has changed");
  show.value = true;
});

function refreshPage() {
  location.reload();
}
</script>

<style></style>
