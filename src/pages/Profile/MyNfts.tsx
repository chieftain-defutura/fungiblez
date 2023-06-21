import React, { useCallback, useEffect, useState } from 'react'
import Card from './components/Card'
import NFTAbi from '../../utils/abi/nft.json'
import mintAbi from '../../utils/abi/minted.json'
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers'
import { MINTED_EXCHANGE, NFT1Address } from 'utils/address'
import { CardLoader } from 'components'
import axios from 'axios'
import { IMarketplace } from 'constants/types'
import { baseURL } from 'api'

interface IMyNfts {}

const MyNfts: React.FC<IMyNfts> = () => {
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any[]>([])

  const handleGetData = useCallback(async () => {
    try {
      if (!address || !signerData) return

      setLoading(true)
      const nftContract1 = new ethers.Contract(
        NFT1Address,
        NFTAbi,
        signerData as any,
      )

      const mintexchangeContract = new ethers.Contract(
        MINTED_EXCHANGE,
        mintAbi,
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

      const getCurrentUserNfts = result1.filter(
        (s) => s.owner.toLowerCase() === address.toLowerCase(),
      )

      console.log(getCurrentUserNfts)

      const result = await Promise.all(
        getCurrentUserNfts.map(async (f) => {
          const { data } = await axios.get<IMarketplace>(
            `${baseURL}/marketplace/${f.nftAddress}/${f.Id}`,
          )
          console.log(data)
          if (!data.ask) {
            return {
              Id: f.Id.toString(),
              owner: address,
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
              owner: address,
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
    handleGetData()
  }, [handleGetData])

  if (loading) {
    return <CardLoader />
  }

  if (data && !data.length) {
    return <div className="loader">No Data</div>
  }

  console.log(data.map((f) => f.isfinished))

  return (
    <>
      <div className="card_wrapper">
        {data.map((f, i) => (
          <Card
            key={i}
            token_address={f.nftAddress}
            token_id={f.Id}
            details={f.details}
            contract_type={''}
            owner_of={f.owner}
            name={''}
            symbol={''}
            marketplaceId=""
            marketplaceOwner=""
            dataAsk={f.data}
            isfinished={f.isfinished}
          />
        ))}
      </div>
    </>
  )
}

export default MyNfts
