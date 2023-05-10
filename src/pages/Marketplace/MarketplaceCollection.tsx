import React from 'react'

import { ReactComponent as CronosIcon } from 'assets/icons/cronos.svg'

const MarketplaceCollection: React.FC = () => {
  return (
    <div className="Marketplace_collection">
      <div className="Marketplace_collection-data">
        <div className="Marketplace_collection-data_card">
          <div className="flex g-10">
            <div>
              <p className="flex">
                <b>name</b>
              </p>
              <p className="flex g-5">
                <CronosIcon width={14} height={14} className="cronos" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketplaceCollection
