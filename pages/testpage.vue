<template>
    <div class="self-center w-3/6">
        <!-- <h1 class="text-center font-bold text-xl">Select a product set</h1> -->
        <div v-for="user in users">
        {{ user.id }}
        </div>
    </div>
</template>

<script setup>
const groupId = '7j4zxj7j74mbe74'
    const groupFilter = `memberOf~"${groupId}"`
    const app = useNuxtApp().$pb
    let users = await app.collection('users').getList(1,100,{ filter: groupFilter, '$autoCancel': false, })
    users = users.items
    
</script>