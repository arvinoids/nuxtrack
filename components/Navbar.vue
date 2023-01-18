<template>
<div class="navbar bg-green-700 mb-3 shadow-xl">
  <div class="navbar-start">
    <a class="btn btn-ghost normal-case text-xl text-secondary">Hello, {{ name }}</a>
  </div>
  <div class="navbar-end">
    <div class="btn btn-secondary" @click="logout()" >Logout</div>
  </div>
</div>
</template>
    
<script setup lang='ts'>
const app = useNuxtApp().$pb
const name: string = app.authStore.baseModel.fullname

async function logout()
{
    app.authStore.clear()
    navigateTo('/Login')
}

</script>
    
<style>
    
</style>