<template>
  <div class="flex flex-col items-center gap-2">
    <h1 class="text-lg text-center">Editing user {{}}</h1>
    <div class="flex flex-row border m-2 p-5 shadow-md w-full gap-10 flex-wrap">
      <VForm action="submit" class="flex flex-col gap-4 w-[300px]">
        <div class="flex flex-col">
          <label for="username" class="label">Username: </label>
          <input
            type="text"
            class="input input-bordered input-sm"
            name="username"
            v-model="username"
            disabled
          />
        </div>
        <div class="flex flex-col">
          <label for="name" class="label">Name: </label>
          <VField
            type="text"
            name="name"
            class="input input-bordered input-sm"
            v-model="fullname"
            :rules="{ required: true, min: 3 }"
          />
          <VErrorMessage name="name" class="alert alert-error" />
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
          </select>
        </div>
        <div class="flex justify-center">
          <ValidatedButton @click.prevent="updateUser" class="btn btn-primary w-min"
            >Update</ValidatedButton
          >
        </div>
      </VForm>
      <div class="flex flex-col items-stretch">
        <div class="border p-5 w-[300px] flex-grow bg-base-100">
          <h5 class="font-semibold">Please note:</h5>
          <ul class="text-accent mt-2">
            <li>Username should match the user's corporate shortname.</li>
            <li>Email address should be the user's Lexmark email.</li>
            <li>
              Only users with <strong>admin</strong> or <strong>lead</strong> role can
              edit or delete cases and users.
            </li>
          </ul>
          <p class="funt-semibold">To select multiple groups, hold down shift</p>
        </div>
        <div class="border alert alert-error items-end" v-if="message">
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const username = useRoute().params.username;
const pb = useNuxtApp().$pb;
const groups = await pb.collection("groups").getFullList(100, { sort: "+description" });
const user = await pb.collection("users").getFirstListItem(`username="${username}"`);
const message = ref("");
let email = user.email;
let fullname = user.fullname;
let memberOf: string[] = user.memberOf;
let role: "user" | "admin" | "lead" = user.role;

async function updateUser() {
  const data = {
    email,
    fullname,
    memberOf,
    role,
  };
  const res = await useUpdateUser(user.id, data);
  useShowToast(res.message, res.status);
  if (res.status === "success") navigateTo("/Admin/Users");
  else message.value = res.message;
}
</script>

<style scoped>
ul {
  list-style-type: circle;
  margin-left: 2rem;
}
</style>
