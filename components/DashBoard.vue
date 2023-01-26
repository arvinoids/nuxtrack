<template>
        <h1 class="text-2xl font-bold text-primary text-start">
            Hello, {{ name }}
        </h1>
        <div class="flex flex-row flex-wrap p-2 w-full justify-center items-stretch">
            <div v-for="group in groups" :key="group.id" class="shadow-lg m-3 rounded-2xl bg-gray-100 flex items-stretch">
                 <ProductCard :groupId="group.id" class="flex-grow"
                 />
            </div>
        </div>
</template>

<script setup>
    const pb = useNuxtApp().$pb
    const groups = (await pb.collection('groups').getList(1,100,{ sort: '+order'})).items
    const name = pb.authStore.model.fullname.split(' ')[0]
</script>