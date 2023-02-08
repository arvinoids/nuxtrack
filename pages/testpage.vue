

<script setup lang="ts">
// CounterCreator
// 1) open the user
// 2) get the groups where the user belongs
// 3) create a counter for each of the groups

const pb = useNuxtApp().$pb
pb.autoCancellation(false);


const users = await pb.collection('users').getList(1,100,{ '$autoCancel': false, })
const cases = await pb.collection('cases').getList(1,100,{ '$autoCancel': false, })
const groupId = "zp81nluzd17f2tt"
let listItems:any = []

async function createCurrentList(groupId:string) {
//     1) Query the counter, filter by group, sort by count in ascending then by username
    const queryFilter = 'group="'+groupId+'"'
    const list = await pb.collection('counter').getList(1,500,{ filter:queryFilter, sort: '+count','$autoCancel': false })
// 2) create list and assign order
    listItems = list.items
    listItems.forEach(async (item: any, i:number) => {        
        try {
            let data = { "user":item.user,"group":groupId,"count":item.count,"order":i+1 }
            await pb.collection('currentlist').create(data)
        } catch(e) { console.log(e) }
    });
 }

await createCurrentList(groupId)
</script>

<template>
    <p class="text-lg text-center">This is a testpage</p>
    <p class="text-center" v-for="item in listItems">{{ item.count }}</p>
</template>

