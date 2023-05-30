import { Button, LazyImage } from 'components'
import { ethers } from 'ethers'
import { useTransactionModal } from 'hooks'
import React from 'react'
// import { MARKETPLACE_CONTRACT_ADDRESS } from 'utils/address'
import MintedABI from '../../../utils/abi/minted.json'
import { useAccount, useSigner } from 'wagmi'
import TokenAbi from '../../../utils/abi/token.json'
import { MINTED_EXCHANGE, WCRO } from 'utils/address'

interface IData {
  tokenId: string
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
  dataOrderHash: {
    r: string
    s: string
    v: string
  }
}
const FixedCard: React.FC<IData> = ({
  tokenId,
  owner,
  status,
  dataAsk,
  dataOrderHash,
}) => {
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const { setTransaction } = useTransactionModal()

  // console.log(dataAsk)
  // console.log(dataOrderHash)

  // const handleSale = async () => {
  //   if (!address || !signerData) return

  //   try {
  //     setTransaction({ loading: true, status: 'pending' })
  //     // const erc20Contract = new ethers.Contract(
  //     //   tokenaddress,
  //     //   TokenAbi,
  //     //   signerData as any,
  //     // )

  //     // const allowance = Number(
  //     //   (
  //     //     await erc20Contract.allowance(address, MARKETPLACE_CONTRACT_ADDRESS)
  //     //   ).toString(),
  //     // )
  //     // console.log(allowance)
  //     // if (allowance <= 0) {
  //     //   const tx = await erc20Contract.approve(
  //     //     MARKETPLACE_CONTRACT_ADDRESS,
  //     //     ethers.constants.MaxUint256,
  //     //   )
  //     //   await tx.wait()
  //     // }

  //     // const contract = new ethers.Contract(
  //     //   MARKETPLACE_CONTRACT_ADDRESS,
  //     //   MarketplaceABI,
  //     //   signerData as any,
  //     // )

  //     // const tx = await contract.finishFixedSale(auctionId)
  //     // await tx.wait()
  //     console.log('saled')
  //     setTransaction({ loading: true, status: 'success' })
  //   } catch (error) {
  //     const Error = Array(error).map((f: any) => f.reason)
  //     const message = Error.toString().split(':')

  //     setTransaction({
  //       loading: true,
  //       status: 'error',
  //       message: `${message[2]}  `,
  //     })
  //   }
  // }

  const handleWCRO = async () => {
    if (!address || !signerData) return

    try {
      setTransaction({ loading: true, status: 'pending' })

      const erc20Contract = new ethers.Contract(
        WCRO,
        TokenAbi,
        signerData as any,
      )

      const allowance = Number(
        (await erc20Contract.allowance(address, MINTED_EXCHANGE)).toString(),
      )
      console.log(allowance)
      if (allowance <= 0) {
        const tx = await erc20Contract.approve(
          MINTED_EXCHANGE,
          ethers.constants.MaxUint256,
        )
        await tx.wait()
      }

      const contract = new ethers.Contract(
        MINTED_EXCHANGE,
        MintedABI,
        signerData as any,
      )

      const tx = await contract.matchAskWithTakerBid(
        [
          false,
          address,
          `${dataAsk.price}`,
          dataAsk.tokenId,
          dataAsk.minPercentageToAsk,
          dataAsk.params,
        ],
        [
          dataAsk.isOrderAsk,
          dataAsk.signer,
          dataAsk.collection,
          `${dataAsk.price}`,
          dataAsk.tokenId,
          dataAsk.amount,
          dataAsk.strategy,
          dataAsk.currency,
          dataAsk.nonce,
          dataAsk.startTime,
          dataAsk.endTime,
          dataAsk.minPercentageToAsk,
          dataAsk.params,
          dataOrderHash.v,
          dataOrderHash.r,
          dataOrderHash.s,
        ],
      )
      await tx.wait()
      console.log('saled')
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

  const handleCRO = async () => {
    if (!address || !signerData) return

    try {
      setTransaction({ loading: true, status: 'pending' })

      const contract = new ethers.Contract(
        MINTED_EXCHANGE,
        MintedABI,
        signerData as any,
      )

      const tx = await contract.matchAskWithTakerBidUsingETHAndWETH(
        [
          false,
          address,
          `${dataAsk.price}`,
          dataAsk.tokenId,
          dataAsk.minPercentageToAsk,
          dataAsk.params,
        ],
        [
          dataAsk.isOrderAsk,
          dataAsk.signer,
          dataAsk.collection,
          `${dataAsk.price}`,
          dataAsk.tokenId,
          dataAsk.amount,
          dataAsk.strategy,
          dataAsk.currency,
          dataAsk.nonce,
          dataAsk.startTime,
          dataAsk.endTime,
          dataAsk.minPercentageToAsk,
          dataAsk.params,
          dataOrderHash.v,
          dataOrderHash.r,
          dataOrderHash.s,
        ],
      )
      await tx.wait()
      console.log('saled')
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

  return (
    <div className="nft_card">
      <div className="nft_card-container">
        <div className="nft_card-container_image">
          <LazyImage src="" />
        </div>
        <div className="nft_card-container_content">
          <div>
            <h3 style={{ fontSize: '3.2rem', lineHeight: '3.2rem' }}>name</h3>
          </div>
          <div>
            {/* <p>
              Token address: {tokenaddress?.slice(0, 6)}...
              {tokenaddress?.slice(tokenaddress?.length - 6)}
            </p> */}
            <p>
              Token Id #<b>{tokenId}</b>
            </p>
            {/* <p>price:{heighestBid}</p> */}
          </div>
        </div>
        <div className="nft_card-container_controls">
          {address?.toLowerCase() !== owner.toLowerCase() && (
            <div style={{ display: 'flex', gap: '5px' }}>
              {/* <Button onClick={handleSale}>Buy</Button> */}
              <Button onClick={handleWCRO}>WCRO</Button>
              <Button onClick={handleCRO}>CRO</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FixedCard
