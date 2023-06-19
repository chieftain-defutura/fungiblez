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
  const { id } = useParams()
  const { address } = useAccount()
  const [data, setData] = useState<IMarketplace>()

  const getData = useCallback(async () => {
    const { data } = await axios.get<IMarketplace>(
      `${baseURL}/marketplace/${id}`,
    )
    setData(data)
  }, [id])

  useEffect(() => {
    getData()
  }, [getData])

  console.log(data)
  return (
    <>
      {data?.offers.map((f) => (
        <div className="offers-wrapper">
          <h2>Offers</h2>

          <div className="offer-price-content">
            <div className="offer-price-para">
              <h6>Price</h6>
              <div className="content">
                <MantelIcon width={34} height={34} className="cronos" />
                <p>{formatEther(f.price)}.00</p>
              </div>
              {owner === address && (
                <div className="hand-img">
                  <img src={HandImg} alt="" />
                  <Offer
                    data={data.offers[0]}
                    dataAsk={dataAsk}
                    owner={owner}
                  />
                </div>
              )}
            </div>
            <div className="offer-price-para">
              <h6>Expiration</h6>
              <div className="content">
                <p>in {new Date(data.ask.endTime).getDay()} days</p>
              </div>
            </div>
            <div className="offer-price-para">
              <h6>From</h6>
              <div className="content">
                <p>
                  {dataAsk.ask.signer?.slice(0, 6)}...
                  {dataAsk.ask.signer?.slice(dataAsk.ask.signer?.length - 6)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default AcceptOffer

interface IOffer {
  owner: string
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
}

const Offer: React.FC<IOffer> = ({ owner, data, dataAsk }) => {
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

      console.log(takerAsk)
      console.log(makerBid)
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
    <div>
      {owner === address && (
        <>
          <p onClick={handleAcceptOfferWithWcro}>Accept Offer </p>
        </>
      )}
    </div>
  )
}
