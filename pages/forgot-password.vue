<template>
  <div>
    <div
      class="w-[400px] rounded-lg p-8 text-center border border-white/50 backdrop-blur-[45px] shadow-[0_0_80px_#111111]"
    >
      <form @submit.prevent="resetPassword" class="flex flex-col">
        <h2 class="text-2xl mb-5 text-white">Reset Password</h2>

        <div
          v-if="message"
          :class="{
            'bg-red-500/20 border border-red-500/50 text-red-100': messageType === 'error',
            'bg-green-500/20 border border-green-500/50 text-green-100': messageType === 'success'
          }"
          class="px-4 py-2 rounded mb-4 text-sm"
        >
          {{ message }}
        </div>

        <div class="input-field">
          <input type="email" required v-model="email" />
          <label>Enter your email</label>
          <div v-if="emailError" class="text-xs text-red-400 mt-1 text-left">
            {{ emailError }}
          </div>
        </div>

        <div class="mt-6">
          <button
            type="submit"
            class="bg-[#d40e2a] text-white font-medium py-3 px-5 cursor-pointer rounded-[1px] text-base border border-transparent transition-all duration-300 ease-in-out hover:text-white hover:border-white hover:bg-white/15 w-full"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm mr-2"></span>
            Send Reset Link
          </button>
        </div>

        <div class="flex items-center justify-center my-[25px] text-white">
          <NuxtLink
            to="/login"
            class="text-[#efefef] no-underline hover:underline"
          >
            Back to Login
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "login",
});

const email = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('')
const emailError = ref('')
const pb = useNuxtApp().$pb;

function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

async function resetPassword() {
  loading.value = true
  message.value = ''
  emailError.value = ''
  
  if (!validateEmail(email.value)) {
    emailError.value = 'Please enter a valid email address'
    loading.value = false
    return
  }
  
  try {
    await pb.collection('users').requestPasswordReset(email.value);
    message.value = 'Password reset link sent to your email'
    messageType.value = 'success'
  } catch (error: any) {
    message.value = error.message || 'Failed to send reset link. Please try again.'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.input-field {
  position: relative;
  border-bottom: 2px solid #ccc;
  margin: 15px 0;
}

.input-field label {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  color: #fff;
  font-size: 16px;
  pointer-events: none;
  transition: 0.15s ease;
}

.input-field input {
  width: 100%;
  height: 40px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
  color: #fff;
}

.input-field input:focus ~ label,
.input-field input:valid ~ label {
  font-size: 0.8rem;
  top: 10px;
  transform: translateY(-120%);
}
</style>