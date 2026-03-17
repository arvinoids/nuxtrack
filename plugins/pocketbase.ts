import PocketBase, { LocalAuthStore } from 'pocketbase'
import type { TypedPocketBase } from '~/pocketbase-types'

export default defineNuxtPlugin(nuxtApp => {
    const cnf = useRuntimeConfig().public
    const client:TypedPocketBase = new PocketBase(cnf.pocketBaseURL, new LocalAuthStore(cnf.pbStorage))
    client.autoCancellation(false)
    return {
        provide: {
            pb: client
        }
    }
})