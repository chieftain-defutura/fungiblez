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
import { IMarketplace } from 'constants/types'

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
            data: undefined,
            isfinished: true,
          }
        }),
      )

      const result = await Promise.all(
        result1.map(async (f) => {
          const { data } = await axios.get<IMarketplace>(
            `${baseURL}/marketplace/${f.nftAddress}/${f.Id}`,
          )

          if (!data.ask) {
            return {
              Id: f.Id.toString(),
              owner: f.owner,
              nftAddress: NFT1Address,
              details: f.details,
              data: undefined,
              isfinished: true,
            }
          }

          if (data.ask) {
            const nonce =
              await mintexchangeContract.isUserOrderNonceExecutedOrCancelled(
                data.ask.signer,
                data.ask.nonce,
              )
            console.log(nonce)

            return {
              Id: data.tokenId.toString(),
              owner: f.owner,
              nftAddress: NFT1Address,
              details: f.details,
              data: data,
              isfinished: nonce,
            }
          }
        }),
      )

      console.log(result)

      setData([...result])
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
          <FixedCard
            key={i}
            status=""
            tokenId={f.Id}
            details={f.details}
            owner={f.owner}
            dataAsk={f.data}
            nftAddress={f.nftAddress}
            dataOrderHash={f.orderHash}
            finished={f.isfinished}
          />
        </>
      ))}
    </div>
  )
}

export default Main
