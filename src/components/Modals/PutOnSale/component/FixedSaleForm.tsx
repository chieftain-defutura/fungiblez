import React from 'react'
import Button from 'components/Button'
import { Field, Form, Formik } from 'formik'
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers'
import * as Yup from 'yup'

import { useTransactionModal } from 'hooks'

import { COLLECTION, MINTED_EXCHANGE, STRATEGY, WCRO } from 'utils/address'
import axios from 'axios'

// const tokensLists = [
//   {
//     tokenAddress: CRO,
//     isApproved: false,
//     name: 'CRO',
//     balance: 0,
//   },
//   {
//     tokenAddress: WCRO,
//     isApproved: false,
//     name: 'WCRO',
//     balance: 0,
//   },
// ]

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
  const { address } = useAccount()
  const { data: signerData } = useSigner()
  const { setTransaction } = useTransactionModal()

  const validationSchema = Yup.object({
    amount: Yup.number()
      .positive('Amount must be greater than zero')
      .required('Amount is required'),
  })

  const handlePutOnSale = async (values: any) => {
    if (!address || !signerData) return

    try {
      setTransaction({
        loading: true,
        status: 'pending',
      })

      // rsv generating
      const domain = {
        name: 'MintedExchange',
        version: '1',
        chainId: '11155111',
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
        signer: address,
        collection: COLLECTION,
        price: ethers.utils.parseEther(`${values.amount}`).toString(),
        tokenId: id,
        amount: 1,
        strategy: STRATEGY,
        currency: WCRO,
        nonce: 0,
        startTime: 1684824393,
        endTime: 1687416368,
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

      // storing data in database
      const data = await axios.post(
        'http://localhost:8001/api/v1/marketplace/create',
        {
          userAddress: address,
          status: 'pending',
          tokenId: id,
          collectionAddress: nftAddress,
          ask: {
            isOrderAsk: true,
            signer: address,
            collection: COLLECTION,
            price: ethers.utils.parseEther(`${values.amount}`).toString(),
            tokenId: id,
            amount: 1,
            strategy: STRATEGY,
            currency: WCRO,
            nonce: 0,
            startTime: 1684824393,
            endTime: 1687416368,
            minPercentageToAsk: 8500,
            params: '0x',
          },
          orderHash: {
            r: `0x${_r.toString('hex')}`,
            s: `0x${_s.toString('hex')}`,
            v: _v.toString(),
          },
        },
      )
      console.log(data)

      //token generating
      // const contract = new ethers.Contract(
      //   MINTED_EXCHANGE,
      //   MintedABI,
      //   signerData as any,
      // )
      // if (token === 'wrco') {
      //   const tx = await contract.matchAskWithTakerBid([
      //     {
      //       isOrderAsk: true,
      //       signer: address,
      //       collection: COLLECTION,
      //       price: ethers.utils.parseEther('1.99').toString(),
      //       tokenId: id,
      //       amount: 1,
      //       strategy: STRATEGY,
      //       currency: WCRO,
      //       nonce: 0,
      //       startTime: 1684824393,
      //       endTime: 1687416368,
      //       minPercentageToAsk: 8500,
      //       params: '0x',
      //       r: `0x${_r.toString('hex')}`,
      //       s: `0x${_s.toString('hex')}`,
      //       v: _v.toString(),
      //     },
      //   ])
      //   await tx.wait()
      // }
      // if (token === 'cro') {
      //   const tx = await contract.matchAskWithTakerBidUsingETHAndWETH([
      //     {
      //       isOrderAsk: true,
      //       signer: address,
      //       collection: COLLECTION,
      //       price: ethers.utils.parseEther(values.amount).toString(),
      //       tokenId: id,
      //       amount: 1,
      //       strategy: STRATEGY,
      //       currency: WCRO,
      //       nonce: 0,
      //       startTime: 1684824393,
      //       endTime: 1687416368,
      //       minPercentageToAsk: 8500,
      //       params: '0x',
      //       r: `0x${_r.toString('hex')}`,
      //       s: `0x${_s.toString('hex')}`,
      //       v: _v.toString(),
      //     },
      //   ])
      //   await tx.wait()
      // }

      setTransaction({
        loading: true,
        status: 'success',
      })
    } catch (error) {
      console.log('------Error On Put on sale--------')
      console.log(error)
      handleClose(true)
      setTransaction({ loading: true, status: 'error' })
    }
  }
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
              <div>
                <Field type="number" placeholder="Amount" name="amount" />
                {touched.amount && errors.amount ? (
                  <p>{errors.amount}</p>
                ) : null}
              </div>

              {/* <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: '20px',
                }}
              >
                <div className="" onClick={() => setToken('wcro')}>
                  WCRO TOKEN
                </div>
                <div className="" onClick={() => setToken('cro')}>
                  CRO TOKEN
                </div>
              </div> */}

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
