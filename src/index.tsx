import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WagmiConfig } from 'wagmi'
import { SkeletonTheme } from 'react-loading-skeleton'
import { Buffer } from 'buffer'
import { Web3Modal } from '@web3modal/react'
import { wagmiClient, chains, projectId } from './utils/Connector/Connector'
import { EthereumClient } from '@web3modal/ethereum'
import './index.scss'
import App from './App'
import Provider from './store/provider'
import 'react-loading-skeleton/dist/skeleton.css'

const ethereumClient = new EthereumClient(wagmiClient, chains)

window.Buffer = Buffer
//eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <WagmiConfig client={wagmiClient}>
        <Provider>
          <SkeletonTheme baseColor="#343741" highlightColor="#272a34">
            <App />
          </SkeletonTheme>
        </Provider>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </BrowserRouter>
  </React.StrictMode>,
)
