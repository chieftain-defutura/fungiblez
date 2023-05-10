import React, { CSSProperties } from 'react'

import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'

interface IModalHeaderProps {
  title?: string
  handleClose?: () => void
  style?: CSSProperties
}

const ModalHeader: React.FC<IModalHeaderProps> = ({
  title,
  handleClose,
  style,
}) => {
  return (
    <div className="modal_header flex-between" style={{ ...style }}>
      <h3>{title}</h3>
      {handleClose && (
        <div className="close" onClick={handleClose}>
          <CloseIcon />
        </div>
      )}
    </div>
  )
}

export default ModalHeader
