import { Button, LazyImage } from 'components'
import { ethers } from 'ethers'
import { useTransactionModal } from 'hooks'
import React from 'react'
import { MARKETPLACE_CONTRACT_ADDRESS } from 'utils/address'
import MarketplaceABI from '../../../utils/abi/marketplace.json'
import { useAccount, useSigner } from 'wagmi'

interface IData {
  auctionId: any
  heighestBid: any
  tokenId: any
  tokenaddress: any
  owner: string
  status: string
}
const OnSaleFixedCard: React.FC<IData> = ({
  tokenaddress,
  tokenId,
  heighestBid,
  auctionId,
}) => {
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const { setTransaction } = useTransactionModal()
  console.log(tokenaddress)

  const handleRemove = async () => {
    if (!address || !signerData) return

    try {
      setTransaction({ loading: true, status: 'pending' })
      const contract = new ethers.Contract(
        MARKETPLACE_CONTRACT_ADDRESS,
        MarketplaceABI,
        signerData as any,
      )
      const tx = await contract.removeSale(auctionId)
      await tx.wait()
      console.log('added')

      setTransaction({ loading: true, status: 'success' })
    } catch (error) {
      const Error = Array(error).map((f: any) => f.reason)
      const message = Error.toString().split(':')

      setTransaction({
        loading: true,
        status: 'error',
        message: `${message[2]}  `,
      })
    }
  }

  return (
    <div className="nft_card">
      <div className="nft_card-container">
        <div className="nft_card-container_image">
          <LazyImage src="" />
        </div>
        <div className="nft_card-container_content">
          <div>
            <h3 style={{ fontSize: '3.2rem', lineHeight: '3.2rem' }}>name</h3>
          </div>
          <div>
            <p>
              Token address: {tokenaddress?.slice(0, 6)}...
              {tokenaddress?.slice(tokenaddress?.length - 6)}
            </p>
            <p>
              Token Id #<b>{tokenId}</b>
            </p>
            <p>price:{heighestBid}</p>
          </div>
        </div>
        <div className="nft_card-container_controls">
          <Button onClick={handleRemove}>Remove Sale</Button>
        </div>
      </div>
    </div>
  )
}

export default OnSaleFixedCard
