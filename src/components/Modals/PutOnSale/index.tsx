import React from 'react'
import Backdrop from '../Backdrop'
import { AnimatePresence, motion } from 'framer-motion'
import ModalHeader from '../ModalHeader'
import './PutOnSale.scss'
import FixedSaleForm from './component/FixedSaleForm'

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

              <div>
                <FixedSaleForm
                  nftAddress={nftAddress}
                  id={id}
                  modal={modal}
                  handleClose={handleClose}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Backdrop>
  )
}

export default PutOnSale
