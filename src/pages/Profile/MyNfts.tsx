import React, { useCallback, useEffect, useState } from 'react'
import Card from './components/Card'
import NFTAbi from '../../utils/abi/nft.json'
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers'
import {
  MARKETPLACE_CONTRACT_ADDRESS,
  NFT1Address,
  NFT2Address,
} from 'utils/address'
import { CardLoader } from 'components'

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
  const [data, setData] = useState<
    {
      Id: string
      owner: any
      nftAddress: string
      details: string
    }[]
  >([])

  const handleGetData = useCallback(async () => {
    if (!address || !signerData) return

    try {
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
          console.log(details)
          return {
            Id: id.toString(),
            owner: address,
            nftAddress: NFT1Address,
            details: details,
          }
        }),
      )

      const contract = new ethers.Contract(
        NFT2Address,
        NFTAbi,
        signerData as any,
      )

      const totalIds = Number((await contract.totalSupply()).toString())
      const result = await Promise.all(
        Array.from({ length: totalIds }).map(async (_, id) => {
          const address = await contract.ownerOf(id)
          const details = await contract.tokenURI(id)

          console.log(details)
          return {
            Id: id.toString(),
            owner: address,
            nftAddress: NFT2Address,
            details: details,
          }
        }),
      )

      console.log([...result1, ...result])
      setData([
        ...result1.filter(
          (f) => f.owner.toLowerCase() === address.toLowerCase(),
        ),
        ...result.filter(
          (f) => f.owner.toLowerCase() === address.toLowerCase(),
        ),
      ])
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
        console.log(f)
        const nftContract = new ethers.Contract(f, NFTAbi, signerData as any)
        const value = await nftContract.isApprovedForAll(
          address,
          MARKETPLACE_CONTRACT_ADDRESS,
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

  console.log(isApproved)
  if (loading) {
    return <CardLoader />
  }

  if (data && !data.length) {
    return <div className="loader">No Data</div>
  }

  return (
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
        />
      ))}
    </div>
  )
}

export default MyNfts
