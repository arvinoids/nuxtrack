<template>
    <div>
        <div class="flex flex-row flex-wrap">
            <div class="flex flex-col rounded-2xl text-center p-4 m-4 w-[200px] shadow-lg bg-gray-100">
                <h2 class="font-semibold mb-3">{{ group.description }}</h2>                
                    <div v-for="user in users" :key="user">
                        <div class="text-sm">
                                {{ user.fullname }} 
                        </div>
                    </div>
                    <div class="flex flex-col flex-grow mt-3">
                        <div class="btn btn-sm btn-success mt-auto w-20 self-center">{{ select }}</div>
                    </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const app = useNuxtApp().$pb
const props = defineProps({
    groupId: String
})
const groupFilter:String = 'memberOf~'+props.groupId

const group = await app.collection('groups').getOne(props.groupId)
const users = await app.collection('users').getList(1,100,{filter:groupFilter})

const select = "Select"

</script>