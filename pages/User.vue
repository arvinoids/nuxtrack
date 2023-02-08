<template>
    <div class="flex justify-center items-start flex-wrap">
        <div class="shadow-xl placeholder rounded-xl mx-5 p-5">
            <p class="font-semibold">Name: {{ userData.fullname }}</p>
            <p>Username: {{  userData.username }}</p>
            <p>Email: {{ userData.email }}</p>
            <p>Autneticated: {{ auth.isAuthenticated }}</p>
        </div>
        <div>
        <CasesTable :userId="userData.id" class="shadow-xl rounded-b-xl"/>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
const pb = useNuxtApp().$pb
const user = useSelector()
const auth = useAuth()
let userData = await pb.collection('users').getOne(pb.authStore.model.id)
if(user.value.user) { userData = await pb.collection('users').getOne(user.value.user) }

</script>
    
<style>

</style>