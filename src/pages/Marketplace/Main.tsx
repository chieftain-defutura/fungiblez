import React, { useEffect, useCallback, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers'
import axios from 'axios'

import { MINTED_EXCHANGE, NFT1Address } from 'utils/address'
import NFTAbi from '../../utils/abi/nft.json'
import mintAbi from '../../utils/abi/minted.json'
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

  const getData = useCallback(async () => {
    try {
      if (!address || !signerData) return

      const { data: marketplaceData } = await axios.get(
        `${baseURL}/marketplace/`,
      )
      const mintexchangeContract = new ethers.Contract(
        MINTED_EXCHANGE,
        mintAbi,
        signerData as any,
      )

      const nftContract1 = new ethers.Contract(
        NFT1Address,
        NFTAbi,
        signerData as any,
      )
      // const result = await Promise.all(
      //   data.map(async (f, i) => {
      //     const nonce =
      //       await mintexchangeContract.isUserOrderNonceExecutedOrCancelled(
      //         f.ask.signer,
      //         f.ask.nonce,
      //       )

      //     return { ...f, isfinished: nonce }
      //   }),
      // )

      // const filteredData = await Promise.all(
      //   result
      //     .filter((f) => f.isfinished === false)
      //     .map(async (s) => {
      //       const address = await nftContract1.ownerOf(s.tokenId)
      //       const details = await nftContract1.tokenURI(s.tokenId)
      //       return {
      //         dataAsk: s,
      //         details: details,
      //         owner: address,
      //         Id: s.tokenId,
      //       }
      //     }),
      // )
      // setData([...filteredData])

      const totalId = Number((await nftContract1.totalSupply()).toString())

      const result1 = await Promise.all(
        Array.from({ length: totalId }).map(async (s, id) => {
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

      const result = await Promise.all(
        marketplaceData.map(async (f: any) => {
          const nonce =
            await mintexchangeContract.isUserOrderNonceExecutedOrCancelled(
              f.ask.signer,
              f.ask.nonce,
            )

          return { ...f, isfinished: nonce }
        }),
      )

      const filteredData = await Promise.all(
        result.map(async (s: any) => {
          const address = await nftContract1.ownerOf(s.tokenId)
          const details = await nftContract1.tokenURI(s.tokenId)

          return {
            dataAsk: s,
            details: details,
            owner: address,
            nftAddress: NFT1Address,
            Id: s.tokenId,
          }
        }),
      )

      const data = [...filteredData, ...result1]

      console.log(data)

      const unique = data.filter(
        (obj, index) => data.findIndex((item) => item.Id === obj.Id) === index,
      )

      console.log(unique)
      setData([...unique])
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

  // console.log(data.filter((f) => f.dataAsk?.isfinished === false).map((s) => s))
  // @typescript-eslint/no-unused-vars

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
          <FixedCard
            key={i}
            status=""
            tokenId={f.Id}
            details={f.details}
            owner={f.owner}
            dataAsk={f.dataAsk}
            nftAddress={f.nftAddress}
            dataOrderHash={f.orderHash}
          />
        </>
      ))}
    </div>
  )
}

export default Main
