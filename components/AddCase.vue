<template>
<div class="modal" :class="{'modal-open':modalIsOpen}" :id="props.groupId">
  <div class="modal-box w-2/3 max-w-5xl">
    <h3 class="font-bold text-lg">Assign ticket to {{ props.groupDescription }}</h3>
    <p class="py-4">The ticket will be assigned to {{ props.nextUserName }}</p>
      <input type="text" placeholder="CAS-XXXXXXXXXXX" class="input input-bordered input-sm w-auto" v-model="caseId">
      <div class="modal-action justify-center">
       <a :href="'#'+skipAnchorCatch" class="btn btn-outline">Skip - Catch up later</a>
       <a :href="'#'+skipAnchorOut" class="btn btn-outline" >Skip - Out of office</a>
       <button class="btn" :disabled="caseId ===''" @click="submitCase()">Assign</button>
       <a href="#" class="btn btn-warning">Cancel</a>
      </div>
  </div>
</div>
<SkipCatch :userId="props.nextUserId"  :id="skipAnchorCatch" :groupId ="props.groupId" :fullName="props.nextUserName"/>
<SkipOut :userId="props.nextUserId"  :id="skipAnchorOut" :groupId ="props.groupId" :fullName="props.nextUserName"/>

</template>
    
<script setup lang='ts'>
const props = defineProps<{
    groupId: string,
    groupDescription: string,
    nextUserId: string,
    nextUserName: string
}>()
const router = useRouter()
const caseId = ref('')
let str1 = props.groupId
let str2 = props.nextUserId
const skipAnchorCatch:string = str1!.concat(str2!,"Catch")
const skipAnchorOut:string = str1!.concat(str2!,"Out")
const reloadKey = useRefresher()
const modalIsOpen=ref(false)

async function submitCase() {
  await assignCase(caseId.value,props.nextUserId,props.groupId)
  reloadKey.value.count++
  modalIsOpen.value=false
  console.log("is modal open?",modalIsOpen.value)
}

</script>