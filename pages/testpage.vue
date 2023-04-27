<template>
  <div>
    <button class="btn btn-secondary" @click="sendMail()">Send Email</button>
  </div>
</template>

<script setup lang="ts">
const email = {
  to: "amagaway@lexmark.com",
  subject: "Hello from Rotation Tracker",
  body: "This is a test email from Rotation Tracker Nuxt 3 project",
};
async function sendMail() {
  const res = await useSendEmail(email);
  useShowToast(res.message, res.status);
  console.log(res);
}
</script>

<style></style>
