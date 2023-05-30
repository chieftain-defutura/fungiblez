import React, { useCallback, useEffect, useState } from 'react'
import { IUserNfts } from 'constants/types'
import { Button, LazyImage } from 'components'
import { useAccount } from 'wagmi'
import { Web3Button } from '@web3modal/react'
import PutOnSale from 'components/Modals/PutOnSale'
// import { useTransactionModal } from 'hooks'
import axios from 'axios'

interface ICard extends IUserNfts {
  isApproved: {
    nftAddress: string
    isApproved: boolean
  }[]
  details: string
  refetchApprove: () => Promise<void>
}

const Card: React.FC<ICard> = (props) => {
  // const { data: signerData } = useSigner()
  const { token_id, token_address, details } = props
  // const { setTransaction } = useTransactionModal()
  const [detailsData, setDetailsData] = useState<{
    name: string
    description: string
    image: string
  }>()
  const [open, setOpen] = useState(false)
  // const [sign, setSign] = useState('')
  const { address } = useAccount()

  // const nftApproved = isApproved.find(
  //   (s) => s.nftAddress.toLowerCase() === token_address.toLocaleLowerCase(),
  // )

  const getData = useCallback(async () => {
    const { data } = await axios.get(`https://ipfs.io/ipfs/${details}`)
    setDetailsData(data)
    console.log(data)
  }, [details])

  useEffect(() => {
    getData()
  }, [getData])

  // const handleApproveToken = async () => {
  //   try {
  //     if (!signerData || !address) return

  //     setTransaction({
  //       loading: true,
  //       status: 'pending',
  //     })
  //     const tokenContract = new ethers.Contract(
  //       token_address,
  //       NFTAbi,
  //       signerData as any,
  //     )
  //     const tx = await tokenContract.setApprovalForAll(
  //       TransferManagerERC721,
  //       true,
  //     )
  //     await tx.wait()
  //     setTransaction({
  //       loading: true,
  //       status: 'success',
  //     })
  //     refetchApprove()
  //     setTimeout(() => {
  //       window.location.reload()
  //     }, 3000)
  //   } catch (error) {
  //     console.log(error)
  //     setTransaction({ loading: true, status: 'error' })
  //   }
  // }

  // const handleSignInPermit = async () => {
  //   const chainId = chain?.id
  //   const from = address

  //   console.log(chainId)

  //   const domain = {
  //     name: 'MintedExchange',
  //     version: '1',
  //     chainId: chainId,
  //     verifyingContract: MINTED_EXCHANGE,
  //   }

  //   const EIP712Domain = [
  //     { name: 'name', type: 'string' },
  //     { name: 'version', type: 'string' },
  //     { name: 'chainId', type: 'uint256' },
  //     { name: 'verifyingContract', type: 'address' },
  //   ]

  //   const permit = {
  //     isOrderAsk: true,
  //     signer: from,
  //     collection: COLLECTION,
  //     // price: ethers.utils.parseEther('1.99').toString(),
  //     tokenId: TOKENID,
  //     amount: 1,
  //     strategy: STRATEGY,
  //     currency: WCRO,
  //     nonce: NONCE,
  //     startTime: 1684824393,
  //     endTime: 1687416368,
  //     minPercentageToAsk: 8500,
  //     params: '0x',
  //   }

  //   const Permit = [
  //     { name: 'isOrderAsk', type: 'bool' },
  //     { name: 'signer', type: 'address' },
  //     { name: 'collection', type: 'address' },
  //     { name: 'price', type: 'uint256' },
  //     { name: 'tokenId', type: 'uint256' },
  //     { name: 'amount', type: 'uint256' },
  //     { name: 'strategy', type: 'address' },
  //     { name: 'currency', type: 'address' },
  //     { name: 'nonce', type: 'uint256' },
  //     { name: 'startTime', type: 'uint256' },
  //     { name: 'endTime', type: 'uint256' },
  //     { name: 'minPercentageToAsk', type: 'uint256' },
  //     { name: 'params', type: 'string' },
  //   ]

  //   const splitSig = (sig: string) => {
  //     const pureSig = sig.replace('0x', '')

  //     const _r = Buffer.from(pureSig.substring(0, 64), 'hex')
  //     const _s = Buffer.from(pureSig.substring(64, 128), 'hex')
  //     const _v = Buffer.from(
  //       parseInt(pureSig.substring(128, 130), 16).toString(),
  //     )

  //     return { _r, _s, _v }
  //   }

  //   let sign
  //   let r
  //   let s
  //   let v

  //   const msgParams = {
  //     types: {
  //       EIP712Domain,
  //       Permit,
  //     },
  //     primaryType: 'Permit',
  //     domain,
  //     message: permit,
  //   }

  //   const ethereum = window.ethereum as any

  //   try {
  //     sign = await ethereum.request({
  //       method: 'eth_signTypedData_v4',
  //       params: [from, JSON.stringify(msgParams)],
  //     })
  //     const { _r, _s, _v } = splitSig(sign)
  //     r = `0x${_r.toString('hex')}`
  //     s = `0x${_s.toString('hex')}`
  //     v = _v.toString()
  //     // setSign(sign)
  //     console.log(sign)
  //     console.log(`r: ${r}`)
  //     console.log(`s: ${s}`)
  //     console.log(`v: ${v}`)
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

  return (
    <div className="nft_card">
      <div className="nft_card-container">
        <div className="nft_card-container_image">
          <LazyImage src={`https://ipfs.io/ipfs/${detailsData?.image}`} />
        </div>
        <div className="nft_card-container_content">
          <div>
            <h3 style={{ fontSize: '3.2rem', lineHeight: '3.2rem' }}>
              {detailsData ? detailsData.name : 'unnamed'}
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
            <Button
              onClick={(e) => {
                setOpen(true)
              }}
            >
              Put On Sale
            </Button>
          ) : (
            //   ) : (
            //     <Button onClick={handleApproveToken}>Approve</Button>
            //   )
            // )
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
