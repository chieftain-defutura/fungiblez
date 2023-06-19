import React, { useCallback, useEffect, useState } from 'react'
// import { MARKETPLACE_CONTRACT_ADDRESS } from 'utils/address'c
import { useAccount, useSigner } from 'wagmi'
import OnSaleFixedCard from './components/OnSaleFixedCard'
import axios from 'axios'
import { ethers } from 'ethers'
import { MINTED_EXCHANGE, NFT1Address } from 'utils/address'
import NFTAbi from '../../utils/abi/nft.json'
import mintAbi from '../../utils/abi/minted.json'

import { baseURL } from 'api'
import { CardLoader } from 'components'
import { IMarketplace } from 'constants/types'

const OnSaleNfts = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  // const [marketplaceData, setMarketplaceData] = useState<any[]>([])
  const { data: signerData, refetch } = useSigner()
  const { address } = useAccount()

  const getData = useCallback(async () => {
    try {
      if (!address || !signerData) return
      setLoading(true)

      const { data } = await axios.get<IMarketplace[]>(
        `${baseURL}/marketplace/`,
      )

      console.log(data)
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
        data.map(async (f) => {
          const nonce =
            await mintexchangeContract.isUserOrderNonceExecutedOrCancelled(
              f.ask.signer,
              f.ask.nonce,
            )

          return { ...f, isfinished: nonce }
        }),
      )

      const filteredData = await Promise.all(
        result
          .filter(
            (f) =>
              f.isfinished === false && f.userAddress === address.toLowerCase(),
          )
          .map(async (s) => {
            const address = await nftContract1.ownerOf(s.tokenId)
            const details = await nftContract1.tokenURI(s.tokenId)

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
      // const nft2contract = new ethers.Contract(
      //   NFT2Address,
      //   NFTAbi,
      //   signerData as any,
      // )

      // const totalIds = Number((await nft2contract.totalSupply()).toString())
      // const result = await Promise.all(
      //   Array.from({ length: totalIds }).map(async (_, id) => {
      //     const address = await nft2contract.ownerOf(id)
      //     const details = await nft2contract.tokenURI(id)

      //     console.log(details)
      //     return {
      //       Id: id.toString(),
      //       owner: address,
      //       nftAddress: NFT2Address,
      //       details: details,
      //     }
      //   }),
      // )
      // setData([...result1])
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
    <div className="card_wrapper">
      {data.map(
        (f, i) => (
          <OnSaleFixedCard
            key={i}
            owner={f.owner}
            status={f.status}
            details={f.details}
            nonce={f.dataAsk.ask.nonce}
            tokenId={f.Id}
            dataAsk={f.dataAsk}
          />
        ),
        // )),
      )}
    </div>
  )
}

export default OnSaleNfts
