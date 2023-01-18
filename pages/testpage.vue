<template>
    <div>
        <p>This is a testpage. You have been routed here because authentication was successful.</p>
        <p>Authenticated: {{  authenticated }}</p>
        <div v-if="authenticated">
        <button class="btn btn-sm btn-accent" @click="logout()">Logout</button>
        </div>
    </div>
</template>
<script setup lang="ts">
    const app = useNuxtApp().$pb
    const authenticated: Boolean = app.authStore.isValid
    async function logout() {
        app.authStore.clear()
        navigateTo('/')
    }
</script>

