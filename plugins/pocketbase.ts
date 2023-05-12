import PocketBase from 'pocketbase'

export default defineNuxtPlugin(nuxtApp => {
    const cnf = useRuntimeConfig().public
    const client = new PocketBase(cnf.pocketBaseURL)
    client.autoCancellation(false)
    return {
        provide: {
            pb: client
        }
    }
})