<template>
    <Navbar />
    <div class="flex flex-col">
        <div class="self-center">
            <div class="flex flex-row flex-wrap">
                <DashBoard />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const app = useNuxtApp().$pb
const name: string = app.authStore.baseModel.fullname

definePageMeta({
  middleware: ["auth"]
})
</script>