<template>
<div class="modal" :id="props.id">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Skip - Catch up later</h3>
    <p class="py-4">To skip a user, close this window and click on the user whom you want to assign the ticket to.</p>
    <div class="modal-action">
      <a href="#" :for="props.id" class="btn" @click="">OK</a>
    </div>
  </div>
</div>
    
</template>
    
<script setup lang='ts'>
const pb = useNuxtApp().$pb
const props = defineProps({
  fullName: String,
  userId: String,
  id: String,
  groupId: String
})


async function skipCatchUp(){

}

</script>