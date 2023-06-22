import React from 'react'
import CreateForm from './CreateForm'
import { Button } from 'components'
import { useTransactionModal } from 'hooks'
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers'
import { WCRO } from 'utils/address'
import tokenAbi from '../../utils/abi/token.json'

const Create: React.FC<{}> = () => {
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const { setTransaction } = useTransactionModal()

  const handleMintToken = async () => {
    try {
      if (!signerData || !address) return

      setTransaction({ loading: true, status: 'pending' })

      const mintTokenContract = new ethers.Contract(
        WCRO,
        tokenAbi,
        signerData as any,
      )
      const tx = await mintTokenContract.mint(address, '1000000000000000000000')
      await tx.wait()
      setTransaction({ loading: true, status: 'success' })
    } catch (error: any) {
      console.log(error.reason)
      setTransaction({ loading: true, status: 'error', message: error.reason })
    }
  }
  return (
    <div className="create_collection">
      <div className="mx pad">
        <CreateForm />
        <Button onClick={handleMintToken}>Mint Token</Button>
      </div>
    </div>
  )
}

export default Create
