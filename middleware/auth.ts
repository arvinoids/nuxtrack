
export default defineNuxtRouteMiddleware((to, from) => {
  const pb = useNuxtApp().$pb
  const auth = useAuth()
  if(pb.authStore.isValid) auth.value.isAuthenticated = true
    else auth.value.isAuthenticated = false
  if (!auth.value.isAuthenticated) {
    return navigateTo('/Login')
  }
})