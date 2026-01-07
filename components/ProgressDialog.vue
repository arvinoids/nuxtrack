<template>
  <dialog :id="id" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">{{ title }}</h3>
      <p class="py-4"><slot>Please wait...</slot></p>
      <div class="modal-action" v-if="actionable">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn">Ok</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
defineProps<{
  open: Boolean;
  id: string;
  title: string;
  actionable: boolean;
}>();
</script>

<style></style>
