import React from 'react'
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers'

import './CreateForm.scss'
import { useTransactionModal } from 'hooks'
import nftAbi from '../../utils/abi/nft.json'
import { NFT1Address, NFT2Address } from 'utils/address'
import { Button } from 'components'

const CreateForm: React.FC<{}> = () => {
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const { setTransaction } = useTransactionModal()

  const handleMint = async (nftAddress: string) => {
    try {
      if (!signerData || !address) return

      setTransaction({ loading: true, status: 'pending' })

      const mintContract = new ethers.Contract(
        nftAddress,
        nftAbi,
        signerData as any,
      )
      const tx = await mintContract.createNFT(address, '', '')
      await tx.wait()
      setTransaction({ loading: true, status: 'success' })
    } catch (error: any) {
      console.log(error.reason)
      setTransaction({ loading: true, status: 'error', message: error.reason })
    }
  }

  return (
    <div className="create_form">
      <div className="form_card">
        <Button onClick={() => handleMint(NFT1Address)}>mint nft 1</Button>
      </div>
      <div className="form_card">
        <Button onClick={() => handleMint(NFT2Address)}>mint nft 2</Button>
      </div>
    </div>
  )
}

export default CreateForm
