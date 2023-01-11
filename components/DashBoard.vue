<template>
    <div>
        <div v-for="group in groups" :key="group" class="flex flex-col rounded-2xl text-center p-4 m-4 w-[200px] shadow-lg bg-gray-100">
            <ProductCard :groupId="group.id" />
        </div>
    </div>
</template>

<script setup>
const app = useNuxtApp().$pb

const groups = await app.collection('groups').getList(1)

</script>