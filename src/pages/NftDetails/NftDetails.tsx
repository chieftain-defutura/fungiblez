import React, { useState } from 'react'
import './NFTDetails.scss'
import { Button, LazyImage } from 'components'
import { useAccount } from 'wagmi'

import { IMarketplace } from 'constants/types'
import { ReactComponent as MantelIcon } from '../../assets/icons/mantelIcon.svg'
import MakeOffer from './components/MakeOffer'
import BuyNFT from './components/BuyNFT'
import AcceptOffer from './components/AcceptOffer'
import { formatEther } from 'helpers/formatters'

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
          <img src={`https://ipfs.io/ipfs/${detailsData?.image}`} />
        </div>
        <div className="details-wrapper"></div>
      </div>
      <div className="right-container">
        <div className="header-wrapper">
          <div className="nft_card-container_controls">
            <h1>{detailsData?.name}</h1>
            <h4>
              Owned By : {dataAsk.userAddress?.slice(0, 6)}...
              {dataAsk.userAddress?.slice(dataAsk.userAddress?.length - 6)}{' '}
            </h4>
            <div className="price">
              <MantelIcon width={34} height={34} className="cronos" />{' '}
              {formatEther(dataAsk.ask.price)}.00
            </div>
            {address?.toLowerCase() !== owner.toLowerCase() ? (
              <div className="buttons">
                <Button onClick={() => setOpen(true)}>Buy</Button>
                <Button
                  variant="primary-outline"
                  onClick={() => setOpenOffer(true)}
                >
                  Make Offer
                </Button>
              </div>
            ) : (
              <>
                <Button>Owner</Button>
              </>
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
