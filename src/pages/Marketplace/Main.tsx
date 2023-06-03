import React, { useEffect, useCallback, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers'
import axios from 'axios'

import { NFT1Address, NFT2Address } from 'utils/address'
import NFTAbi from '../../utils/abi/nft.json'
import FixedCard from './component/FixedCard'
import { CardLoader } from 'components'
import { baseURL } from 'api'

interface IMarketplaceMainProps {
  selectedFilter: string | null
  searchInput: string
}

const Main: React.FC<IMarketplaceMainProps> = () => {
  const { data: signerData } = useSigner()
  const { address } = useAccount()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [marketplaceData, setMarketplaceData] = useState<any[]>([])

  console.log(data)
  console.log(marketplaceData)
  const getData = useCallback(async () => {
    try {
      if (!address || !signerData) return

      const { data } = await axios.get(`${baseURL}/marketplace/`)

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
    <div className="card_wrapper">
      {data.map((f, i) => (
        <>
          {marketplaceData.map((s) => (
            <>
              {f.nftAddress === s.collectionAddress && f.Id === s.tokenId && (
                <FixedCard
                  key={i}
                  status=""
                  tokenId={f.Id}
                  details={f.details}
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
