import React, { useCallback, useEffect, useState } from 'react'
import { IMarketplace, IUserNfts } from 'constants/types'
import { Button, LazyImage } from 'components'
import { useAccount, useSigner } from 'wagmi'
import { Web3Button } from '@web3modal/react'
import MintedABI from '../../../utils/abi/minted.json'
import PutOnSale from 'components/Modals/PutOnSale'
// import { useTransactionModal } from 'hooks'
import axios from 'axios'
import { useTransactionModal } from 'hooks'
import { ethers } from 'ethers'
import { MINTED_EXCHANGE } from 'utils/address'
import { Link } from 'react-router-dom'

interface ICard extends IUserNfts {
  details: string
  marketplaceId: string
  marketplaceOwner: string
  dataAsk: IMarketplace
  isfinished: boolean
}

const Card: React.FC<ICard> = (props) => {
  const { token_id, token_address, details, dataAsk, isfinished, owner_of } =
    props
  const [detailsData, setDetailsData] = useState<{
    name: string
    description: string
    image: string
  }>()
  const { data: signerData, refetch } = useSigner()
  const { setTransaction } = useTransactionModal()
  const [open, setOpen] = useState(false)
  const { address } = useAccount()

  const handleRemove = async () => {
    if (!address || !signerData || !dataAsk) return

    try {
      setTransaction({ loading: true, status: 'pending' })
      const contract = new ethers.Contract(
        MINTED_EXCHANGE,
        MintedABI,
        signerData as any,
      )

      const tx = await contract.cancelMultipleMakerOrders([dataAsk?.ask.nonce])
      await tx.wait()
      console.log('added')
      refetch()
      setTransaction({ loading: true, status: 'success' })
    } catch (error) {
      console.log(error)
      const Error = Array(error).map((f: any) => f.reason)
      const message = Error.toString().split(':')

      setTransaction({
        loading: true,
        status: 'error',
        message: `${message[2]}  `,
      })
    }
  }

  const getData = useCallback(async () => {
    const { data } = await axios.get(`https://ipfs.io/ipfs/${details}`)
    setDetailsData(data)
  }, [details])

  useEffect(() => {
    getData()
  }, [getData])

  return (
    <Link to={`/nftdetails/${token_address}/${token_id}`}>
      <div className="nft_card">
        <div className="nft_card-container">
          <div className="nft_card-container_image">
            <LazyImage src={`https://ipfs.io/ipfs/${detailsData?.image}`} />
          </div>
          <div className="nft_card-container_content">
            <div>
              <h3
                style={{
                  fontSize: '3.2rem',
                  lineHeight: '3.2rem',
                  textTransform: 'capitalize',
                }}
              >
                {detailsData ? detailsData.name : 'unnamed'}
              </h3>
            </div>
            <div>
              <p>
                Token Id #<b>{token_id}</b>
              </p>
            </div>
          </div>
          <div
            className="nft_card-container_controls"
            onClick={(e) => e.preventDefault()}
          >
            {address ? (
              isfinished === false &&
              owner_of.toLowerCase() === address.toLowerCase() ? (
                <Button onClick={handleRemove}>Remove Sale</Button>
              ) : (
                <Button
                  onClick={(e) => {
                    setOpen(true)
                  }}
                >
                  Put On Sale
                </Button>
              )
            ) : (
              <Web3Button />
            )}

            <PutOnSale
              handleClose={setOpen}
              modal={open}
              id={token_id}
              nftAddress={token_address}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Card
