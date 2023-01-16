<template>

    <div class="flex h-screen items-center justify-center">
        <div class="card w-96 bg-base-100 shadow-xl">
            <figure><img src="https://placeimg.com/400/225/arch" alt="Shoes" /></figure>
            <div class="card-body">
                <h2 class="card-title">Login</h2>
                <input type="text" class="input input-bordered text-center rounded-full"
                    placeholder="username@lexmark.com" v-model="username">
                <input type="password" class="input input-bordered text-center rounded-full" placeholder="password"
                    v-model="password">
                <div class="card-actions justify-center">
                    <button class="btn btn-primary btn-md rounded-full w-full" @click="login()">Login</button>
                </div>
                <div class="alert alert-error shadow-lg"  v-if="message">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{{ message }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
let username = ''
let password = ''
let message = ''
const app = useNuxtApp().$pb
async function login() {
    try {
        const authData = await app.collection('users').authWithPassword(username, password)
    }
    catch (error: any) {
        console.log(error)
        message = error.message

    }
}

</script>

<style scoped>

</style>