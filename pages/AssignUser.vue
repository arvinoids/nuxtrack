<template>
    <div class="flex flex-col justify-center items-center">
        <p>You are about to assign a case to {{ user.fullname }}</p>
        <p>If you would like to assign a case to someone else, please click Back and select the correct user.</p>
        <button class="btn btn-outline btn-secondary my-3" @click="$router.go(-1)">Go Back</button>
    </div>
</template>
    
<script setup lang='ts'>
  const pb = useNuxtApp().$pb
  const selector = useSelector()

  const user = await pb.collection('users').getOne(selector.value.user)

</script>
    
<style>
    
</style>