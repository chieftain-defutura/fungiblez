import { Backdrop, Button, ModalHeader } from 'components'
import { ethers } from 'ethers'
import { AnimatePresence, motion } from 'framer-motion'
import { formatEther } from 'helpers/formatters'
import { useTransactionModal } from 'hooks'
import { MINTED_EXCHANGE, WCRO } from 'utils/address'
import { useAccount, useSigner } from 'wagmi'

import MintedABI from '../../../utils/abi/minted.json'
import TokenAbi from '../../../utils/abi/token.json'
import { IMarketplace } from 'constants/types'

interface IBuyNFT {
  owner: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  open: boolean
  dataAsk: IMarketplace
}

const BuyNFT: React.FC<IBuyNFT> = ({ owner, setOpen, open, dataAsk }) => {
  const { address } = useAccount()
  const { data: signerData, refetch } = useSigner()
  const { setTransaction } = useTransactionModal()

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
      console.log('saled')
      refetch()
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
      )
      await tx.wait()
      console.log('saled')
      refetch()
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
    <div>
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
  )
}

export default BuyNFT
