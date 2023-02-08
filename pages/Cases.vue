<template>
    <CasesTable class="m-10 shadow-lg"/>
</template>
    
<script setup lang='ts'>
    const pb = useNuxtApp().$pb
    const auth = useAuth()
    if(pb.authStore.isValid){
        auth.value.isAuthenticated = true
    }
</script>
    
<style>
    
</style>