import React from "react";
import Skeleton from "react-loading-skeleton";

const CardLoader: React.FC = () => {
  return (
    <div className="card_wrapper">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i.toString()} className="nft_card">
          <div className="nft_card-container">
            <div className="nft_card-container_image">
              <Skeleton style={{ aspectRatio: "1" }} />
            </div>
            <div className="nft_card-container_content">
              <Skeleton count={2} />
            </div>
            <div className="nft_card-container_controls">
              <Skeleton height={30} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardLoader;
