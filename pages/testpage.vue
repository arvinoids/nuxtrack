

<script setup lang="ts">
// CounterCreator
// 1) open the user
// 2) get the groups where the user belongs
// 3) create a counter for each of the groups

const pb = useNuxtApp().$pb


const users = await pb.collection('users').getList(1,100,{ '$autoCancel': false, })
const cases = await pb.collection('cases').getList(1,100,{ '$autoCancel': false, })

//useCounterCreator()
const caseId = "CAS-93450934850938"
const caseFilter = 'case="'+caseId+'"'

async function caseExists(caseId:string) {
    const caseFilter = 'case="'+caseId+'"'
    try{
            const record = await pb.collection('cases').getFirstListItem(caseFilter)
            return true
    } catch(e) { 
        console.log(e)
        return false
    }
 }

//const doesCaseExist:boolean = await caseExists(caseId)

// rerun
const groupId = "zp81nluzd17f2tt"
const userId = "is6zgjo8mr43ur7"
async function reRunCount(userId:string,groupId:string) {
    const groupFilter = 'group="'+groupId+'"'
    const userFilter = 'user="'+userId+'"'
    const combinedFilter = groupFilter+" && "+userFilter
    console.log(combinedFilter)
    const cases = await pb.collection('cases').getList(1,500,{filter:combinedFilter})
    return cases.totalItems
 }

const count:number = await reRunCount(userId,groupId)

</script>

<template>
    <p class="text-lg text-center">This is a testpage</p>
    <p>How many cases for user? {{ count }}</p>
</template>

