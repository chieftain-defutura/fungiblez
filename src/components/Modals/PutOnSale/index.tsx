import React, { useState } from 'react'
import Backdrop from '../Backdrop'
import { AnimatePresence, motion } from 'framer-motion'
import ModalHeader from '../ModalHeader'
import Button from 'components/Button'
import './PutOnSale.scss'
import FixedSaleForm from './component/FixedSaleForm'
import AuctionForm from './component/AuctionForm'

interface IPutOnSaleModal {
  modal: boolean
  handleClose: React.Dispatch<React.SetStateAction<boolean>>
  id: string
  nftAddress: string
}

const PutOnSale: React.FC<IPutOnSaleModal> = ({
  modal,
  handleClose,
  id,
  nftAddress,
}) => {
  // const [putOnSaleOpen, setPutOnSaleOpen] = useState('')

  return (
    <Backdrop handleClose={() => handleClose(false)} isOpen={modal}>
      <AnimatePresence exitBeforeEnter>
        {modal && (
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
                handleClose={() => handleClose(false)}
              />
              {/* {!putOnSaleOpen && (
                <>
                  <div>
                    <Button
                      variant="primary-outline"
                      onClick={() => setPutOnSaleOpen('fixedSale')}
                    >
                      FixedSale
                    </Button>
                  </div>
                  <div style={{ margin: '32px 0' }}>
                    <Button
                      variant="primary-outline"
                      onClick={() => setPutOnSaleOpen('auction')}
                    >
                      Auction
                    </Button>
                  </div>
                </>
              )} */}
              <div>
                {/* {putOnSaleOpen === 'fixedSale' && ( */}
                <FixedSaleForm
                  nftAddress={nftAddress}
                  id={id}
                  modal={modal}
                  handleClose={handleClose}
                />
                {/* )} */}
              </div>

              {/* <div>
                {putOnSaleOpen === 'auction' && (
                  <AuctionForm
                    setPutOnSaleOpen={setPutOnSaleOpen}
                    id={id}
                    nftaddress={nftAddress}
                  />
                )}
              </div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Backdrop>
  )
}

export default PutOnSale
