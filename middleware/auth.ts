
export default defineNuxtRouteMiddleware( async (to, from) => {
  const pb = useNuxtApp().$pb
  const auth = useAuth()
  try{
      await pb.collection('users').authRefresh()
      console.log('authStore is valid.')
      auth.value.isAuthenticated = true
      auth.value.role = pb.authStore.model!.role
  }
  catch {
    console.log('authStore is invalid.')
    auth.value.isAuthenticated = false
    return navigateTo('/Login')
  }
  if(pb.authStore.isValid)
  if (!auth.value.isAuthenticated) {
    return navigateTo('/Login')
  }
})