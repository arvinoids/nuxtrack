<template>
    <div class="self-center w-3/6">
        <h1 class="text-center font-bold text-xl">Select a product set</h1>
        <div class="flex flex-row flex-wrap">
            <div v-for="item in groups" :key="item" class="flex flex-col rounded-2xl text-center p-4 m-4 w-[200px] shadow-lg bg-gray-100">
                <h2 class="font-semibold mb-3">{{ item.description }}</h2>                
                    <div v-for="user in users" :key="user">
                        <div v-if="(user.memberOf.includes(item.id))" class="text-sm">
                                {{ user.fullname }} 
                        </div>
                    </div>
                    <div class="flex flex-col flex-grow mt-3">
                        <div class="btn btn-sm btn-success mt-auto w-20 self-center">{{ select }}</div>
                    </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const app = useNuxtApp().$pb
const groups = await app.collection('groups').getFullList(200,)
const users = await app.collection('users').getFullList(200,)
const select = "select"

</script>