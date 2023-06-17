import React, { useState } from 'react'
import './NFTDetails.scss'
import { Button } from 'components'
import { useAccount } from 'wagmi'

import { IMarketplace } from 'constants/types'
import { ReactComponent as MantelIcon } from '../../assets/icons/mantelIcon.svg'
import Cart from '../../assets/icons/shopping-cart.svg'
import Timer from '../../assets/icons/clock.svg'
import MakeOffer from './components/MakeOffer'
import BuyNFT from './components/BuyNFT'
import AcceptOffer from './components/AcceptOffer'
import { formatEther } from 'helpers/formatters'
import { MINTED_EXCHANGE } from 'utils/address'

interface INftDetails {
  detailsData:
    | {
        name: string
        description: string
        image: string
      }
    | undefined

  dataAsk: IMarketplace
  owner: string
  id: string
}

const NftDetails: React.FC<INftDetails> = ({ detailsData, dataAsk, owner }) => {
  const { address } = useAccount()
  const [open, setOpen] = useState(false)
  const [openOffer, setOpenOffer] = useState(false)

  return (
    <div className="nftdetailpage-container">
      <div className="left-container">
        <div className="image-wrapper">
          <img src={`https://ipfs.io/ipfs/${detailsData?.image}`} alt="" />
        </div>
        <div className="details_wrapper">
          <h2>Details</h2>
          <div className="details-content">
            <div className="content">
              <p>Contract Address</p>
              <p>Token ID</p>
              <p>Token Standard</p>
              <p>Blockchain</p>
            </div>
            <div className="price-content">
              <h5>
                {MINTED_EXCHANGE?.slice(0, 6)}...
                {MINTED_EXCHANGE?.slice(MINTED_EXCHANGE?.length - 6)}
              </h5>
              <p>{dataAsk.tokenId}</p>
              <p>Mantel</p>
              <div className="mentel-content">
                <MantelIcon width={34} height={34} className="cronos" />{' '}
                {formatEther(dataAsk.ask.price)}.00
              </div>
            </div>
          </div>
        </div>
        <div className="about-collection-wrapper">
          <h2>About Collection</h2>
          <p>{detailsData?.description}</p>
        </div>
      </div>
      <div className="right-container">
        <div className="header-wrapper">
          <h2>{detailsData?.name}</h2>
          <h3>
            Owned By : {dataAsk.userAddress?.slice(0, 6)}...
            {dataAsk.userAddress?.slice(dataAsk.userAddress?.length - 6)}{' '}
          </h3>

          <div className="nft-card-content">
            <div className="nft-price-wrapper">
              <div className="price">
                <MantelIcon width={34} height={34} className="cronos" />{' '}
                {formatEther(dataAsk.ask.price)}.00
              </div>
              <div className="timer-content">
                <div className="flex-content">
                  <img src={Timer} alt="" />
                  <p>Ends: </p>
                </div>
                <div>
                  <p>in {new Date(dataAsk.ask.endTime).getDay()} days</p>
                </div>
              </div>
            </div>
            {address?.toLowerCase() !== owner.toLowerCase() ? (
              <div className="buttons">
                <Button
                  onClick={() => setOpen(true)}
                  leftIcon={<img src={Cart} alt="cart" />}
                >
                  Buy
                </Button>
                <Button
                  variant="primary-outline"
                  onClick={() => setOpenOffer(true)}
                >
                  Make Offer
                </Button>
              </div>
            ) : (
              <div className="buttons">
                <Button>Owner</Button>
              </div>
            )}
          </div>

          <BuyNFT
            dataAsk={dataAsk}
            open={open}
            owner={owner}
            setOpen={setOpen}
          />

          <MakeOffer
            collectionAddress={dataAsk.collectionAddress}
            openOffer={openOffer}
            owner={owner}
            setOpenOffer={setOpenOffer}
          />
        </div>
        <div className="offer-wrapper">
          <AcceptOffer owner={owner} dataAsk={dataAsk} />
        </div>
      </div>
    </div>
  )
}

export default NftDetails
