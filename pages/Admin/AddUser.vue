<template>
  <div class="flex flex-col items-center gap-2">
    <h1 class="text-lg text-center">Add User</h1>
    <div class="flex flex-row border m-2 p-5 shadow-md w-full gap-10 flex-wrap">
      <VForm action="submit" class="flex flex-col gap-4 w-[300px]">
        <div class="flex flex-col">
          <label for="name" class="label">Name: </label>
          <VField
            type="text"
            name="name"
            class="input input-bordered input-sm"
            placeholder="Full Name"
            v-model="fullname"
            :rules="{ required: true, min: 3 }"
          />
          <VErrorMessage name="name" class="alert alert-error" />
        </div>
        <div class="flex flex-col">
          <label for="username" class="label">Username: </label>
          <VField
            type="text"
            class="input input-bordered input-sm"
            placeholder="username"
            name="username"
            v-model="username"
            :rules="{ required: true }"
          />
          <VErrorMessage name="username" class="alert alert-error" />
        </div>
        <div class="flex flex-col">
          <label for="email" class="label">Email: </label>
          <VField
            type="text"
            class="input input-bordered input-sm"
            placeholder="example@lexmark.com"
            v-model="email"
            name="email"
            :rules="{ required: true, email }"
          />
          <VErrorMessage name="email" class="alert alert-error" />
        </div>
        <div class="flex flex-col">
          <label for="password" class="label">Password: </label>
          <VField
            type="password"
            class="input input-bordered input-sm"
            placeholder="password"
            v-model="password"
            name="password"
            :rules="{ required: true, min: 8 }"
          />
          <VErrorMessage name="password" class="alert alert-error" />
          <label for="confirm" class="label">Confirm password: </label>
          <VField
            type="password"
            class="input input-bordered input-sm"
            placeholder="confirm"
            v-model="passwordConfirm"
            name="confirmation"
            rules="confirmed:@password"
          />
          <VErrorMessage name="confirmation" class="alert alert-error" />
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
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label">Role</span>
          </label>
          <select class="select select-bordered select-sm" v-model="role">
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="lead">lead</option>
          </select>
        </div>
        <div class="flex justify-center">
          <ValidatedButton @click.prevent="addUser" class="btn btn-primary w-min"
            >Submit</ValidatedButton
          >
        </div>
      </VForm>
      <div class="flex flex-col items-stretch">
        <div class="border p-5 w-[300px] flex-grow bg-base-100">
          <h5 class="font-semibold">Please note:</h5>
          <ul class="text-accent mt-2">
            <li>Username should match the user's corporate shortname.</li>
            <li>Email address should be the user's Lexmark email.</li>
            <li>Password must be 8 characters or longer.</li>
            <li>
              Only users with <strong>admin</strong> or <strong>lead</strong> role can
              edit or delete cases and users.
            </li>
          </ul>
        </div>
        <div class="border alert alert-error items-end" v-if="message">
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { userEntry } from "custom-types";

const pb = useNuxtApp().$pb;
const groups = await pb.collection("groups").getFullList(100, { sort: "+description" });
const message = ref("");
let username: string;
let email: string;
let emailVisibility: boolean = true;
let password: string;
let passwordConfirm: string;
let fullname: string;
let memberOf: string[] = [];
let role: "user" | "admin" = "user";

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
  if (res.status === "success") navigateTo("/Admin/");
  else message.value = res.message;
}
</script>

<style scoped>
ul {
  list-style-type: circle;
  margin-left: 2rem;
}
</style>
