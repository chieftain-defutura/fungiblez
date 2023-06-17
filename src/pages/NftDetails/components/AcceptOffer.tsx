import { baseURL } from 'api'
import axios from 'axios'
import { Button } from 'components'
import { IMarketplace } from 'constants/types'
import { ethers } from 'ethers'
import MintedABI from '../../../utils/abi/minted.json'
import { formatEther } from 'helpers/formatters'
import { useTransactionModal } from 'hooks'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MINTED_EXCHANGE, WCRO } from 'utils/address'
import { useAccount, useSigner } from 'wagmi'

interface IAcceptOffer {
  owner: string
  dataAsk: IMarketplace
}
const AcceptOffer: React.FC<IAcceptOffer> = ({ owner, dataAsk }) => {
  const { id } = useParams()
  const [data, setData] = useState<IMarketplace>()

  const getData = useCallback(async () => {
    const { data } = await axios.get<IMarketplace>(
      `${baseURL}/marketplace/${id}`,
    )
    setData(data)
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  return (
    <div>
      {data?.offers.map((f) => (
        <div style={{ padding: '20px' }}>
          <h5>offered user:{f.signer}</h5>
          {f.price === undefined ? (
            <p>no price</p>
          ) : (
            <p>price: {formatEther(f.price)}</p>
          )}
          <Offer owner={owner} data={f} dataAsk={dataAsk} />
        </div>
      ))}
    </div>
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
  const { data: signerData } = useSigner()
  const { setTransaction } = useTransactionModal()

  const handleAcceptOfferWithWcro = async () => {
    if (!address || !signerData) return

    try {
      setTransaction({ loading: true, status: 'pending' })

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
          <Button onClick={handleAcceptOfferWithWcro}>Accept Offer </Button>
        </>
      )}
    </div>
  )
}
