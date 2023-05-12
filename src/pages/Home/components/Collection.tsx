import React from 'react'

import CardDetails from './CardDetails'
import { ICollectionData } from 'constants/types'
import { getEllipsisTxt } from 'helpers/formatters'
import { CardLoader, LazyImage } from 'components'
import { Link } from 'react-router-dom'

interface ICollectionProps {
  title: string
  data: ICollectionData[]
  // loading: boolean;
}

const Collection: React.FC<ICollectionProps> = ({ title, data }) => {
  // if (loading) {
  //   return <CardLoader />;
  // }

  return (
    <div className="home_collection">
      <h2 className="mb-20">{title}</h2>
      <div className="pad">
        <div className="card_wrapper">
          {data.map((collection, i) => {
            return (
              <Link
                to={`/collections/${collection.contract_address}`}
                key={i.toString()}
              >
                <div className="home_collection-card">
                  <div className="home_collection-card_image">
                    <LazyImage src={collection.img} />
                  </div>
                  <CardDetails
                    image={collection.img}
                    collection_name={collection.name}
                    owner={getEllipsisTxt(collection.contract_address)}
                    likes={0}
                    price={collection.crofloor / 10 ** 18}
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Collection
