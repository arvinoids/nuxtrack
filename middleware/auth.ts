export default defineNuxtRouteMiddleware((to, from) => {
    const app = useNuxtApp().$pb
    console.log(from)
    console.log(to)
    const isAuthenticated: boolean = app.authStore.isValid
    if (!isAuthenticated) {
      return navigateTo('/Login')
    }
  })
  