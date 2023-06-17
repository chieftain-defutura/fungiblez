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
  const { id } = useParams()
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const [loading, setLoading] = useState(false)
  console.log(loading)

  const [detailsData, setDetailsData] = useState<{
    name: string
    description: string
    image: string
  }>()
  const [data, setData] = useState<any[]>([])
  console.log(data)

  const getData = useCallback(async () => {
    try {
      if (!address || !signerData) return

      const { data } = await axios.get<IMarketplace[]>(
        `${baseURL}/marketplace/`,
      )

      const nftContract1 = new ethers.Contract(
        NFT1Address,
        NFTAbi,
        signerData as any,
      )

      let details = ''

      const filteredData = await Promise.all(
        data
          .filter((f) => f.tokenId === id)
          .map(async (s, i) => {
            const address = await nftContract1.ownerOf(id)
            details = await nftContract1.tokenURI(id)
            console.log(address)
            console.log(details)
            return {
              dataAsk: s,
              details: details,
              owner: address,
              Id: id,
            }
          }),
      )

      const { data: detailsdata } = await axios.get(
        `https://ipfs.io/ipfs/${details}`,
      )
      setDetailsData(detailsdata)

      setData([...filteredData])
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
  return (
    <div>
      {data.map((f, i) => (
        <NftDetails
          key={i}
          detailsData={detailsData}
          dataAsk={f.dataAsk}
          owner={f.owner}
          id={id as string}
        />
      ))}
    </div>
  )
}

export default NftDetailsPage
