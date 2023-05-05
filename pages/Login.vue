<template>
  <div class="h-screen">
    <form @submit.prevent="login()">
      <div class="flex flex-row justify-center">
        <h3 class="justify-center">
          <a href="https://www.lexmark.com" target="_blank">
            <img src="/lxk-logo-2x.svg" alt="Lexmark" class="w-[300px]" />
          </a>
        </h3>
      </div>

      <label for="username" class="formlabel">Username</label>
      <input
        type="text"
        placeholder="shortname"
        id="username"
        class="text-center formlabel"
        v-model="username"
      />

      <label for="password" class="formlabel">Password</label>
      <input
        type="password"
        placeholder="password"
        id="password"
        class="text-center formlabel"
        v-model="password"
      />

      <div class="flex flex-col items-center h-4/5">
        <button class="btn-hover color-1 formlabel">Log In</button>
        <div v-if="message" class="">
          <div class="border p-3 border-base-300">
            <p class="text-error text-center text-sm">{{ message }}</p>
          </div>
        </div>
        <div class="mt-auto">
          <Footer />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "fullscreen",
});

let username = "";
let password = "";
let message = ref("");
const authenticated = useAuth();
const loggedInUser = useLoggedInUsername();

const pb = useNuxtApp().$pb;
async function login() {
  try {
    const authData = await pb.collection("users").authWithPassword(username, password);
    authenticated.value.isAuthenticated = pb.authStore.isValid;
    authenticated.value.role = authData.record.role;
    loggedInUser.value = pb.authStore.model!.username;
    navigateTo("/");
  } catch (error: any) {
    message.value = error.message;
  }
}
</script>

<style scoped>
*:before,
*:after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

form {
  height: 100%;
  width: 400px;
  background-color: rgba(126, 126, 126, 0.13);
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  right: -200px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
  padding: 200px 35px;
}

.formlabel {
  font-family: "Inter", sans-serif;
  @apply text-gray-50;
}

form h3 {
  font-size: 32px;
  font-weight: 500;
  line-height: 42px;
  text-align: center;
}

label {
  display: block;
  margin-top: 30px;
  font-size: 16px;
  font-weight: 500;
}

input {
  display: block;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.07);
  padding: 0 10px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 300;
}

::placeholder {
  color: #e5e5e5;
}

button {
  margin-top: 50px;
  width: 100%;
  background-color: #ffffff;
  color: #080710;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
}

img {
  border-radius: 4px;
  padding: 5px;
  width: 250px;
}

.btn-hover {
  width: 200px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  margin: 20px;
  height: 55px;
  text-align: center;
  border: none;
  background-size: 300% 100%;

  -o-transition: all 0.4s ease-in-out;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}

.btn-hover:hover {
  background-position: 100% 0;

  -o-transition: all 0.4s ease-in-out;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}

.btn-hover:focus {
  outline: none;
}

.btn-hover.color-1 {
  background-image: linear-gradient(to right, #006446, #3af23a, #00c425, #008a44);
  box-shadow: 0 4px 15px 0 rgba(49, 196, 190, 0.75);
}
</style>
