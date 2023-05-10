import { ethers } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
import { MARKETPLACE_CONTRACT_ADDRESS } from 'utils/address'
import { useAccount, useSigner } from 'wagmi'
import marketplaceabi from 'utils/abi/marketplace.json'
import { IContractType, IMarketplaceStatus, ISaleType } from 'constants/types'
import { formatEther } from 'helpers/formatters'
import OnSaleFixedCard from './components/OnSaleFixedCard'
import OnSaleAuctionCard from './components/OnSaleAuctionCard'

const OnSaleNfts = () => {
  const [data, setData] = useState<any[]>([])
  const { data: signerData } = useSigner()
  const { address } = useAccount()

  const getData = useCallback(async () => {
    try {
      if (!address || !signerData) return

      const marketplaceContract = new ethers.Contract(
        MARKETPLACE_CONTRACT_ADDRESS,
        marketplaceabi,
        signerData as any,
      )

      const totalConductedAuctionIds =
        await marketplaceContract.conductedAuctions(address)

      console.log(totalConductedAuctionIds.map((f: any) => f.toString()))
      const result = await Promise.all(
        totalConductedAuctionIds
          .map((i: any) => i.toString())
          .map(async (id: string) => {
            const auctionInfo = await marketplaceContract.auctionInfo(id)

            return {
              auctionId: id.toString(),
              contractAddress: marketplaceContract.address,
              tokenId: auctionInfo.tokenId.toString(),
              owner: auctionInfo.auctioner,
              heighestBidder: auctionInfo.highestBidder,
              heighestBid: formatEther(auctionInfo.highestBid.toString()),
              saleType:
                auctionInfo.saleType.toString() === '0'
                  ? ISaleType.AUCTION
                  : ISaleType.FIXED_SALE,
              status:
                auctionInfo.status.toString() === '0'
                  ? IMarketplaceStatus.LIVE
                  : IMarketplaceStatus.FINISHED,
              start: Number(auctionInfo.start.toString()) * 1000,
              end: Number(auctionInfo.end.toString()) * 1000,
              prevBidAmounts: auctionInfo.prevBidAmounts,
              prevBidders: auctionInfo.prevBidders,
              tokenAddress: auctionInfo.tokenaddress,
              contractType: IContractType.ERC721,
              // ...tokenDetails,
              erc721TokenAddress: auctionInfo.tokencontract,
            }
          }),
      )

      setData(result.filter((f) => f.status !== IMarketplaceStatus.FINISHED))
      console.log(
        result.filter((f) => f.status !== IMarketplaceStatus.FINISHED),
      )
    } catch (error) {
      console.log(error)
    }
  }, [address, signerData])

  console.log(data)
  useEffect(() => {
    getData()
  }, [getData])

  return (
    <div className="card_wrapper">
      {data.map((f, i) => (
        <>
          {f.saleType === 'FIXED_SALE' && (
            <OnSaleFixedCard
              key={i}
              auctionId={f.auctionId}
              heighestBid={f.heighestBid}
              tokenId={f.tokenId}
              tokenaddress={f.tokenAddress}
              owner={f.owner}
              status={f.status}
            />
          )}
          {f.saleType === 'AUCTION' && (
            <OnSaleAuctionCard
              key={i}
              auctionId={f.auctionId}
              heighestBid={f.heighestBid}
              tokenId={f.tokenId}
              tokenaddress={f.tokenAddress}
              owner={f.owner}
              status={f.status}
              endTime={f.end}
            />
          )}
        </>
      ))}
    </div>
  )
}

export default OnSaleNfts
