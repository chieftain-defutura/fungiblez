import { Button, LazyImage } from 'components'
import { ethers } from 'ethers'
import { useTransactionModal } from 'hooks'
import React, { useCallback, useEffect, useState } from 'react'
import MintedABI from '../../../utils/abi/minted.json'
import { useAccount, useSigner } from 'wagmi'
import { MINTED_EXCHANGE } from 'utils/address'
import axios from 'axios'

interface IData {
  tokenId: any
  owner: string
  status: string
  dataAsk: {
    isOrderAsk: boolean
    signer: string
    collection: string
    price: string
    tokenId: string
    amount: number
    strategy: string
    currency: string
    nonce: number
    startTime: number
    endTime: number
    minPercentageToAsk: number
    params: string
  }
  details: string
}
const OnSaleFixedCard: React.FC<IData> = ({ tokenId, details }) => {
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const { setTransaction } = useTransactionModal()
  const [detailsData, setDetailsData] = useState<{
    name: string
    description: string
    image: string
  }>()

  const handleRemove = async () => {
    if (!address || !signerData) return

    try {
      setTransaction({ loading: true, status: 'pending' })
      const contract = new ethers.Contract(
        MINTED_EXCHANGE,
        MintedABI,
        signerData as any,
      )

      console.log(contract)
      const tx = await contract.cancelAllOrdersForSender(1)
      await tx.wait()
      console.log('added')

      setTransaction({ loading: true, status: 'success' })
    } catch (error) {
      console.log(error)
      const Error = Array(error).map((f: any) => f.reason)
      const message = Error.toString().split(':')

      setTransaction({
        loading: true,
        status: 'error',
        message: `${message[2]}  `,
      })
    }
  }

  const getData = useCallback(async () => {
    const { data } = await axios.get(`https://ipfs.io/ipfs/${details}`)
    setDetailsData(data)
    console.log(data)
  }, [details])

  useEffect(() => {
    getData()
  }, [getData])

  return (
    <div className="nft_card">
      <div className="nft_card-container">
        <div className="nft_card-container_image">
          <LazyImage src={`https://ipfs.io/ipfs/${detailsData?.image}`} />
        </div>
        <div className="nft_card-container_content">
          <div>
            <h3 style={{ fontSize: '3.2rem', lineHeight: '3.2rem' }}>
              {' '}
              {detailsData ? detailsData.name : 'unnamed'}
            </h3>
          </div>
          <div>
            {/* <p>
              Token address: {tokenaddress?.slice(0, 6)}...
              {tokenaddress?.slice(tokenaddress?.length - 6)}
            </p> */}
            <p>
              Token Id #<b>{tokenId}</b>
            </p>
          </div>
        </div>
        <div className="nft_card-container_controls">
          <Button onClick={handleRemove}>Remove Sale</Button>
        </div>
      </div>
    </div>
  )
}

export default OnSaleFixedCard
