import React, { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

import './CopyText.scss'
import { useUpdateEffect } from 'hooks'
import { ReactComponent as CopyIcon } from 'assets/icons/copy.svg'

interface ICopyTextProps {
  text: string
}

const CopyText: React.FC<ICopyTextProps> = ({ text }) => {
  const [copied, setCopied] = useState(false)

  useUpdateEffect(() => {
    if (!copied) return

    const timeperiod = setTimeout(() => setCopied(false), 3000)

    return () => {
      clearTimeout(timeperiod)
    }
  }, [copied])

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => {
        setCopied(true)
      }}
    >
      <div className="clipboard">
        <div className={copied ? 'clipboard-text active' : 'clipboard-text'}>
          <CopyIcon />
        </div>
        <div
          className={copied ? 'clipboard-message active' : 'clipboard-message'}
        >
          copied
        </div>
      </div>
    </CopyToClipboard>
  )
}

export default React.memo(CopyText)
