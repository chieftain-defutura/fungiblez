import React, { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './Modal.scss'

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

const Backdrop: React.FC<{
  children?: ReactNode
  handleClose?: () => void
  isOpen: boolean
  overlay?: boolean
}> = ({ children, handleClose, isOpen, overlay = true }) => {
  return (
    <AnimatePresence exitBeforeEnter>
      {isOpen && (
        <motion.div
          className="modal_backdrop"
          onClick={() => (overlay && handleClose ? handleClose() : null)}
          variants={backdropVariants}
          animate="animate"
          initial="initial"
          exit="initial"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Backdrop
