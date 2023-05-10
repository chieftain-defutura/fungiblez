import React, { CSSProperties, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import './Dropdown.scss'
import { ReactComponent as DownArrow } from 'assets/icons/down_arrow.svg'

type Option = {
  label: string
  value: string
}

interface IDropdown {
  list: Option[]
  handleChange: (value: Option) => void
  className?: string
  style?: CSSProperties
}

const Dropdown: React.FC<IDropdown> = ({
  list,
  handleChange,
  className,
  style,
}) => {
  const [openDropdown, setOpenDropdown] = useState(false)
  const [selectedValue, setSelectedValue] = useState(list[0])

  const classNames = className ? `dropdown ${className}` : `dropdown`

  return (
    <div className={classNames} style={style}>
      <button
        className="dropdown_header"
        type="button"
        onClick={() => setOpenDropdown((d) => !d)}
      >
        <span>{selectedValue.label}</span>
        <DownArrow />
      </button>
      <AnimatePresence>
        {openDropdown && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.7 }}
            exit={{ opacity: 0 }}
            className="dropdown_lists"
          >
            {list
              .filter((f) => f.label !== selectedValue.label)
              .map((c) => (
                <p
                  key={c.value}
                  onClick={() => {
                    setSelectedValue(c)
                    handleChange(c)
                    setOpenDropdown(false)
                  }}
                >
                  {c.label}
                </p>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default React.memo(Dropdown)
