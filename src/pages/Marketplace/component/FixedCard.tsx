import React, { useCallback, useEffect, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers'
import axios from 'axios'

import MintedABI from '../../../utils/abi/minted.json'
import TokenAbi from '../../../utils/abi/token.json'
import { MINTED_EXCHANGE, WCRO } from 'utils/address'
import { Backdrop, Button, LazyImage, ModalHeader } from 'components'
import { useTransactionModal } from 'hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { formatEther } from 'helpers/formatters'
import { IMarketplace } from 'constants/types'

interface IData {
  tokenId: string
  owner: string
  details: any
  status: string
  dataAsk: IMarketplace
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
  details,
}) => {
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const { setTransaction } = useTransactionModal()
  const [open, setOpen] = useState(false)
  const [detailsData, setDetailsData] = useState<{
    name: string
    description: string
    image: string
  }>()

  const getData = useCallback(async () => {
    const { data } = await axios.get(`https://ipfs.io/ipfs/${details}`)
    setDetailsData(data)
    console.log(data)
  }, [details])

  useEffect(() => {
    getData()
  }, [getData])
  console.log(dataAsk)

  const handleWCRO = async () => {
    setOpen(false)
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

      const takerBid: any = [
        false,
        address,
        `${dataAsk.ask.price}`,
        dataAsk.tokenId,
        dataAsk.ask.minPercentageToAsk,
        dataAsk.ask.params,
      ]
      const makerAsk: any = [
        dataAsk.ask.isOrderAsk,
        dataAsk.ask.signer,
        dataAsk.ask.collection,
        `${dataAsk.ask.price}`,
        dataAsk.tokenId,
        dataAsk.ask.amount,
        dataAsk.ask.strategy,
        dataAsk.ask.currency,
        dataAsk.ask.nonce,
        dataAsk.ask.startTime,
        dataAsk.ask.endTime,
        dataAsk.ask.minPercentageToAsk,
        dataAsk.ask.params,
        dataAsk.orderHash.v,
        dataAsk.orderHash.r,
        dataAsk.orderHash.s,
      ]

      // const gaslimit = await contract.estimateGas.matchAskWithTakerBid(
      //   takerBid,
      //   makerAsk,
      // )
      const tx = await contract.matchAskWithTakerBid(takerBid, makerAsk)
      await tx.wait()
      console.log('saled')
      setTransaction({ loading: true, status: 'success' })

      // if (allowance <= 0) {
      //   const txa = await erc20Contract
      //     .approve(MINTED_EXCHANGE, ethers.constants.MaxUint256)
      //     .send({ from: address })
      //   await txa.wait()
      //   const tx = await contract.matchAskWithTakerBid(takerBid, makerAsk)
      //   await tx.wait()
      //   console.log('saled')
      //   setTransaction({ loading: true, status: 'success' })
      // } else {
      //   const tx = await contract.matchAskWithTakerBid(takerBid, makerAsk)
      //   await tx.wait()
      //   console.log('saled')
      //   setTransaction({ loading: true, status: 'success' })
      // }
    } catch (error) {
      setOpen(false)
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
    setOpen(false)
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
          `${dataAsk.ask.price}`,
          dataAsk.tokenId,
          dataAsk.ask.minPercentageToAsk,
          dataAsk.ask.params,
        ],
        [
          dataAsk.ask.isOrderAsk,
          dataAsk.ask.signer,
          dataAsk.ask.collection,
          `${dataAsk.ask.price}`,
          dataAsk.tokenId,
          dataAsk.ask.amount,
          dataAsk.ask.strategy,
          dataAsk.ask.currency,
          dataAsk.ask.nonce,
          dataAsk.ask.startTime,
          dataAsk.ask.endTime,
          dataAsk.ask.minPercentageToAsk,
          dataAsk.ask.params,
          dataAsk.orderHash.v,
          dataAsk.orderHash.r,
          dataAsk.orderHash.s,
        ],

        // { value: ethers.utils.parseEther(`${dataAsk.price}`).toString() },
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
  //@typescript-eslint/no-unused-vars

  return (
    <div className="nft_card">
      <div className="nft_card-container">
        <div className="nft_card-container_image">
          <LazyImage src={`https://ipfs.io/ipfs/${detailsData?.image}`} />
        </div>
        <div className="nft_card-container_content">
          <div>
            <h3 style={{ fontSize: '3.2rem', lineHeight: '3.2rem' }}>
              {detailsData?.name}
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
            {/* <p>price:{heighestBid}</p> */}
          </div>
        </div>
        <div className="nft_card-container_controls">
          {address?.toLowerCase() !== owner.toLowerCase() ? (
            <Button onClick={() => setOpen(true)}>Buy</Button>
          ) : (
            <Button>Owner</Button>
          )}
        </div>

        <Backdrop handleClose={() => setOpen(false)} isOpen={open}>
          <AnimatePresence exitBeforeEnter>
            {open && (
              <motion.div
                className={'modal wallet_modal'}
                onClick={(e) => e.stopPropagation()}
                animate="animate"
                initial="initial"
                exit="exit"
              >
                <div className="wallet_modal-content">
                  <ModalHeader
                    title="Put On Sale"
                    handleClose={() => setOpen(false)}
                  />
                  {address?.toLowerCase() !== owner.toLowerCase() && (
                    <>
                      <div>
                        <h3 style={{ fontSize: '18px', paddingBottom: '15px' }}>
                          Price : {formatEther(dataAsk.ask.price)}
                        </h3>
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {/* <Button onClick={handleSale}>Buy</Button> */}
                        <Button style={{ width: '100%' }} onClick={handleCRO}>
                          $bit
                        </Button>
                        <Button style={{ width: '100%' }} onClick={handleWCRO}>
                          $wbit
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Backdrop>
      </div>
    </div>
  )
}

export default FixedCard
