<template>
    <div class="overflow-x-auto">
        <table class="table table-compact w-full">
            <thead>
                <tr>
                    <th>Owner</th>
                    <th>Case ID</th>
                    <th>Product Set</th>
                    <th>Assigned By</th>
                    <th>Assigned on</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in cases" :key="item.id">
                    <td>{{item.expand.user.username}}</td>
                    <td>{{item.case}}</td>
                    <td>{{item.expand.group.description}}</td>
                    <td>{{item.assignedBy}}</td>
                    <td>{{item.created}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
    
<script setup lang='ts'>
const props = defineProps<{
    userId?: string
}>()

const record = await getUserCases(props.userId)
const cases = record.items

</script>
    
<style>

</style>