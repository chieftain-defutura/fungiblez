import React from 'react'
import Button from 'components/Button'
import { Field, Form, Formik } from 'formik'
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers'
import * as Yup from 'yup'

import { useTransactionModal } from 'hooks'

import {
  MINTED_EXCHANGE,
  NFT1Address,
  STRATEGY,
  TRANSFER_MANAGER_ERC721,
  WCRO,
} from 'utils/address'
import NftAbi from '../../../../utils/abi/nft.json'
import axios from 'axios'
import { baseURL } from 'api'
import { useUserStore } from 'constants/storeuser'

interface IFixedSaleForm {
  modal: boolean
  id: string
  nftAddress: string
  handleClose: React.Dispatch<React.SetStateAction<boolean>>
}
const FixedSaleForm: React.FC<IFixedSaleForm> = ({
  nftAddress,
  id,
  handleClose,
}) => {
  const { data: nonceData, fetch } = useUserStore()
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const { setTransaction } = useTransactionModal()
  const validationSchema = Yup.object({
    amount: Yup.number()
      .positive('Amount must be greater than zero')
      .required('Amount is required'),
  })

  const handlePutOnSale = async (values: any) => {
    handleClose(false)
    if (!address || !signerData || !nonceData) return

    try {
      setTransaction({
        loading: true,
        status: 'pending',
      })

      const contract = new ethers.Contract(
        NFT1Address,
        NftAbi,
        signerData as any,
      )

      const ApprovedForAll = await contract.isApprovedForAll(
        NFT1Address,
        TRANSFER_MANAGER_ERC721,
      )

      if (ApprovedForAll) {
        const tx = await contract.setApprovalForAll(
          TRANSFER_MANAGER_ERC721,
          true,
        )
        await tx.wait()
      }

      // rsv generating
      const domain = {
        name: 'MintedExchange',
        version: '1',
        chainId: '5001',
        verifyingContract: MINTED_EXCHANGE,
      }

      const EIP712Domain = [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ]

      const permit = {
        isOrderAsk: true,
        signer: nonceData.user,
        collection: nftAddress,
        price: ethers.utils.parseEther(`${values.amount}`).toString(),
        tokenId: id,
        amount: 1,
        strategy: STRATEGY,
        currency: WCRO,
        nonce: nonceData.nonce,
        startTime: Math.round(Date.now() / 1000),
        endTime: Math.round((Date.now() + 86400000) / 1000),
        minPercentageToAsk: 8500,
        params: '0x',
      }

      const Permit = [
        { name: 'isOrderAsk', type: 'bool' },
        { name: 'signer', type: 'address' },
        { name: 'collection', type: 'address' },
        { name: 'price', type: 'uint256' },
        { name: 'tokenId', type: 'uint256' },
        { name: 'amount', type: 'uint256' },
        { name: 'strategy', type: 'address' },
        { name: 'currency', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'startTime', type: 'uint256' },
        { name: 'endTime', type: 'uint256' },
        { name: 'minPercentageToAsk', type: 'uint256' },
        { name: 'params', type: 'string' },
      ]

      const splitSig = (sig: string) => {
        const pureSig = sig.replace('0x', '')

        const _r = Buffer.from(pureSig.substring(0, 64), 'hex')
        const _s = Buffer.from(pureSig.substring(64, 128), 'hex')
        const _v = Buffer.from(
          parseInt(pureSig.substring(128, 130), 16).toString(),
        )

        return { _r, _s, _v }
      }

      let sign
      let r
      let s
      let v

      const msgParams = {
        types: {
          EIP712Domain,
          Permit,
        },
        primaryType: 'Permit',
        domain,
        message: permit,
      }

      const ethereum = window.ethereum as any

      sign = await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [address, JSON.stringify(msgParams)],
      })
      const { _r, _s, _v } = splitSig(sign)
      r = `0x${_r.toString('hex')}`
      s = `0x${_s.toString('hex')}`
      v = _v.toString()

      console.log(r)
      console.log(s)
      console.log(v)

      console.log(nonceData)
      // storing data in database
      const data = await axios.post(`${baseURL}/marketplace/create`, {
        userAddress: nonceData.user,
        status: 'finished',
        tokenId: id,
        collectionAddress: nftAddress,
        ask: {
          isOrderAsk: true,
          signer: nonceData.user,
          collection: nftAddress,
          price: ethers.utils.parseEther(`${values.amount}`).toString(),
          tokenId: id,
          amount: 1,
          strategy: STRATEGY,
          currency: WCRO,
          nonce: nonceData.nonce,
          startTime: Math.round(Date.now() / 1000),
          endTime: Math.round((Date.now() + 86400000) / 1000),
          minPercentageToAsk: 8500,
          params: '0x',
        },
        orderHash: {
          r: `0x${_r.toString('hex')}`,
          s: `0x${_s.toString('hex')}`,
          v: _v.toString(),
        },
      })
      console.log(data)
      fetch(address)
      setTransaction({
        loading: true,
        status: 'success',
      })
      handleClose(false)
    } catch (error) {
      console.log('------Error On Put on sale--------')
      console.log(error)
      handleClose(false)
      setTransaction({ loading: true, status: 'error' })
    }
  }

  // @typescript-eslint/no-unused-vars
  return (
    <div>
      <Formik
        initialValues={{ amount: '' }}
        onSubmit={handlePutOnSale}
        validationSchema={validationSchema}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="fixed-sale-form">
              <div style={{ paddingBottom: '20px' }}>
                <Field type="number" placeholder="Amount" name="amount" />
                {touched.amount && errors.amount ? (
                  <p>{errors.amount}</p>
                ) : null}
              </div>

              <Button variant="ternary" type="submit">
                Confirm
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default FixedSaleForm
