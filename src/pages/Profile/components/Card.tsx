import React, { useState } from 'react'
import { IUserNfts } from 'constants/types'
import { Button } from 'components'
import { useAccount, useSigner } from 'wagmi'
import { Web3Button } from '@web3modal/react'
import PutOnSale from 'components/Modals/PutOnSale'
import { MARKETPLACE_CONTRACT_ADDRESS } from 'utils/address'
import NFTAbi from '../../../utils/abi/nft.json'
import { useTransactionModal } from 'hooks'
import { ethers } from 'ethers'

interface ICard extends IUserNfts {
  isApproved: {
    nftAddress: string
    isApproved: boolean
  }[]
  refetchApprove: () => Promise<void>
}

const Card: React.FC<ICard> = (props) => {
  const { data: signerData } = useSigner()
  const { token_id, metadata, refetchApprove, isApproved, token_address } =
    props
  const { setTransaction } = useTransactionModal()
  const [open, setOpen] = useState(false)
  const { address } = useAccount()

  const nftApproved = isApproved.find(
    (s) => s.nftAddress.toLowerCase() === token_address.toLocaleLowerCase(),
  )

  const handleApproveToken = async () => {
    try {
      if (!signerData || !address) return

      setTransaction({
        loading: true,
        status: 'pending',
      })
      const tokenContract = new ethers.Contract(
        token_address,
        NFTAbi,
        signerData as any,
      )
      const tx = await tokenContract.setApprovalForAll(
        MARKETPLACE_CONTRACT_ADDRESS,
        true,
      )
      await tx.wait()
      setTransaction({
        loading: true,
        status: 'success',
      })
      refetchApprove()
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    } catch (error) {
      console.log(error)
      setTransaction({ loading: true, status: 'error' })
    }
  }

  return (
    <div className="nft_card">
      <div className="nft_card-container">
        <div className="nft_card-container_image">
          {/* <LazyImage src={metadata?.image} /> */}
        </div>
        <div className="nft_card-container_content">
          <div>
            <h3 style={{ fontSize: '3.2rem', lineHeight: '3.2rem' }}>
              {metadata ? metadata.name : 'unnamed'}
            </h3>
          </div>
          <div>
            <p>
              Token Id #<b>{token_id}</b>
            </p>
          </div>
        </div>
        <div className="nft_card-container_controls">
          {address ? (
            nftApproved?.isApproved ? (
              <Button
                onClick={(e) => {
                  setOpen(true)
                }}
              >
                Put On Sale
              </Button>
            ) : (
              <Button onClick={handleApproveToken}>Approve</Button>
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
  )
}

export default Card
