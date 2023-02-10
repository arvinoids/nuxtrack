<template>
    <input type="checkbox" :id="props.id" class="modal-toggle" />
    <div class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
            <h3 class="font-bold text-lg">Assigning case...</h3>
            <p v-if="!caseIsValid">You must enter a valid case ID</p>
            <p v-if="message">{{ message }}</p>
            <div class="modal-action">
                <label :for="props.id" class="btn" v-if="!caseIsValid">Go Back</label>
                <label :for="props.id" class="btn" v-if="caseIsValid" @click="doSubmit">OK</label>
            </div>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
const props = defineProps<{
    id: string,
    user: string,
    group: string,
    fullName: string,

}>()
const message = ref('')
const caseId = useCaseId()

const caseIsValid = computed(() => {
    if (caseId.value === '') return false
    else return true
})

async function submitCase() {
    const res = await assignCase(caseId.value, props.user, props.group)
    return res
}

async function doSubmit() {
    const res = await submitCase()
    // message.value = res.message
}

</script>
    
<style>

</style>