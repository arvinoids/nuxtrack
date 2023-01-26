<template class="test">
    <div class="flex flex-col rounded-2xl text-center p-4 m-2 w-[200px]">
        <h2 class="font-semibold mb-3 text-green-700">{{ group.description }}</h2>
        <div v-if="users.length">
            <div v-for="(user, id) in users" :key="id">
                <div class="text-sm" :class="{ 'next': id === 0 }" >
                    {{ user.expand.user.fullname }}
                </div>
            </div>
        </div>
        <div v-else class="text-xs">
            <div v-for="item in users" :key="item+1">
            {{ item.fullname }}
            </div>
        </div>
        <div class="flex flex-col flex-grow mt-3">
            <a class="btn btn-sm btn-success mt-auto w-20 self-center" :href="anchor">{{ select }}</a>
        </div>
        <AddCase :groupId = props.groupId :groupDescription="group.description" :nextUserId="nextUserId" :nextUserName="nextUserName"/>
    </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb
const props = defineProps({ groupId: String })
const anchor:string = '#'+props.groupId

const groupFilter = `memberOf~"${props.groupId}"`
const select = "Select"
const counterFilter = `group~"${props.groupId}"`
const group = await pb.collection('groups').getOne(props.groupId)

//useCreateGroupList(props.groupId)

let users = await pb.collection('counter').getList(1,100,{ filter: counterFilter, '$autoCancel': false, expand: 'user', sort: '+count' })
if (users.length!=0) {  users = users.items;  }
else {
    users = await pb.collection('users').getList(1,100,{ filter: groupFilter, '$autoCancel': false, })
}

const nextUserId = users[0].expand.user.id
const nextUserName = users[0].expand.user.fullname


</script>

<style>
.next {
    @apply text-pink-500 font-semibold my-2
}
</style>