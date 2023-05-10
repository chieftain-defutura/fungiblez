import React, { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Backdrop from './Backdrop'
import { modalVaraints } from 'constants/variants'

interface IReactModal {
  children: ReactNode
  handleClose?: () => void
  isOpen: boolean
  overlay?: boolean
}

interface IModal {
  children: ReactNode
  handleClose?: () => void
  isOpen: boolean
  overlay?: boolean
}

const BaseModal: React.FC<IModal> = ({
  children,
  handleClose,
  isOpen,
  overlay = true,
}) => {
  if (!isOpen) return null

  return (
    <Backdrop isOpen={isOpen} handleClose={handleClose} overlay={overlay}>
      <AnimatePresence exitBeforeEnter>
        {isOpen && (
          <motion.div
            onClick={(e) => e.stopPropagation()}
            variants={modalVaraints}
            className="fixed-modal"
            animate="animate"
            initial="initial"
            exit="initial"
            key="content"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Backdrop>
  )
}

const Modal: React.FC<IReactModal> = (props) => {
  const element = document.getElementById('react-modal')
  if (!element) return null

  return createPortal(
    <BaseModal {...props}>{props.children}</BaseModal>,
    element,
  )
}

export default Modal
