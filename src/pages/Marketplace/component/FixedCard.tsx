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
import { Link } from 'react-router-dom'
import MakeOffer from 'pages/NftDetails/components/MakeOffer'

interface IData {
  tokenId: string
  owner: string
  details: any
  nftAddress: string
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
  nftAddress,
  details,
}) => {
  const { address } = useAccount()
  const { data: signerData, refetch } = useSigner()
  const { setTransaction } = useTransactionModal()
  const [open, setOpen] = useState(false)
  const [openOffer, setOpenOffer] = useState(false)
  const [detailsData, setDetailsData] = useState<{
    name: string
    description: string
    image: string
  }>()

  const getData = useCallback(async () => {
    const { data } = await axios.get(`https://ipfs.io/ipfs/${details}`)
    setDetailsData(data)
  }, [details])

  useEffect(() => {
    getData()
  }, [getData])

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

      const tx = await contract.matchAskWithTakerBid(takerBid, makerAsk)
      await tx.wait()
      refetch()
      console.log('saled')
      setTransaction({ loading: true, status: 'success' })
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
      refetch()
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
  // console.log(dataAsk.isfinished)
  return (
    <Link to={`/nftdetails/${nftAddress}/${tokenId}`}>
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
          <div
            className="nft_card-container_controls"
            onClick={(e) => e.preventDefault()}
          >
            {address?.toLowerCase() !== owner.toLowerCase() ? (
              dataAsk ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  {dataAsk.isfinished === false && (
                    <Button
                      variant="primary-outline"
                      onClick={() => setOpen(true)}
                    >
                      Buy
                    </Button>
                  )}

                  <Button onClick={() => setOpenOffer(true)}>MakeOffer</Button>
                </div>
              ) : (
                <Button onClick={() => setOpenOffer(true)}>MakeOffer</Button>
              )
            ) : (
              <Button>Owner</Button>
            )}
          </div>

          <MakeOffer
            collectionAddress={nftAddress}
            owner={owner}
            openOffer={openOffer}
            setOpenOffer={setOpenOffer}
          />

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
                          <h3
                            style={{ fontSize: '18px', paddingBottom: '15px' }}
                          >
                            Price : {formatEther(dataAsk.ask.price)}
                          </h3>
                        </div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {/* <Button onClick={handleSale}>Buy</Button> */}
                          <Button style={{ width: '100%' }} onClick={handleCRO}>
                            $bit
                          </Button>
                          <Button
                            style={{ width: '100%' }}
                            onClick={handleWCRO}
                          >
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
    </Link>
  )
}

export default FixedCard
