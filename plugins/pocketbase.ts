import PocketBase, { LocalAuthStore } from 'pocketbase'

export default defineNuxtPlugin(nuxtApp => {
    const cnf = useRuntimeConfig().public
    const client = new PocketBase(cnf.pocketBaseURL, new LocalAuthStore(cnf.pbStorage))
    client.autoCancellation(false)
    return {
        provide: {
            pb: client
        }
    }
})