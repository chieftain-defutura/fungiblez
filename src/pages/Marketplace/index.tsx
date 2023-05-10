import React, { useState } from 'react'

import './Marketplace.scss'
import Main from './Main'
import { FilterLayout } from 'components'
import MarketplaceCollection from './MarketplaceCollection'

const collectionFilters = [
  { label: 'Price: Low to high', value: 'asc' },
  { label: 'Price: High to low', value: 'desc' },
]

const Marketplace: React.FC<{}> = () => {
  const [selectedFilter, setSelectedfilter] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState('')

  return (
    <div className="Marketplace">
      <div className="mx pad">
        <FilterLayout
          dropdownFilter={collectionFilters}
          handleChangeInput={(val) => setSearchInput(val)}
          handleChangeDropdown={(val) => setSelectedfilter(val)}
          renderFilterBox={<MarketplaceCollection />}
          renderMain={
            <Main selectedFilter={selectedFilter} searchInput={searchInput} />
          }
          onMountOpenFilter={true}
        />
      </div>
    </div>
  )
}

export default Marketplace
