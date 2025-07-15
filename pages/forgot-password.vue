<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content flex-col lg:flex-row-reverse">
      <div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form class="card-body" @submit.prevent="resetPassword">
          <h1 class="text-2xl font-bold text-center mb-4">Reset Password</h1>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input type="email" v-model="email" placeholder="Enter your email" class="input input-bordered" required />
          </div>
          <div class="form-control mt-6">
            <button class="btn btn-primary" type="submit" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              Send Reset Link
            </button>
          </div>
          <div class="text-center mt-4">
            <NuxtLink to="/login" class="link link-primary text-sm">Back to Login</NuxtLink>
          </div>
          <div v-if="message" class="text-center mt-2 text-sm" :class="messageType === 'success' ? 'text-success' : 'text-error'">
            {{ message }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const email = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('')

async function resetPassword() {
  loading.value = true
  message.value = ''
  
  try {
    // Replace with your actual password reset logic
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { email: email.value }
    })
    
    message.value = 'Password reset link sent to your email'
    messageType.value = 'success'
  } catch (error) {
    message.value = 'Failed to send reset link. Please try again.'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>