import { http, createConfig } from 'use-wagmi'
import { optimism, optimismSepolia } from 'use-wagmi/chains'
import { injected } from 'use-wagmi/connectors'

export const config = createConfig({
  chains: [optimism, optimismSepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [optimism.id]: http(),
    [optimismSepolia.id]: http(),
  },
})