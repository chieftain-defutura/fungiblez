import { baseURL } from 'api'
import axios from 'axios'
import { IMarketplace } from 'constants/types'
import { ethers } from 'ethers'
import MintedABI from '../../../utils/abi/minted.json'
import NftAbi from '../../../utils/abi/nft.json'

import { formatEther } from 'helpers/formatters'
import { useTransactionModal } from 'hooks'
import React, { useCallback, useEffect, useState } from 'react'
import { ReactComponent as MantelIcon } from '../../../assets/icons/mantelIcon.svg'
import HandImg from '../../../assets/icons/hand.svg'

import { useAccount, useSigner } from 'wagmi'
import { useParams } from 'react-router-dom'
import {
  MINTED_EXCHANGE,
  NFT1Address,
  TRANSFER_MANAGER_ERC721,
} from 'utils/address'

interface IAcceptOffer {
  owner: string
  dataAsk: IMarketplace
}
const AcceptOffer: React.FC<IAcceptOffer> = ({ owner, dataAsk }) => {
  const { id, collectionAddress } = useParams()
  const [data, setData] = useState<IMarketplace>()

  const getData = useCallback(async () => {
    const { data } = await axios.get<IMarketplace>(
      `${baseURL}/marketplace/${collectionAddress}/${id}`,
    )
    setData(data)
  }, [id, collectionAddress])

  //react-hooks/exhaustive-deps

  useEffect(() => {
    getData()
  }, [getData])

  console.log(data)

  if (!data) {
    return <div>No Offers</div>
  }
  return (
    <>
      <div className="offers-wrapper">
        <h2>Offers</h2>
        <div className="offer-price-para">
          <h6>Price</h6>
          <h6>Expire Date</h6>
          <h6>From</h6>
        </div>
        {data.offers.map((f) => (
          <Offer
            date={f.endTime}
            fromAddress={f.signer}
            price={f.price}
            data={f}
            dataAsk={dataAsk}
            owner={owner}
          />
        ))}
      </div>
    </>
  )
}

export default AcceptOffer

interface IOffer {
  price: number
  date: any
  fromAddress: string
  data: {
    isOrderAsk: boolean
    signer: string
    collection: string
    price: number
    tokenId: number
    amount: number
    strategy: string
    currency: string
    nonce: number
    startTime: number
    endTime: number
    minPercentageToAsk: number
    params: string
  }
  dataAsk: IMarketplace
  owner: string
}

const Offer: React.FC<IOffer> = ({
  price,
  date,
  fromAddress,
  data,
  dataAsk,
  owner,
}) => {
  const { address } = useAccount()
  const { data: signerData, refetch } = useSigner()
  const { setTransaction } = useTransactionModal()

  const handleAcceptOfferWithWcro = async () => {
    if (!address || !signerData) return

    try {
      setTransaction({ loading: true, status: 'pending' })

      const NFTcontract = new ethers.Contract(
        NFT1Address,
        NftAbi,
        signerData as any,
      )

      const ApprovedForAll = await NFTcontract.isApprovedForAll(
        NFT1Address,
        TRANSFER_MANAGER_ERC721,
      )

      if (!ApprovedForAll) {
        const tx = await NFTcontract.setApprovalForAll(
          TRANSFER_MANAGER_ERC721,
          true,
        )
        await tx.wait()
      }
      const contract = new ethers.Contract(
        MINTED_EXCHANGE,
        MintedABI,
        signerData as any,
      )
      const takerAsk = [
        true,
        address,
        `${data.price}`,
        data.tokenId,
        dataAsk.ask.minPercentageToAsk,
        dataAsk.ask.params,
      ]
      const makerBid = [
        data.isOrderAsk,
        data.signer,
        data.collection,
        `${data.price}`,
        data.tokenId,
        data.amount,
        data.strategy,
        data.currency,
        data.nonce,
        data.startTime,
        data.endTime,
        data.minPercentageToAsk,
        data.params,
        dataAsk.orderHash.v,
        dataAsk.orderHash.r,
        dataAsk.orderHash.s,
      ]

      const tx = await contract.matchBidWithTakerAsk(takerAsk, makerBid)
      await tx.wait()
      console.log('saled')
      refetch()
      setTransaction({ loading: true, status: 'success' })

      // }
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

  return (
    <div className="details_wrapper">
      <div className="price" style={{ display: 'flex', alignItems: 'center' }}>
        <MantelIcon width={34} height={34} className="cronos" />
        <p>{formatEther(price)}.00</p>
        {owner === address && (
          <div className="hand-img">
            <img src={HandImg} alt="" />
            {owner === address && (
              <p onClick={handleAcceptOfferWithWcro}>Accept Offer </p>
            )}
          </div>
        )}
      </div>
      <div className="date">
        {new Date(date).getDay() === 0 ? (
          <p>Offer Ended</p>
        ) : (
          <p>in {new Date(date).getDay()} days</p>
        )}
      </div>
      <div className="signer">
        <p>
          {' '}
          {fromAddress?.slice(0, 6)}...
          {fromAddress?.slice(fromAddress?.length - 6)}
        </p>
      </div>
    </div>
  )
}
