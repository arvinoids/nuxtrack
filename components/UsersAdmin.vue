<template>
  <div>
    <table class="table table-zebra table-compact shadow-md">
      <thead>
        <tr>
          <th class="rounded-none">Name</th>
          <th>Username</th>
          <th>Group</th>
          <th>Created</th>
          <th class="rounded-none">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users">
          <td>{{ user.fullname }}</td>
          <td>{{ user.username }}</td>
          <td>
            <span v-for="group in user.expand.memberOf">
              <p>{{ group.description }}</p>
            </span>
          </td>
          <td>{{ useFormatDate(new Date(user.created)) }}</td>
          <td>Actions Here</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const pb = useNuxtApp().$pb;

const users = await pb
  .collection("users")
  .getFullList(1000, { sort: "+username", expand: "memberOf" });

const groups = await pb.collection("groups").getFullList(100);
</script>

<style></style>
