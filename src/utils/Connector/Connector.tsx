import { w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createClient } from 'wagmi'
export const mantel = {
  id: 5001,
  name: 'Mantle Testnet',
  network: 'Mantle Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Mantle Testnet',
    symbol: 'BIT',
  },
  rpcUrls: {
    public: { http: ['https://rpc.testnet.mantle.xyz'] },
    default: { http: ['https://rpc.testnet.mantle.xyz'] },
  },
  blockExplorers: {
    etherscan: {
      name: 'SnowTrace',
      url: 'https://explorer.testnet.mantle.xyz',
    },
    default: { name: 'SnowTrace', url: 'https://explorer.testnet.mantle.xyz' },
  },
  // contracts: {
  //   multicall3: {
  //     address: '0xca11bde05977b3631167028862be2a173976ca11',
  //     blockCreated: 11_907_934,
  //   },
  // },
} as const
// export const local = {
//   id: 31337,
//   name: 'Mantle Testnet',
//   network: 'Mantle Testnet',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'Mantle Testnet',
//     symbol: 'BIT',
//   },
//   rpcUrls: {
//     public: { http: ['http://127.0.0.1:8545'] },
//     default: { http: ['http://127.0.0.1:8545'] },
//   },
//   blockExplorers: {
//     etherscan: {
//       name: 'SnowTrace',
//       url: 'https://explorer.testnet.mantle.xyz',
//     },
//     default: { name: 'SnowTrace', url: 'https://explorer.testnet.mantle.xyz' },
//   },
//   // contracts: {
//   //   multicall3: {
//   //     address: '0xca11bde05977b3631167028862be2a173976ca11',
//   //     blockCreated: 11_907_934,
//   //   },
//   // },
// } as const

export const chains = [mantel]
export const projectId = 'bf9397e41bf0ab99a492296a2957db54'

const { provider } = configureChains(chains, [w3mProvider({ projectId })])
export const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
})
