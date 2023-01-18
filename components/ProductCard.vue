<template>
    <div class="flex flex-col rounded-2xl text-center p-4 m-4 w-[200px] shadow-lg bg-gray-100">
        <h2 class="font-semibold mb-3 text-green-700">{{ group.description }}</h2>
        <div v-if="users.length">
            <div v-for="(user, index) in users" :key="user">
                <div class="text-sm" :class="{ 'next': index === 0 }" >
                    {{ user.expand.user.fullname }}
                    {{ user.count }}
                </div>
            </div>
        </div>
        <div v-else class="text-xs">
            <div v-for="user in users" :key="user">
            {{ user.fullname }}
            </div>
        </div>
        <div class="flex flex-col flex-grow mt-3">
            <div class="btn btn-sm btn-success mt-auto w-20 self-center">{{ select }}</div>
        </div>
    </div>

</template>

<script setup>
const app = useNuxtApp().$pb
const props = defineProps({ groupId: String })

const groupFilter = `memberOf~"${props.groupId}"`
const select = "Select"
const counterFilter = `group~"${props.groupId}"`

let group = await app.collection('groups').getOne(props.groupId)

let users = await app.collection('counter').getList(1,100,{ filter: counterFilter, '$autoCancel': false, expand: 'user', sort: '+count' })
if (users.length!=0) {  users = users.items;  }
else {
    let res = await app.collection('users').getList(1,100,{ filter: groupFilter, '$autoCancel': false, })
    users = res
}

</script>

<style>
.next {
    @apply text-green-900 font-semibold
}
</style>