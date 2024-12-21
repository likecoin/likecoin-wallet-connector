import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { UseWagmiPlugin } from 'use-wagmi'
import { defineNuxtPlugin } from "@nuxt/bridge/dist"
import { config } from '../utils/wagmi/config'

const queryClient = new QueryClient()

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp
    .use(UseWagmiPlugin, { config })
    .use(VueQueryPlugin, { queryClient })
})