import React, { useEffect, useCallback, useState } from 'react'
import { IContractType, IMarketplaceStatus, ISaleType } from 'constants/types'
import { formatEther } from 'helpers/formatters'
import AuctionCard from './component/AuctionCard'
import FixedCard from './component/FixedCard'
import { CardLoader } from 'components'
import { useAccount, useSigner } from 'wagmi'

import NFTAbi from '../../utils/abi/nft.json'
import marketplaceabi from 'utils/abi/marketplace.json'
import { ethers } from 'ethers'
import axios from 'axios'
import { NFT1Address, NFT2Address } from 'utils/address'

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
  const [marketplaceData, setMarketplaceData] = useState<any[]>([])
  // const getData = useCallback(async () => {
  //   try {
  //     if (!address || !signerData) return

  //     setLoading(true)

  //     const { data } = await axios.get(
  //       'http://localhost:8001/api/v1/marketplace/',
  //     )
  //     console.log(data)
  //     const marketplaceContract = new ethers.Contract(
  //       MARKETPLACE_CONTRACT_ADDRESS,
  //       marketplaceabi,
  //       signerData as any,
  //     )

  //     const totalAuctionIds = Number(
  //       (await marketplaceContract.totalAuction()).toString(),
  //     )

  //     const result = await Promise.all(
  //       Array.from({ length: totalAuctionIds }).map(async (_, id) => {
  //         const auctionInfo = await marketplaceContract.auctionInfo(id)

  //         return {
  //           auctionId: id.toString(),
  //           contractAddress: marketplaceContract.address,
  //           tokenId: auctionInfo.tokenId.toString(),
  //           owner: auctionInfo.auctioner,
  //           heighestBidder: auctionInfo.highestBidder,
  //           heighestBid: formatEther(auctionInfo.highestBid.toString()),
  //           saleType:
  //             auctionInfo.saleType.toString() === '0'
  //               ? ISaleType.AUCTION
  //               : ISaleType.FIXED_SALE,
  //           status:
  //             auctionInfo.status.toString() === '0'
  //               ? IMarketplaceStatus.LIVE
  //               : IMarketplaceStatus.FINISHED,
  //           start: Number(auctionInfo.start.toString()) * 1000,
  //           end: Number(auctionInfo.end.toString()) * 1000,
  //           prevBidAmounts: auctionInfo.prevBidAmounts,
  //           prevBidders: auctionInfo.prevBidders,
  //           tokenAddress: auctionInfo.tokenaddress,
  //           contractType: IContractType.ERC721,
  //           // ...tokenDetails,
  //           erc721TokenAddress: auctionInfo.tokencontract,
  //         }
  //       }),
  //     )

  //     setData(result.filter((f) => f.status !== IMarketplaceStatus.FINISHED))
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }, [address, signerData])

  console.log(data)
  console.log(marketplaceData)
  const getData = useCallback(async () => {
    try {
      if (!address || !signerData) return

      const { data } = await axios.get(
        'http://localhost:8001/api/v1/marketplace/',
      )

      setMarketplaceData(data)

      setLoading(true)
      const nftContract1 = new ethers.Contract(
        NFT1Address,
        NFTAbi,
        signerData as any,
      )

      const totalIdsNft1 = Number((await nftContract1.totalSupply()).toString())

      const result1 = await Promise.all(
        Array.from({ length: totalIdsNft1 }).map(async (_, id) => {
          const address = await nftContract1.ownerOf(id)
          const details = await nftContract1.tokenURI(id)
          return {
            Id: id.toString(),
            owner: address,
            nftAddress: NFT1Address,
            details: details,
          }
        }),
      )

      const nft2contract = new ethers.Contract(
        NFT2Address,
        NFTAbi,
        signerData as any,
      )

      const totalIds = Number((await nft2contract.totalSupply()).toString())
      const result = await Promise.all(
        Array.from({ length: totalIds }).map(async (_, id) => {
          const address = await nft2contract.ownerOf(id)
          const details = await nft2contract.tokenURI(id)

          console.log(details)
          return {
            Id: id.toString(),
            owner: address,
            nftAddress: NFT2Address,
            details: details,
          }
        }),
      )
      setData([...result1, ...result])
    } catch (error) {
      console.log('------Error On Profile--------')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [address, signerData])

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
          {marketplaceData.map((s) => (
            <>
              {f.nftAddress === s.collectionAddress && f.Id === s.tokenId && (
                <FixedCard
                  key={i}
                  status=""
                  tokenId={f.Id}
                  owner={f.owner}
                  dataAsk={s.ask}
                  dataOrderHash={s.orderHash}
                />
              )}
            </>
          ))}
        </>
      ))}
    </div>
  )
}

export default Main
