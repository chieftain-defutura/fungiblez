import React, { useEffect, useCallback, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers'
import axios from 'axios'

import { MINTED_EXCHANGE, NFT1Address } from 'utils/address'
import NFTAbi from '../../utils/abi/nft.json'
import mintAbi from '../../utils/abi/minted.json'
import { IMarketplace } from 'constants/types'
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
  // const [marketplaceData, setMarketplaceData] = useState<IMarketplace[]>([])

  console.log(data)
  const getData = useCallback(async () => {
    try {
      if (!address || !signerData) return

      const { data } = await axios.get<IMarketplace[]>(
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
      const result = await Promise.all(
        data.map(async (f, i) => {
          const nonce =
            await mintexchangeContract.isUserOrderNonceExecutedOrCancelled(
              f.ask.signer,
              f.ask.nonce,
            )

          return { ...f, isfinished: nonce }
        }),
      )

      console.log(result)

      const filteredData = await Promise.all(
        result
          .filter((f) => f.isfinished === false)
          .map(async (s, id) => {
            const address = await nftContract1.ownerOf(s.tokenId)
            const details = await nftContract1.tokenURI(s.tokenId)
            console.log(address)
            console.log(details)
            return {
              dataAsk: s,
              details: details,
              owner: address,
              Id: s.tokenId,
            }
          }),
      )

      setData([...filteredData])
      console.log(filteredData)

      // setMarketplaceData(data)

      // setLoading(true)
      // const nftContract1 = new ethers.Contract(
      //   NFT1Address,
      //   NFTAbi,
      //   signerData as any,
      // )

      // const totalIdsNft1 = Number((await nftContract1.totalSupply()).toString())

      // const result1 = await Promise.all(
      //   Array.from({ length: totalIdsNft1 }).map(async (_, id) => {
      //     const address = await nftContract1.ownerOf(id)
      //     const details = await nftContract1.tokenURI(id)
      //     return {
      //       Id: id.toString(),
      //       owner: address,
      //       nftAddress: NFT1Address,
      //       details: details,
      //     }
      //   }),
      // )

      // const nft2contract = new ethers.Contract(
      //   NFT2Address,
      //   NFTAbi,
      //   signerData as any,
      // )

      // const totalIds = Number((await nft2contract.totalSupply()).toString())
      // const result = await Promise.all(
      //   Array.from({ length: totalIds }).map(async (_, id) => {
      //     const address = await nft2contract.ownerOf(id + 1)
      //     const details = await nft2contract.tokenURI(id + 1)

      //     console.log(details)
      //     return {
      //       Id: (id + 1).toString(),
      //       owner: address,
      //       nftAddress: NFT2Address,
      //       details: details,
      //     }
      //   }),
      // )
      // setData([...result1])
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
            dataOrderHash={f.orderHash}
          />
        </>
      ))}
    </div>
  )
}

export default Main
