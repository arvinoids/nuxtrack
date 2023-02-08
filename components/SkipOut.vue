<template>
    <div class="modal" :id="props.id">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Skip - Out of office</h3>
            <p class="py-4">You are skipping {{ props.fullName }}. Click OK to continue.</p>
            <div class="modal-action">
                <a href="#" :for="props.id" class="btn" @click="useSkipOut(props.userId!,props.groupId!)">OK</a>
            </div>
        </div>
    </div>

</template>
    
<script setup lang='ts'>
const props = defineProps({
    fullName: String,
    userId: String,
    id: String,
    groupId: String
})

</script>
