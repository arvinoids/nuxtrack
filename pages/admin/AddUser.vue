<template>
  <div class="flex flex-col items-center gap-2">
    <h1 class="text-lg text-center">Add User</h1>
    <div class="border m-2v p-2">
      <form action="submit flex flex-col">
        <label for="name">Name: </label>
        <input type="text" class="input" placeholder="username" />
        <label for="username">Username: </label>
        <input type="text" class="input" placeholder="username" />
        <label for="email">Email: </label>
        <input type="text" class="input" placeholder="email" />
        <label for="password">Password: </label>
        <input type="password" class="input" placeholder="password" />
        <label for="confirm">Confirm password: </label>
        <input type="password" class="input" placeholder="confirm" />
      </form>
    </div>
    <p>This is the adduser page...</p>
  </div>
</template>

<script setup lang="ts"></script>

<style></style>
