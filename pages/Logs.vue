<template>
  <table class="table table-compact table-zebra shadow-md">
    <thead>
      <th>User</th>
      <th>Transaction</th>
      <th>Details</th>
    </thead>
    <tbody>
      <tr v-for="log in logs">
        <td class="rounded-none">{{ log.user }}</td>
        <td>{{ log.type }}</td>
        <td class="rounded-none">{{ log.details }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;
const logs = await pb.collection("logs").getFullList(1000, { sort: "-created" });
</script>

<style></style>
