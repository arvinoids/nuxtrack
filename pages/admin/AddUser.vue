<template>
  <div class="flex flex-col items-center gap-2">
    <h1 class="text-lg text-center">Add User</h1>
    <div class="border m-2 p-5">
      <form action="submit" class="flex flex-col gap-4">
        <div class="flex flex-col">
          <label for="name" class="label">Name: </label>
          <input
            type="text"
            class="input input-bordered input-sm"
            placeholder="Full Name"
            v-model="fullname"
          />
        </div>
        <div class="flex flex-col">
          <label for="username" class="label">Username: </label
          ><input
            type="text"
            class="input input-bordered input-sm"
            placeholder="username"
            v-model="username"
          />
        </div>
        <div class="flex flex-col">
          <label for="email" class="label">Email: </label>
          <input
            type="text"
            class="input input-bordered input-sm"
            placeholder="example@lexmark.com"
            v-model="email"
          />
        </div>
        <div class="flex flex-col">
          <label for="password" class="label">Password: </label>
          <input
            type="password"
            class="input input-bordered input-sm"
            placeholder="password"
            v-model="password"
          />
        </div>
        <div class="flex flex-col">
          <label for="confirm" class="label">Confirm password: </label>
          <input
            type="password"
            class="input input-bordered input-sm"
            placeholder="confirm"
            v-model="passwordConfirm"
          />
        </div>
        <div class="flex flex-col form-control">
          <label for="group" class="label">Choose the group(s) for user:</label>
          <select
            name="group"
            class="select select-bordered grow"
            v-model="memberOf"
            multiple
          >
            <option v-for="group in groups" :value="group.id" :key="group.id">
              {{ group.description }}
            </option>
          </select>
        </div>
        <div class="alert" v-if="message">
          <p>{{ message }}</p>
        </div>
        <button @click.prevent="addUser" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userEntry } from "custom-types";

const pb = useNuxtApp().$pb;
const groups = await pb.collection("groups").getFullList(100, { sort: "+description" });
console.log(groups);
const message = ref("Hello");
let username: string;
let email: string;
let emailVisibility: true;
let password: string;
let passwordConfirm: string;
let fullname: string;
let memberOf: string[];
let role: "user" | "admin";

async function addUser() {
  const data: userEntry = {
    username,
    email,
    emailVisibility,
    password,
    passwordConfirm,
    fullname,
    memberOf,
    role,
  };
  const res = await useCreateUser(data);
  useShowToast(res.message, res.status);
  if (res.status === "success") navigateTo("/Admin/index");
  else message.value = res.message;
}
</script>

<style></style>
