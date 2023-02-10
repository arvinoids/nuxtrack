<template>
    <div class="p-5 flex flex-col h-screen items-center justify-start">
        <h1 class="text-center text-xl mb-5">Change your password, {{ name }}</h1>
        <form @submit.prevent="changePassword"
            class="flex flex-col w-min gap-2 self-center shadow-xl p-6 bg-gray-100 rounded-xl">
            <label for="current-password">Current Password</label>
            <input type="password" class="input input-bordered input-sm" v-model="data.oldPassword" />
            <label for="new-password">New Password</label>
            <input type="password" class="input input-bordered input-sm" v-model="data.password" />
            <label for="confirm-password">Confirm Password</label>
            <input type="password" class="input input-bordered input-sm" v-model="data.passwordConfirm" />
            <button type="submit" class="btn btn-warning">Change Password</button>
            <div class="alert shadow-lg alert-success" :class="{ 'alert-error': !success }" v-if="(message)">
                <span>{{ message }}</span>
            </div>
            <nuxt-link to="/">
                <div class="btn btn-accent"><svg class="h-6 w-6 fill-current md:h-8 md:w-8"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path>
                    </svg>Back to Home</div>
            </nuxt-link>
        </form>
    </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb
definePageMeta({
    middleware: "auth"
})

const userId = await pb.authStore.model.id
const name = await pb.authStore.model.fullname.split(' ')[0]

interface data {
    oldPassword: string;
    password: string;
    passwordConfirm: string;
}

let data = {
    password: '',
    passwordConfirm: '',
    oldPassword: ''
};

let message = ref('')
let success = false

async function changePassword() {
    if (data.password !== data.passwordConfirm) {
        message.value = "Passwords do not match"
        return
    }
    try {
        const record = await pb.collection('users').update(userId, data)
        message.value = "Password has been successfully changed"
        success = true
    } catch (error: any) {
        message.value = error.message
    }
}

</script>

