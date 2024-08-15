<template>
    <div class="border p-10">
    <div class="text-secondary font-bold mb-3">Archive Logs</div>
    <div>Total Entries: {{ total }}</div>
    <div>Archive oldest <input type="number" min="1" :max="total" class="input input-sm input-bordered w-[10ch]" v-model="quantity"></input> entries</div>
    <button class="btn btn-primary btn-sm mt-5" @click="archiveAndDeleteLogs()" :class="{'btn-disabled': !ready}">Archive</button>
    </div>
</template>
    
<script setup lang='ts'>
import type { LogsResponse } from '~/pocketbase-types';

const total = ref(await useCountLogs())
const quantity=ref(0)
const ready = ref(false)
let recordsToDelete:LogsResponse[]
let data:string

watch(quantity,async (value) =>{
    ready.value=false
    if(value>0) { 
        const record = await useGetOldestLogs(quantity.value)
        recordsToDelete = record.items
        data = jsonToCSV(record.items)
        ready.value=true
    } 
    else ready.value = false
})

async function archiveAndDeleteLogs(){
    try {
        miniToast('warning','Archiving logs...')
        await useUploadCsvLogsToPocketBase(data,quantity.value)
        miniToast('success','Logs saved to archive')
        miniToast('warning','Removing entries from database...')
        console.log('records to delete',recordsToDelete)
        await useDeleteLogsRecords(recordsToDelete)
        // await useDeleteOldestLogs(quantity.value)
        miniToast('success','Entries removed from database')
        total.value = await useCountLogs()
        miniToast('success',`${quantity.value} lines saved in archive`)
    } catch (e:any){
        miniToast('failed',e.message)
    }
}
    
</script>
    
<style>
    
</style>