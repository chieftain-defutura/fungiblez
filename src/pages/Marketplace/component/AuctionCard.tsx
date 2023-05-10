import React, { useState } from 'react'
import { Button, LazyImage } from 'components'
import { ethers } from 'ethers'
import { useTransactionModal } from 'hooks'
import { MARKETPLACE_CONTRACT_ADDRESS } from 'utils/address'
import MarketplaceABI from '../../../utils/abi/marketplace.json'
import { useAccount, useSigner } from 'wagmi'
import Countdown from './Countdown'
import TokenAbi from '../../../utils/abi/token.json'
import { AnimatePresence, motion } from 'framer-motion'
import ModalHeader from '../../../components/Modals/ModalHeader'
import Backdrop from '../../../components/Modals/Backdrop'
import { formatEther } from 'helpers/formatters'

interface IAuction {
  auctionId: string
  heighestBid: string
  tokenId: string
  tokenaddress: string
  owner: string
  status: string
  endTime: string
}

const AuctionCard: React.FC<IAuction> = ({
  tokenaddress,
  heighestBid,
  auctionId,
  owner,
  endTime,
  status,
}) => {
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const { setTransaction } = useTransactionModal()
  const [open, setOpen] = useState(false)
  const [placeBid, setPlaceBid] = useState('')

  const handleSale = async () => {
    if (!address || !signerData) return

    try {
      setOpen(false)
      setTransaction({ loading: true, status: 'pending' })
      const erc20Contract = new ethers.Contract(
        tokenaddress,
        TokenAbi,
        signerData as any,
      )

      const allowance = Number(
        (
          await erc20Contract.allowance(address, MARKETPLACE_CONTRACT_ADDRESS)
        ).toString(),
      )
      console.log(allowance)

      if (Number(formatEther(allowance) <= Number(heighestBid))) {
        const tx = await erc20Contract.approve(
          MARKETPLACE_CONTRACT_ADDRESS,
          ethers.constants.MaxUint256,
        )
        await tx.wait()
      }

      const contract = new ethers.Contract(
        MARKETPLACE_CONTRACT_ADDRESS,
        MarketplaceABI,
        signerData as any,
      )
      const tx = await contract.placeBid(
        auctionId,
        ethers.utils.parseUnits(placeBid, 18),
      )
      await tx.wait()
      setTransaction({ loading: true, status: 'success' })
    } catch (error) {
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
            <p>
              Token Id #<b>1</b>
            </p>
            <p>price:{heighestBid}</p>
          </div>
        </div>
        <Countdown
          endTime={endTime}
          address={address}
          owner={owner}
          setOpen={setOpen}
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
                  <div
                    className="modal-reserved"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <p>Reserved price</p>
                    <h4>{heighestBid}</h4>
                  </div>
                  <div
                    className="modal-action"
                    style={{
                      display: 'flex',
                      padding: '10px 0',
                      gap: '10px',
                    }}
                  >
                    <label htmlFor="">Price:</label>
                    <input
                      style={{ width: '90%' }}
                      type="number"
                      placeholder="Price"
                      name="price"
                      onChange={(e) => setPlaceBid(e.target.value)}
                    />
                  </div>
                  <div
                    className="modal-btn"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      width: '100%',
                      margin: 'auto',
                    }}
                  >
                    <Button
                      variant="primary"
                      disabled={
                        !placeBid || Number(placeBid) <= Number(heighestBid)
                      }
                      onClick={handleSale}
                    >
                      Place Bid
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Backdrop>
      </div>
    </div>
  )
}

export default AuctionCard
