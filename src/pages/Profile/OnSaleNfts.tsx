import React, { useCallback, useEffect, useState } from 'react'
// import { MARKETPLACE_CONTRACT_ADDRESS } from 'utils/address'c
import { useAccount, useSigner } from 'wagmi'
import OnSaleFixedCard from './components/OnSaleFixedCard'
import axios from 'axios'
import { ethers } from 'ethers'
import { NFT1Address, NFT2Address } from 'utils/address'
import NFTAbi from '../../utils/abi/nft.json'
import { baseURL } from 'api'

const OnSaleNfts = () => {
  const [data, setData] = useState<any[]>([])
  const [marketplaceData, setMarketplaceData] = useState<any[]>([])
  const { data: signerData } = useSigner()
  const { address } = useAccount()

  console.log(data)
  console.log(marketplaceData)

  const getData = useCallback(async () => {
    try {
      if (!address || !signerData) return

      const { data } = await axios.get(`${baseURL}/marketplace/`)
      console.log(data)
      setMarketplaceData(data)

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
          {marketplaceData.map(
            (s, i) =>
              s.userAddress === f.owner &&
              f.nftAddress === s.collectionAddress &&
              f.Id === s.tokenId && (
                <OnSaleFixedCard
                  key={i}
                  dataAsk={s.ask}
                  tokenId={s.tokenId}
                  owner={f.owner}
                  status={f.status}
                />
              ),
          )}
        </>
      ))}
    </div>
  )
}

export default OnSaleNfts
