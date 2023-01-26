<template>
<div class="modal" :id="props.groupId">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Assign ticket to {{ props.groupDescription }}</h3>
    <p class="py-4">The ticket will be assigned to {{ props.nextUserName }}</p>
    <input type="text" placeholder="CAS-XXXXXXXXXXX" class="input input-bordered input-sm w-auto" v-model="caseId">
    <div class="modal-action">
     <a href="#" class="btn">Skip</a>
     <a href="#" class="btn" :disabled="disabled">Assign</a>
     <a href="#" class="btn">Cancel</a>
    </div>
  </div>
</div>
</template>
    
<script setup lang='ts'>
const props = defineProps({
    groupId: String,
    groupDescription: String,
    nextUserId: String,
    nextUserName: String
})
const id = props.groupId
let caseId: String=''
let disabled:Boolean = true
if (!(caseId==='')) disabled=false 

</script>
    
<style>
    
</style>