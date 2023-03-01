<template>
  <div>
    <table class="table table-zebra table-compact">
      <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Group</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users">
          <td>{{ user.fullname }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.memberOf }}</td>
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
console.log(users);

const groups = await pb.collection("groups").getFullList(100);

async function groupNameOf(id:string) {

}

async function getGroups(membership:string[]){
    const delimiter = ', '
    membership.forEach(groupNameOf(item)){
        
    }
    return groups
}
</script>

<style></style>
