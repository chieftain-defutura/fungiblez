import { IMarketplace, IOffers } from 'constants/types'
import { ethers } from 'ethers'
import MintedABI from '../../../utils/abi/minted.json'
import NftAbi from '../../../utils/abi/nft.json'

import moment from 'moment'

import { formatEther } from 'helpers/formatters'
import { useTransactionModal } from 'hooks'
import React, { useCallback, useEffect, useState } from 'react'
import { ReactComponent as MantelIcon } from '../../../assets/icons/mantelIcon.svg'
import HandImg from '../../../assets/icons/hand.svg'

import { useAccount, useSigner } from 'wagmi'
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
  const { data: signerData } = useSigner()
  const [data, setData] = useState<IOffers[]>([])

  const getData = useCallback(async () => {
    const mintexchangeContract = new ethers.Contract(
      MINTED_EXCHANGE,
      MintedABI,
      signerData as any,
    )

    if (!dataAsk.offers) {
      return setData([])
    }

    const result = await Promise.all(
      dataAsk.offers.map(async (f) => {
        const nonce =
          await mintexchangeContract.isUserOrderNonceExecutedOrCancelled(
            f.signer,
            f.nonce,
          )
        console.log(nonce)

        return {
          data: f,
          isfinished: nonce,
        }
      }),
    )

    console.log(result)
    const res = result.filter((f) => !f.isfinished).map((r) => r.data)
    setData(res)
  }, [dataAsk, signerData])

  useEffect(() => {
    getData()
  }, [getData])
  //react-hooks/exhaustive-deps
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
        {data
          .filter(
            (f: any) => moment(f.endTime, 'DD/MM/YYYY').fromNow(true) !== '0',
          )
          .map((f: any) => (
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
  date: number
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
    r: string
    s: string
    v: string
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

  const endDate = new Date(date)
  const handleAcceptOfferWithWMNT = async () => {
    if (!address || !signerData) return

    try {
      setTransaction({ loading: true, status: 'pending' })

      const NFTcontract = new ethers.Contract(
        NFT1Address,
        NftAbi,
        signerData as any,
      )

      const ApprovedForAll = await NFTcontract.isApprovedForAll(
        address,
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
        data.minPercentageToAsk,
        data.params,
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
        data.v,
        data.r,
        data.s,
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
    <div className="details_offer_wrapper">
      <div className="price" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="display-price">
          <MantelIcon width={34} height={34} className="cronos" />
          <p>{formatEther(price)}.00</p>
        </div>
        {owner === address && (
          <div className="hand-img">
            <img src={HandImg} alt="" />
            {owner === address && (
              <p onClick={handleAcceptOfferWithWMNT}>Accept Offer </p>
            )}
          </div>
        )}
      </div>
      <div className="date">
        <p>in {moment(endDate, 'DD/MM/YYYY').fromNow(true)}</p>
      </div>
      <div className="signer">
        <p>
          {fromAddress?.slice(0, 6)}...
          {fromAddress?.slice(fromAddress?.length - 6)}
        </p>
      </div>
    </div>
  )
}
