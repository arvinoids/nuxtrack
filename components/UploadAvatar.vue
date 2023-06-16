<template>
  <div>
    <input
      type="file"
      ref="fileInput"
      @change="uploadFile"
      accept="image/jpeg,image/png,image/bmp"
      class="input-group"
    />
    <button class="btn btn-sm" @click="uploadFile">Upload</button>
    <h1 v-if="file">File uploaded: {{}}</h1>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;

const fileInput = ref(null);
const file = ref(null);

function uploadFile() {
  const newfile = fileInput.value;
  if (!newfile) {
    return;
  }
  const formData = new FormData();
  formData.append("avatar", newfile);
  const updateAvatar = pb.collection("users").update(pb.authStore.model!.id, formData);
}
</script>

<style></style>
