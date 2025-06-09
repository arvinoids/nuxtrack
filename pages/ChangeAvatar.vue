<template>
  <div class="flex flex-col items-center gap-2 mt-2">
    <h1 class="text-lg text-center font-bold">Change Avatar</h1>

    <div
      class="flex flex-row border border-neutral-200 m-2 p-12 shadow-md w-full gap-10 flex-wrap"
    >
      <div class="flex flex-col items-stretch gap-10">
        <div class="flex flex-col items-center">
          <div class="font-semibold">Current Avatar</div>
          <div v-if="avatarUrl" class="size-auto">
            <img :src="avatarUrl" alt="avatar" />
          </div>
          <div v-else>None</div>
        </div>
        <div class="flex flex-col items-center bg-neutral p-8">
          <div class="font-semibold mb-2">Upload new avatar</div>
          <div class="alert alert-warning p-3 m-2">
            Please keep your avatar to 300x300px or smaller
          </div>
          <div class="form-control gap-3 flex flex-col items-center">
            <input
              type="file"
              @change="onFileChange"
              class="file-input file-input-bordered file-input-sm file-input-accent"
            />
            <button
              class="btn btn-sm btn-secondary w-fit"
              @click="uploadAvatar"
              :class="{ 'btn-disabled': file === null }"
            >
              Upload Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useCurrentUser();
definePageMeta({
  middleware: "auth",
});
const avatarUrl = ref(await useGetAvatarUrl(user.value));
const file = ref<File | null>(null);

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    file.value = target.files[0];
  }
};

const uploadAvatar = async () => {
  if (!file.value) return;

  const formData = new FormData();
  formData.append("avatar", file.value);

  const res = await useUpdateAvatar(user.value?.id, formData);
  if (res.status === "success") {
    avatarUrl.value = await useGetAvatarUrl(user.value);
    file.value = null;
  }
  miniToast(res.status, res.message);
};
</script>

<style></style>
