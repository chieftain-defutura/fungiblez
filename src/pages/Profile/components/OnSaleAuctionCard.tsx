import { LazyImage } from 'components'
import { ethers } from 'ethers'
import { useTransactionModal } from 'hooks'
import React from 'react'
import { MARKETPLACE_CONTRACT_ADDRESS } from 'utils/address'
import MarketplaceABI from '../../../utils/abi/marketplace.json'
import { useAccount, useSigner } from 'wagmi'
import OnSaleCountDown from './OnSaleCountDown'

interface IAuction {
  auctionId: string
  heighestBid: string
  tokenId: string
  tokenaddress: string
  owner: string
  status: string
  endTime: string
}

const OnSaleAuctionCard: React.FC<IAuction> = ({
  tokenId,
  heighestBid,
  auctionId,
  endTime,
}) => {
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const { setTransaction } = useTransactionModal()

  const handleFinishAuction = async () => {
    if (!address || !signerData) return

    try {
      setTransaction({ loading: true, status: 'pending' })

      const contract = new ethers.Contract(
        MARKETPLACE_CONTRACT_ADDRESS,
        MarketplaceABI,
        signerData as any,
      )

      const tx = await contract.finishAuction(auctionId)
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

  const handleRemoveSale = async () => {
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
              Token Id #<b>{tokenId}</b>
            </p>
            <p>price: {heighestBid}</p>
            <OnSaleCountDown
              handleFinishAuction={handleFinishAuction}
              handleRemoveSale={handleRemoveSale}
              endTime={endTime}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnSaleAuctionCard
