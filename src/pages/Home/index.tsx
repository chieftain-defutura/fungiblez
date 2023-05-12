import React, { useState } from 'react'

import './Home.scss'
import Hero from './components/Hero'
import Collection from './components/Collection'
import TrendingCollection from './components/TrendingCollection'
import { IAllCollection } from 'constants/types'

const collectionData = {
  topCollection: [
    {
      contract_address: 'string',
      total: 1,
      owners: 'string',
      volcro: 'string',
      volusdc: 'string',
      name: 'string',
      crofloor: 1,
      img: 'string',
      usdcfloor: 1,
      isVerified: false,
    },
    {
      contract_address: 'string',
      total: 1,
      owners: 'string',
      volcro: 'string',
      volusdc: 'string',
      name: 'string',
      crofloor: 1,
      img: 'string',
      usdcfloor: 1,
      isVerified: false,
    },
  ],
  latestCollection: [
    {
      contract_address: 'string',
      total: 1,
      owners: 'string',
      volcro: 'string',
      volusdc: 'string',
      name: 'string',
      crofloor: 1,
      img: 'string',
      usdcfloor: 1,
      isVerified: true,
    },
    {
      contract_address: 'string',
      total: 1,
      owners: 'string',
      volcro: 'string',
      volusdc: 'string',
      name: 'string',
      crofloor: 1,
      img: 'string',
      usdcfloor: 1,
      isVerified: true,
    },
  ],
}

const Home: React.FC<IAllCollection> = () => {
  const data = useState(collectionData)
  return (
    <div className="home">
      <div className="mx pad">
        <Hero />
        <Collection
          title="Most Popular Collections"
          // loading={isLoading}
          data={data[0].topCollection}
        />
        <Collection
          title="Latest Collections"
          // loading={isLoading}
          data={data[0]?.latestCollection}
        />
        <TrendingCollection />
      </div>
    </div>
  )
}

export default Home
