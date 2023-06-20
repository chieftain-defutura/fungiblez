import React, { useCallback, useEffect, useState } from 'react'
import Card from './components/Card'
import NFTAbi from '../../utils/abi/nft.json'
import mintAbi from '../../utils/abi/minted.json'
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers'
import {
  MINTED_EXCHANGE,
  NFT1Address,
  NFT2Address,
  TRANSFER_MANAGER_ERC721,
} from 'utils/address'
import { CardLoader } from 'components'
import axios from 'axios'
import { IMarketplace } from 'constants/types'
import { baseURL } from 'api'

interface IMyNfts {}

const MyNfts: React.FC<IMyNfts> = () => {
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const [loading, setLoading] = useState(false)
  const [isApproved, setIsApproved] = useState<
    {
      nftAddress: string
      isApproved: boolean
    }[]
  >([])
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

      const { data: marketplaceData } = await axios.get<IMarketplace[]>(
        `${baseURL}/marketplace/`,
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
          }
        }),
      )

      const result = await Promise.all(
        marketplaceData.map(async (f) => {
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

      const data = [
        ...filteredData.filter(
          (f) => f.owner.toLowerCase() === address.toLowerCase(),
        ),
        ...result1.filter(
          (f) => f.owner.toLowerCase() === address.toLowerCase(),
        ),
      ]

      const unique = data.filter(
        (obj, index) =>
          data.findIndex(
            (item) => item.Id === obj.Id && item.owner === obj.owner,
          ) === index,
      )

      setData([...unique])
    } catch (error) {
      console.log('------Error On Profile--------')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [address, signerData])

  const fetchApprove = useCallback(async () => {
    if (!address || !signerData) return
    const nftAddress = [NFT1Address, NFT2Address]

    const isApprovedData = await Promise.all(
      nftAddress.map(async (f) => {
        const nftContract = new ethers.Contract(
          f.toLowerCase(),
          NFTAbi,
          signerData as any,
        )

        const value = await nftContract.setApprovalForAll(
          address,
          TRANSFER_MANAGER_ERC721,
        )
        return {
          nftAddress: f,
          isApproved: Boolean(value),
        }
      }),
    )

    setIsApproved(isApprovedData)
  }, [address, signerData])

  useEffect(() => {
    handleGetData()
    fetchApprove()
  }, [handleGetData, fetchApprove])

  console.log(data)

  if (loading) {
    return <CardLoader />
  }

  if (data && !data.length) {
    return <div className="loader">No Data</div>
  }

  return (
    <>
      <div className="card_wrapper">
        {data.map((f, i) => (
          <Card
            key={i}
            isApproved={isApproved}
            refetchApprove={fetchApprove}
            token_address={f.nftAddress}
            token_id={f.Id}
            details={f.details}
            contract_type={''}
            owner_of={f.owner}
            name={''}
            symbol={''}
            marketplaceId=""
            marketplaceOwner=""
            dataAsk={f.dataAsk}
          />
        ))}
      </div>
    </>
  )
}

export default MyNfts
