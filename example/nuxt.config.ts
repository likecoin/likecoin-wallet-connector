import path from 'path'
import { defineNuxtConfig } from '@nuxt/bridge'

export default defineNuxtConfig({
  bridge: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'LikeCoin Wallet Connector Example',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '../dist/style.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/textEncoder' },
    { src: '~/plugins/wagmi' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/vuetify',
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      })
      config.resolve.alias['node:crypto'] = path.join(__dirname, './node_modules/crypto-browserify');
    },
    babel: {
      presets: [[
        '@nuxt/babel-preset-app',
        {
          corejs: { version: 3 },
          exclude: ['transform-exponentiation-operator']
        }
      ]],
      plugins: [
        '@babel/plugin-transform-nullish-coalescing-operator',
        '@babel/plugin-proposal-numeric-separator',
      ],
    },
    transpile: [
      '@cosmjs',
      '@metamask',
      '@tanstack/query-core',
      '@tanstack/vue-query',
      '@wagmi',
      '@walletconnect',
      '@web3modal',
      'abitype',
      'ethers',
      'eth-block-tracker',
      'use-wagmi',
      'unstorage',
      'superstruct',
      'viem',
      '@noble/curves',
    ],
  }
})
