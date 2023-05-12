import { Button, LazyImage } from 'components'
import { ethers } from 'ethers'
import { useTransactionModal } from 'hooks'
import React from 'react'
import { MARKETPLACE_CONTRACT_ADDRESS } from 'utils/address'
import MarketplaceABI from '../../../utils/abi/marketplace.json'
import { useAccount, useSigner } from 'wagmi'
import TokenAbi from '../../../utils/abi/token.json'

interface IData {
  auctionId: string
  heighestBid: string
  tokenId: string
  tokenaddress: string
  owner: string
  status: string
}
const FixedCard: React.FC<IData> = ({
  tokenaddress,
  tokenId,
  heighestBid,
  auctionId,
  owner,
  status,
}) => {
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const { setTransaction } = useTransactionModal()

  const handleSale = async () => {
    if (!address || !signerData) return

    try {
      setTransaction({ loading: true, status: 'pending' })
      const erc20Contract = new ethers.Contract(
        tokenaddress,
        TokenAbi,
        signerData as any,
      )

      const allowance = Number(
        (
          await erc20Contract.allowance(address, MARKETPLACE_CONTRACT_ADDRESS)
        ).toString(),
      )
      console.log(allowance)
      if (allowance <= 0) {
        const tx = await erc20Contract.approve(
          MARKETPLACE_CONTRACT_ADDRESS,
          ethers.constants.MaxUint256,
        )
        await tx.wait()
      }

      const contract = new ethers.Contract(
        MARKETPLACE_CONTRACT_ADDRESS,
        MarketplaceABI,
        signerData as any,
      )

      const tx = await contract.finishFixedSale(auctionId)
      await tx.wait()
      console.log('saled')
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
          {address?.toLowerCase() !== owner.toLowerCase() && (
            <Button onClick={handleSale}>Buy</Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FixedCard
