import React from 'react'

// import Item from "pages/Collections/Item";
// import { useGetCollectionsVolumeQuery } from "store/services/exploreApi";

const TrendingCollection: React.FC = () => {
  // const { data } = useGetCollectionsVolumeQuery({});

  // if (!data) return null;

  return (
    <div className="trending_collection">
      <h2>TrendingCollection</h2>
      <div className="table_container">
        <table>
          <thead>
            <tr>
              <th>Collection</th>
              <th>Floor</th>
              <th>Total Vol</th>
              <th>Vol Usdc</th>
              <th>Owners</th>
            </tr>
          </thead>
          <tbody>
            {/* {data.slice(0, 10).map((collection, i) => (
              <Item key={collection._id} index={i} {...collection} />
            ))} */}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TrendingCollection
