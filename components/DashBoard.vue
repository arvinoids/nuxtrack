<template>
        <div v-for="group in groups" :key="group.id" class="flex flex-row flex-wrap">
             <ProductCard :groupId="group.id" />
        </div>
</template>

<script setup>
    const app = useNuxtApp().$pb
    const groups = (await app.collection('groups').getList(1,100,{ sort: '+description'})).items
</script>