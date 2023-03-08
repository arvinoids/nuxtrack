export default defineNuxtRouteMiddleware((to,from) => {
    const pb = useNuxtApp().$pb
    const role = ref(pb.authStore.model!.role)
    if(role.value!=='admin') { 
      navigateTo('/Login')
    } 
  });