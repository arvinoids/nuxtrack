<template>
  <div class="flex flex-col items-center">
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
          <td>
            <label :for="`delete-${user.id}`" class="btn btn-sm btn-warning"
              >Delete</label
            >
            <DeleteUser :id="user.id" :username="user.username" />
          </td>
        </tr>
      </tbody>
    </table>
    <label for="adduser" class="btn my-3">Add User</label>
    <AddUser />
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
