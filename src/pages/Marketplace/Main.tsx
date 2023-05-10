import React, { useEffect, useCallback, useState } from 'react'
import { IContractType, IMarketplaceStatus, ISaleType } from 'constants/types'
import { formatEther } from 'helpers/formatters'
import AuctionCard from './component/AuctionCard'
import FixedCard from './component/FixedCard'
import { CardLoader } from 'components'
import { useAccount, useSigner } from 'wagmi'
import { MARKETPLACE_CONTRACT_ADDRESS } from 'utils/address'
import marketplaceabi from 'utils/abi/marketplace.json'
import { ethers } from 'ethers'

interface IMarketplaceMainProps {
  selectedFilter: string | null
  searchInput: string
}

const Main: React.FC<IMarketplaceMainProps> = ({
  selectedFilter,
  searchInput,
}) => {
  const { data: signerData } = useSigner()
  const { address } = useAccount()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any[]>([])
  const getData = useCallback(async () => {
    try {
      if (!address || !signerData) return

      setLoading(true)
      const marketplaceContract = new ethers.Contract(
        MARKETPLACE_CONTRACT_ADDRESS,
        marketplaceabi,
        signerData as any,
      )

      const totalAuctionIds = Number(
        (await marketplaceContract.totalAuction()).toString(),
      )

      const result = await Promise.all(
        Array.from({ length: totalAuctionIds }).map(async (_, id) => {
          const auctionInfo = await marketplaceContract.auctionInfo(id)
          // const tokenDetails = await getTokenDetails(
          //   address,
          //   signerData,
          //   auctionInfo.tokenaddress,
          // );
          console.log(auctionInfo.end.toString())
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

      console.log(result)
      setData(result.filter((f) => f.status !== IMarketplaceStatus.FINISHED))
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [address, signerData])

  console.log(data)
  useEffect(() => {
    getData()
  }, [getData])

  if (loading) {
    return <CardLoader />
  }

  if (data && !data.length) {
    return <div className="loader">No Data</div>
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
      }}
    >
      {data.map((f, i) => (
        <>
          {f.saleType === 'FIXED_SALE' && (
            <FixedCard
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
            <AuctionCard
              key={i}
              auctionId={f.auctionId}
              heighestBid={f.heighestBid}
              tokenId={f.tokenId}
              tokenaddress={f.tokenAddress}
              owner={f.owner}
              endTime={f.end}
              status={f.status}
            />
          )}
        </>
      ))}
    </div>
  )
}

export default Main
