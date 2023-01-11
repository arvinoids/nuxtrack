import PocketBase from 'pocketbase'

export default defineNuxtPlugin(nuxtApp => {
    const cnf = useRuntimeConfig().public
    const client = new PocketBase(cnf.pocketBaseURL)
    nuxtApp.provide("pb", client)
})