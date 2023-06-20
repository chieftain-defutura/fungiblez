import React, { useCallback, useEffect, useState } from 'react'
import { baseURL } from 'api'
import axios from 'axios'
import { IMarketplace } from 'constants/types'
import { ethers } from 'ethers'
import { useParams } from 'react-router-dom'
import { NFT1Address } from 'utils/address'
import { useAccount, useSigner } from 'wagmi'
import NFTAbi from '../../utils/abi/nft.json'
import NftDetails from './NftDetails'

const NftDetailsPage: React.FC = () => {
  const { id, collectionAddress } = useParams()
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const [loading, setLoading] = useState(false)
  console.log(loading)

  const [detailsData, setDetailsData] = useState<{
    name: string
    description: string
    image: string
  }>()
  const [data, setData] = useState<IMarketplace>()
  const [detailaddress, setDetailsAddress] = useState('')
  console.log(data)
  console.log(detailaddress)
  console.log(detailsData)
  const getData = useCallback(async () => {
    try {
      if (!address || !signerData || !id || !collectionAddress) return

      const { data } = await axios.get(
        `${baseURL}/marketplace/${collectionAddress}/${id}`,
      )
      setData(data)
      console.log(data)
      const nftContract1 = new ethers.Contract(
        NFT1Address,
        NFTAbi,
        signerData as any,
      )

      const detailaddress = await nftContract1.ownerOf(id)
      const details = await nftContract1.tokenURI(id)
      setDetailsAddress(detailaddress)
      const { data: detailsdata } = await axios.get(
        `https://ipfs.io/ipfs/${details}`,
      )
      setDetailsData(detailsdata)
    } catch (error) {
      console.log('------Error On Profile--------')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [address, signerData, id])

  useEffect(() => {
    getData()
  }, [getData])

  if (!data) {
    return <div>no data</div>
  }
  return (
    <div>
      <NftDetails
        detailsData={detailsData}
        dataAsk={data as IMarketplace}
        owner={detailaddress}
        id={id as string}
      />
    </div>
  )
}

export default NftDetailsPage
