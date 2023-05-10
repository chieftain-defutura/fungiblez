import React, { ReactNode, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import './FilterLayout.scss'
import Dropdown from 'components/Dropdown'
import { ReactComponent as Search } from 'assets/icons/search.svg'
import { useDebounce } from 'usehooks-ts'

interface IFilterLayout {
  renderFilterBox: ReactNode
  renderMain: ReactNode
  onMountOpenFilter?: boolean
  dropdownFilter: { label: string; value: string }[]
  handleChangeDropdown: (val: string) => void
  handleChangeInput?: (val: string) => void
}

const FilterLayout: React.FC<IFilterLayout> = ({
  renderMain,
  onMountOpenFilter = false,
  dropdownFilter,
  handleChangeDropdown,
  handleChangeInput,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(onMountOpenFilter)
  const [searchInput, setSearchInput] = useState('')
  const debouncedValue = useDebounce(searchInput, 1000)

  useMemo(() => {
    if (handleChangeInput) handleChangeInput(debouncedValue)
    setIsFilterOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  return (
    <main className="main-container">
      <div className="main-header">
        <div className="filterlayout">
          <section className="filterlayout_container">
            <div className="filterlayout_container-searchbox">
              <div className="searchbox-wrapper">
                <Search />
                <input
                  min="0"
                  type="number"
                  placeholder="Token ID..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>
            <Dropdown
              list={dropdownFilter}
              handleChange={(val) => handleChangeDropdown(val.value)}
              className="filterlayout-dropdown"
            />
          </section>
        </div>
      </div>
      <div className="main-content">
        <AnimatePresence initial={false}>
          <motion.aside layout className="aside_wrapper">
            <motion.main
              initial="collapsed"
              animate="open"
              exit="collapsed"
              layout
              variants={{
                open: { opacity: 1, marginLeft: isFilterOpen ? 0 : 0 },
                collapsed: { marginLeft: 0 },
              }}
              transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="content-box"
            >
              {renderMain}
            </motion.main>
          </motion.aside>
        </AnimatePresence>
      </div>
    </main>
  )
}

export default FilterLayout
