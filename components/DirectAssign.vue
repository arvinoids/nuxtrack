<template>
    <div class="modal" :id="props.groupId">
      <div class="modal-box w-2/3 max-w-5xl">
        <h3 class="font-bold text-lg">Assign ticket to {{ props.groupDescription }}</h3>
        <p class="py-4">The ticket will be directly assigned to {{ props.nextUserName }}</p>
        <input type="text" placeholder="CAS-XXXXXXXXXXX" class="input input-bordered input-sm w-auto" v-model="caseId">
        <div class="modal-action justify-center">
         <button class="btn" :disabled="caseId ===''" >Assign</button>
         <a href="#" class="btn btn-warning">Cancel</a>
        </div>
      </div>
    </div>
    </template>
        
    <script setup lang='ts'>
    const props = defineProps({
        groupId: String,
        groupDescription: String,
        userId: String,
        nextUserName: String
    })
    
    const caseId = ref('')
    let str1 = props.groupId
    let str2 = props.userId
    
    </script>