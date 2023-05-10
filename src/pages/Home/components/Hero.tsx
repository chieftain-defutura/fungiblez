import React from 'react'

import { Button } from 'components'

import { ReactComponent as Twitter } from 'assets/icons/twitter.svg'
import { ReactComponent as Github } from 'assets/icons/github.svg'
import { ReactComponent as Medium } from 'assets/icons/medium.svg'
import { ReactComponent as Docs } from 'assets/icons/folder.svg'
import { ReactComponent as Telegram } from 'assets/icons/telegram.svg'
// import CardDetails from "./CardDetails";
// import { ICollectionData } from "constants/types";
// import { getEllipsisTxt } from "helpers/formatters";
import { Link } from 'react-router-dom'

const Hero: React.FC = () => {
  return (
    <div className="hero">
      <div className="hero_wrapper">
        <div className="hero_wrapper-content">
          <h1>Discover, collect, and sell extraordinary NFTs</h1>
          <p className="mb-16 mt-16">
            UngibleZ is the world's first and largest NFT marketplace
          </p>
          <div className="flex g-25 mb-32">
            <Link to="/create">
              <Button variant="primary-outline">Create</Button>
            </Link>
          </div>
          <div>
            <div className="mb-15">
              <strong>Follow us on</strong>
            </div>
            <div className="flex g-32">
              <a
                className="social_icon"
                href="https://t.me/UngibleZ_Ann"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Telegram />
              </a>
              <a
                className="social_icon"
                href="https://twitter.com/ungiblez_"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter />
              </a>
              <a
                className="social_icon"
                href="https://medium.com/@UngibleZ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Medium />
              </a>
              <a
                className="social_icon"
                href="https://github.com/UngibleZ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github />
              </a>
              <a
                className="social_icon"
                href="https://docs.ungiblez.live/guides/introduction"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Docs />
              </a>
              <a
                className="social_icon"
                href="https://t.me/UngibleZ_chat"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Telegram />
              </a>
            </div>
          </div>
        </div>
        <div className="hero_wrapper-card">
          {/* <div>
            {data ? <LazyImage src={data?.img} /> : <Skeleton height={250} />}
            {data ? (
              <CardDetails
                image={data?.img}
                collection_name={data?.name}
                owner={getEllipsisTxt(data?.contract_address)}
                likes={0}
                price={data?.crofloor / 10 ** 18}
              />
            ) : (
              <Skeleton count={2} />
            )}
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Hero
