<template>
  <div class="container">
    <ul>
      <li v-for="user in users.items">
        <div @click="setUser(user.id)">{{ user.fullname }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ListResult } from 'pocketbase';

const props = defineProps<{
  group?: string,
  users:ListResult
}>();
const user = useSelector();

let users = await useGetUsers(props.group);
async function setUser(id: string) {
  user.value.user = id;
}
</script>

<style></style>
